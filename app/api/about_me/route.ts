import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function GET(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const aboutCollection = db.collection("about");
    
    // Get the first document
    const aboutData = await aboutCollection.findOne({});
    
    // Ensure backward compatibility by adding Arabic fields if they don't exist
    if (aboutData) {
      // Add Arabic support to aboutTitle
      if (!aboutData.aboutTitle?.ar) {
        aboutData.aboutTitle = {
          fr: aboutData.aboutTitle?.fr || "",
          en: aboutData.aboutTitle?.en || "",
          ar: ""
        };
      }

      // Add Arabic support to aboutDescription
      if (!aboutData.aboutDescription?.ar) {
        aboutData.aboutDescription = {
          fr: aboutData.aboutDescription?.fr || "",
          en: aboutData.aboutDescription?.en || "",
          ar: ""
        };
      }

      // Add Arabic support to languages title
      if (aboutData.languages?.title && !aboutData.languages.title.ar) {
        aboutData.languages.title.ar = "اللغات";
      }

      // Add Arabic support to language levels
      if (aboutData.languages?.levels) {
        const defaultArabicLevels = {
          a1: "مبتدئ",
          a2: "أساسي", 
          b1: "متوسط",
          b2: "متوسط متقدم",
          c1: "متقدم",
          c2: "إتقان",
          native: "لغة أم"
        };
        
        Object.keys(aboutData.languages.levels).forEach(level => {
          if (!aboutData.languages.levels[level].ar) {
            aboutData.languages.levels[level].ar = defaultArabicLevels[level as keyof typeof defaultArabicLevels] || "";
          }
        });
      }

      // Add Arabic support to language list
      if (aboutData.languages?.list) {
        aboutData.languages.list = aboutData.languages.list.map((lang: any) => ({
          ...lang,
          name: {
            fr: lang.name?.fr || "",
            en: lang.name?.en || "",
            ar: lang.name?.ar || ""
          }
        }));
      }

      // Add Arabic support to personalInfo
      if (aboutData.personalInfo) {
        aboutData.personalInfo = aboutData.personalInfo.map((info: any) => ({
          ...info,
          label: {
            fr: info.label?.fr || "",
            en: info.label?.en || "",
            ar: info.label?.ar || ""
          },
          value: {
            fr: info.value?.fr || "",
            en: info.value?.en || "",
            ar: info.value?.ar || ""
          }
        }));
      }

      // Add Arabic support to interests
      if (aboutData.interests) {
        aboutData.interests = aboutData.interests.map((interest: any) => ({
          ...interest,
          name: {
            fr: interest.name?.fr || "",
            en: interest.name?.en || "",
            ar: interest.name?.ar || ""
          }
        }));
      }
    }

    return NextResponse.json(aboutData || null);
  } catch (error) {
    console.error("Error fetching About Me:", error);
    return NextResponse.json({ message: "Failed to fetch About Me" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
   const forbidden = checkApiKey(req);
  if (forbidden) return forbidden; 
  try {
    const db = await connectDB();
    const aboutCollection = db.collection("about");
    const data = await req.json();

    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    // Ensure required fields exist with default values for all three languages
    const validatedData = {
      aboutTitle: {
        fr: data.aboutTitle?.fr || "",
        en: data.aboutTitle?.en || "",
        ar: data.aboutTitle?.ar || ""
      },
      aboutDescription: {
        fr: data.aboutDescription?.fr || "",
        en: data.aboutDescription?.en || "",
        ar: data.aboutDescription?.ar || ""
      },
      personalInfo: Array.isArray(data.personalInfo) ? data.personalInfo.map((info: any) => ({
        icon: info.icon || "User",
        label: {
          fr: info.label?.fr || "",
          en: info.label?.en || "",
          ar: info.label?.ar || ""
        },
        value: {
          fr: info.value?.fr || "",
          en: info.value?.en || "",
          ar: info.value?.ar || ""
        }
      })) : [],
      languages: {
        title: {
          fr: data.languages?.title?.fr || "Langues",
          en: data.languages?.title?.en || "Languages",
          ar: data.languages?.title?.ar || "اللغات"
        },
        levels: {
          a1: { 
            fr: "Débutant", 
            en: "Beginner", 
            ar: "مبتدئ" 
          },
          a2: { 
            fr: "Élémentaire", 
            en: "Elementary", 
            ar: "أساسي" 
          },
          b1: { 
            fr: "Intermédiaire", 
            en: "Intermediate", 
            ar: "متوسط" 
          },
          b2: { 
            fr: "Intermédiaire Avancé", 
            en: "Upper Intermediate", 
            ar: "متوسط متقدم" 
          },
          c1: { 
            fr: "Avancé", 
            en: "Advanced", 
            ar: "متقدم" 
          },
          c2: { 
            fr: "Maîtrise", 
            en: "Mastery", 
            ar: "إتقان" 
          },
          native: { 
            fr: "Langue Maternelle", 
            en: "Native", 
            ar: "لغة أم" 
          }
        },
        list: Array.isArray(data.languages?.list) ? data.languages.list.map((lang: any) => ({
          name: {
            fr: lang.name?.fr || "",
            en: lang.name?.en || "",
            ar: lang.name?.ar || ""
          },
          level: lang.level || "b1"
        })) : []
      },
      interests: Array.isArray(data.interests) ? data.interests.map((interest: any) => ({
        icon: interest.icon || "Heart",
        name: {
          fr: interest.name?.fr || "",
          en: interest.name?.en || "",
          ar: interest.name?.ar || ""
        }
      })) : [],
      updatedAt: new Date()
    };

    // Update the first document or insert if none exists
    const result = await aboutCollection.replaceOne(
      {},
      validatedData,
      { upsert: true }
    );

    return NextResponse.json({
      message: "About Me updated successfully",
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error("Error updating About Me:", error);
    return NextResponse.json({ message: "Failed to update About Me" }, { status: 500 });
  }
}