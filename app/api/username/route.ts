// app/api/username/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";

export async function GET(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const username = await db.collection("username").findOne({});
    
    // Return the multilingual username object
    return NextResponse.json(username?.name || { fr: "", en: "", ar: "" });
    
  } catch (error) {
    console.error("Username GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch username" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const { name } = await req.json();
    
    if (!name || typeof name !== 'object') {
      return NextResponse.json(
        { error: "Valid name object is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    // Store or update the single username document with multilingual support
    await db.collection("username").updateOne(
      {}, // Empty filter matches the first document (or creates if none exists)
      { 
        $set: { 
          name: {
            fr: name.fr || "",
            en: name.en || "",
            ar: name.ar || ""
          }
        } 
      },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Username updated successfully" }
    );

  } catch (error) {
    console.error("Username POST error:", error);
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
    const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    await db.collection("username").deleteOne({});
    
    return NextResponse.json(
      { success: true, message: "Username deleted successfully" }
    );
    
  } catch (error) {
    console.error("Username DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete username" },
      { status: 500 }
    );
  }
}