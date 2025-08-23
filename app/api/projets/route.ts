import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN!;

// GET all projects
export async function GET(req: Request) {

  const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 

  try {
    const db = await connectDB();
    const projets = await db.collection("projets").findOne({}, { projection: { _id: 0 } });
    return NextResponse.json(projets || { projects: [] });
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch projets" }, { status: 500 });
  }
}

// PUT - Add or Update a project
export async function PUT(req: Request) {
    const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const formData = await req.formData();
    const db = await connectDB();
    const projetsCollection = db.collection("projets");

    const projectId = formData.get("projectId") as string | null;
    const titleFr = formData.get("titleFr") as string;
    const titleEn = formData.get("titleEn") as string;
    const titleAr = formData.get("titleAr") as string;
    const descFr = formData.get("descFr") as string;
    const descEn = formData.get("descEn") as string;
    const descAr = formData.get("descAr") as string;
    const techStack = JSON.parse(formData.get("techStack") as string || "[]");
    const buttonIcon = formData.get("buttonIcon") as string;
    const buttonLabelFr = formData.get("buttonLabelFr") as string;
    const buttonLabelEn = formData.get("buttonLabelEn") as string;
    const buttonLabelAr = formData.get("buttonLabelAr") as string;
    const buttonLink = formData.get("buttonLink") as string;

    const file = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    // If new image provided → delete old + upload
    if (file) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
      }

      if (projectId) {
        const existing = await projetsCollection.findOne({ "projects._id": projectId });
        const project = existing?.projects?.find((p: any) => p._id === projectId);
        if (project?.image) {
          try {
            const oldUrl = new URL(project.image);
            const oldKey = oldUrl.pathname.split("/").pop();
            if (oldKey) await del(oldKey, { token: BLOB_TOKEN });
          } catch (e) {
            console.error("Delete old image error:", e);
          }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `project_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadRes = await put(key, buffer, {
        token: BLOB_TOKEN,
        contentType: file.type,
        access: "public",
        addRandomSuffix: false,
      });
      imageUrl = uploadRes.url;
    }

    const newProject = {
      _id: projectId || crypto.randomUUID(),
      title: { fr: titleFr, en: titleEn, ar: titleAr },
      description: { fr: descFr, en: descEn, ar: descAr },
      techStack,
      button: {
        icon: buttonIcon,
        label: { fr: buttonLabelFr, en: buttonLabelEn, ar: buttonLabelAr },
        link: buttonLink,
      },
      ...(imageUrl ? { image: imageUrl } : {}),
      updatedAt: new Date(),
    };

    // If editing → update project inside array
    if (projectId) {
      await projetsCollection.updateOne(
        { "projects._id": projectId },
        { $set: { "projects.$": newProject } }
      );
    } else {
      // Insert new project
      await projetsCollection.updateOne(
        {},
        { $push: { projects: newProject }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json(newProject);
  } catch (err: any) {
    console.error("PUT error:", err.message, err.stack);
    return NextResponse.json({ error: err.message || "Failed to save project" }, { status: 500 });
  }
}