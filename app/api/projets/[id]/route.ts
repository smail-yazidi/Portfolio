import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { put, del } from "@vercel/blob";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN!;

// GET one project by id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) 




{   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const projetsCollection = db.collection("projets");

    const projetDoc = await projetsCollection.findOne(
      { "projects._id": params.id },
      { projection: { "projects.$": 1 } }
    );

    if (!projetDoc || !projetDoc.projects?.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(projetDoc.projects[0]);
  } catch (err: any) {
    console.error("GET [id] error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT - Update one project
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 


  try {
    const formData = await req.formData();
    const db = await connectDB();
    const projetsCollection = db.collection("projets");

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

    // Get existing project to preserve old image if needed
    const existing = await projetsCollection.findOne(
      { "projects._id": params.id },
      { projection: { "projects.$": 1 } }
    );
    const oldProject = existing?.projects?.[0];

    if (!oldProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let imageUrl = oldProject?.image; // Keep old image by default

    // Handle new image upload + delete old
    if (file) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
      }

      // Delete old image only if uploading a new one
      if (oldProject?.image) {
        try {
          const oldUrl = new URL(oldProject.image);
          const oldKey = oldUrl.pathname.split("/").pop();
          if (oldKey) await del(oldKey, { token: BLOB_TOKEN });
        } catch (e) {
          console.error("Delete old image error:", e);
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
      imageUrl = uploadRes.url; // overwrite old image
    }

    const updatedProject = {
      _id: params.id,
      title: { fr: titleFr, en: titleEn, ar: titleAr },
      description: { fr: descFr, en: descEn, ar: descAr },
      techStack,
      button: {
        icon: buttonIcon,
        label: { fr: buttonLabelFr, en: buttonLabelEn, ar: buttonLabelAr },
        link: buttonLink,
      },
      image: imageUrl, // always preserves old image if no new one
      updatedAt: new Date(),
    };

    await projetsCollection.updateOne(
      { "projects._id": params.id },
      { $set: { "projects.$": updatedProject } }
    );

    return NextResponse.json(updatedProject);
  } catch (err: any) {
    console.error("PUT [id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to update project" }, { status: 500 });
  }
}

// DELETE one project by id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const projetsCollection = db.collection("projets");

    // Find project before deleting to clean image
    const existing = await projetsCollection.findOne(
      { "projects._id": params.id },
      { projection: { "projects.$": 1 } }
    );
    const oldProject = existing?.projects?.[0];

    if (!oldProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (oldProject.image) {
      try {
        const oldUrl = new URL(oldProject.image);
        const oldKey = oldUrl.pathname.split("/").pop();
        if (oldKey) await del(oldKey, { token: BLOB_TOKEN });
      } catch (e) {
        console.error("Delete old image error:", e);
      }
    }

    await projetsCollection.updateOne(
      {},
      { $pull: { projects: { _id: params.id } } }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE [id] error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}