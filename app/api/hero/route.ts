// /app/api/hero/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function POST(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 



  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    const newHero = await req.json();

    // Insert the new hero document
    const result = await heroCollection.insertOne(newHero);

    return NextResponse.json({ message: "Hero added successfully", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to add hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 


  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    // Get the first hero document or return empty structure
    const heroData = await heroCollection.findOne({});
    
    // Return empty structure if no data exists
    if (!heroData) {
      return NextResponse.json({
        specialist: { fr: "", en: "", ar: "" },
        heroTitle: { fr: "", en: "", ar: "" },
        heroDescription: { fr: "", en: "", ar: "" },
        heroButtons: []
      }, { status: 200 });
    }

    const { _id, ...data } = heroData;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch hero data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    const updatedHero = await req.json();

    // Always use upsert to create if doesn't exist
    await heroCollection.updateOne(
      {}, 
      { $set: updatedHero },
      { upsert: true }
    );

    return NextResponse.json(updatedHero, { status: 200 });
  } catch (error) {
    console.error("Failed to update hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const heroCollection = db.collection("hero");

    // Delete the first hero document
    const result = await heroCollection.deleteOne({});

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Hero not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Hero deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete hero:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}