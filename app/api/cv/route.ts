import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN!;
const container = "cv-documents";

export async function GET(req: Request) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const cv = await db.collection("cv").findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(cv || { fr: null, en: null });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch CVs" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const formData = await req.formData();
    const db = await connectDB();
    const cvCollection = db.collection("cv");
    
    // Get current CV data
    const currentCv = (await cvCollection.findOne({})) || { fr: null, en: null };
    const updatedCv: Record<string, string | null> = { ...currentCv };

    // Process each language
    for (const lang of ["fr", "en"] as const) {
      const file = formData.get(lang) as File | null;
      
      if (file) {
        // Validate file type
        if (file.type !== "application/pdf") {
          return NextResponse.json(
            { error: `Only PDF files are allowed for ${lang} CV` },
            { status: 400 }
          );
        }

        // Delete old file if exists
        if (currentCv[lang]) {
          try {
            const oldUrl = new URL(currentCv[lang]!);
            const oldKey = oldUrl.pathname.split("/").filter(Boolean).pop()!;
            await del(oldKey, {
              token: BLOB_TOKEN
            });
          } catch (err) {
            console.warn(`Failed to delete old ${lang} CV:`, err);
          }
        }

        // Upload new file - create clean path without double slashes
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/\s+/g, '_').replace(/\//g, '-');
        const key = `${lang}_${timestamp}_${cleanFileName}`;
        
        const uploadRes = await put(key, buffer, {
          token: BLOB_TOKEN,
          contentType: "application/pdf",
          access: 'public'
        });

        updatedCv[lang] = uploadRes.url;
      }
    }

    // Update database
    await cvCollection.updateOne(
      {},
      { $set: updatedCv },
      { upsert: true }
    );

    return NextResponse.json(updatedCv);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update CVs" },
      { status: 500 }
    );
  }
}