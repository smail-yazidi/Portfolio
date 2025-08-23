import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function GET(req: Request) {
   const forbidden = checkApiKey(req);
    if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const educationData = await db.collection("education").findOne({});
    
    // Ensure we always return a proper structure with Arabic support
    const defaultData = { 
      journeyTitle: { fr: "", en: "", ar: "" }, 
      education: [], 
      experience: [] 
    };
    
    return NextResponse.json(educationData || defaultData);
  } catch (err) {
    console.error("Error fetching education data:", err);
    return NextResponse.json(
      { error: "Failed to fetch education data" }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
   const forbidden = checkApiKey(req);
    if (forbidden) return notFound(); 
  try {
    const data = await req.json();
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    
    // Use replaceOne instead of updateOne to ensure complete document replacement
    const result = await db.collection("education").replaceOne(
      {}, 
      data, 
      { upsert: true }
    );

    console.log("Update result:", result);
    
    return NextResponse.json({ 
      success: true,
      message: "Education data updated successfully",
      data: result 
    });
  } catch (err) {
    console.error("Error updating education data:", err);
    return NextResponse.json(
      { error: "Failed to update education data" }, 
      { status: 500 }
    );
  }
}