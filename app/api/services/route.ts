import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function GET(req: Request) {
    const forbidden = checkApiKey(req);
    if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const services = await db.collection("services").findOne({});
    
    // If no data exists, return default structure
    if (!services) {
      return NextResponse.json({ servicesList: [] });
    }
    
    // Ensure backward compatibility by adding ar fields if they don't exist
    const migratedData = {
      ...services,
      servicesList: (services.servicesList || []).map((service: any) => ({
        title: {
          fr: service.title?.fr || "",
          en: service.title?.en || "",
          ar: service.title?.ar || ""
        },
        description: {
          fr: service.description?.fr || "",
          en: service.description?.en || "",
          ar: service.description?.ar || ""
        }
      }))
    };
    
    return NextResponse.json(migratedData);
  } catch (err) {
    console.error("Error fetching services:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function PUT(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const data = await req.json();
    
    // Validate the data structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.servicesList)) {
      return NextResponse.json(
        { error: "Invalid data format - servicesList must be an array" },
        { status: 400 }
      );
    }
    
    // Validate and ensure all services have the correct structure
    const validatedData = {
      servicesList: data.servicesList.map((service: any, index: number) => {
        if (!service || typeof service !== 'object') {
          throw new Error(`Invalid service data at index ${index}`);
        }
        
        return {
          title: {
            fr: service.title?.fr || "",
            en: service.title?.en || "",
            ar: service.title?.ar || ""
          },
          description: {
            fr: service.description?.fr || "",
            en: service.description?.en || "",
            ar: service.description?.ar || ""
          }
        };
      }),
      updatedAt: new Date()
    };
    
    const db = await connectDB();
    const result = await db.collection("services").updateOne(
      {}, 
      { $set: validatedData }, 
      { upsert: true }
    );
    
    return NextResponse.json({ 
      message: "Services updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (err: any) {
    console.error("Error updating services:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update services" }, 
      { status: 500 }
    );
  }
}