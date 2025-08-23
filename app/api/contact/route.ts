import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function GET(req: Request) {
     const forbidden = checkApiKey(req);
    if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");
    // Get the first document
    const contactData = await contactCollection.findOne({});
    
    // Return default structure if no data exists
    if (!contactData) {
      return NextResponse.json({
        contactTitle: { fr: "", en: "", ar: "" },
        contactDescription: { fr: "", en: "", ar: "" },
        contactInfo: [],
        contactButton: {
          startProject: { fr: "", en: "", ar: "" },
          link: ""
        }
      });
    }
    
    // Ensure backward compatibility by adding ar fields if they don't exist
    const migratedData = {
      ...contactData,
      contactTitle: {
        fr: contactData.contactTitle?.fr || "",
        en: contactData.contactTitle?.en || "",
        ar: contactData.contactTitle?.ar || ""
      },
      contactDescription: {
        fr: contactData.contactDescription?.fr || "",
        en: contactData.contactDescription?.en || "",
        ar: contactData.contactDescription?.ar || ""
      },
      contactInfo: (contactData.contactInfo || []).map((item: any) => ({
        ...item,
        label: {
          fr: item.label?.fr || "",
          en: item.label?.en || "",
          ar: item.label?.ar || ""
        }
      })),
      contactButton: {
        startProject: {
          fr: contactData.contactButton?.startProject?.fr || "",
          en: contactData.contactButton?.startProject?.en || "",
          ar: contactData.contactButton?.startProject?.ar || ""
        },
        link: contactData.contactButton?.link || ""
      }
    };
    
    return NextResponse.json(migratedData);
  } catch (error) {
    console.error("Error fetching Contact:", error);
    return NextResponse.json(
      { message: "Failed to fetch Contact" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");
    const data = await req.json();
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    
    // Ensure required fields exist with default values for all three languages
    const validatedData = {
      contactTitle: {
        fr: data.contactTitle?.fr || "",
        en: data.contactTitle?.en || "",
        ar: data.contactTitle?.ar || ""
      },
      contactDescription: {
        fr: data.contactDescription?.fr || "",
        en: data.contactDescription?.en || "",
        ar: data.contactDescription?.ar || ""
      },
      contactInfo: Array.isArray(data.contactInfo) ? data.contactInfo.map((item: any) => ({
        icon: item.icon || "mail",
        label: {
          fr: item.label?.fr || "",
          en: item.label?.en || "",
          ar: item.label?.ar || ""
        },
        value: item.value || "",
        link: item.link || ""
      })) : [],
      contactButton: {
        startProject: {
          fr: data.contactButton?.startProject?.fr || "",
          en: data.contactButton?.startProject?.en || "",
          ar: data.contactButton?.startProject?.ar || ""
        },
        link: data.contactButton?.link || ""
      },
      updatedAt: new Date()
    };
    
    // Update the first document or insert if none exists
    const result = await contactCollection.replaceOne(
      {},
      validatedData,
      { upsert: true }
    );
    
    return NextResponse.json({
      message: "Contact updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error("Error updating Contact:", error);
    return NextResponse.json(
      { message: "Failed to update Contact" },
      { status: 500 }
    );
  }
}