// /app/api/all-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";

const baseMockData = {
  username: { fr: "Jean Dupont", en: "John Doe", ar: "جون دو" },
  hero: {},
  services: { servicesList: [] },
  education: { education: [], experience: [] },
  skills: { skills: [] },
  projects: { projects: [] },
  about: { aboutDescription: {}, personalInfo: [], languages: {}, interests: [] },
  contact: { contactTitle: {}, contactDescription: {}, contactInfo: [], contactButton: {} },
  photoUrl: ""
};

const endpoints: Record<string, string> = {
  photo: "/api/photo",
  hero: "/api/hero",
  username: "/api/username",
  about: "/api/about_me",
  contact: "/api/contact",
  services: "/api/services",
  education: "/api/education",
  skills: "/api/skills",
  projects: "/api/projets"
};

export async function GET(req: NextRequest) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    // Fetch all endpoints in parallel
    const results = await Promise.all(
      Object.entries(endpoints).map(async ([key, url]) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}${url}`, {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_API_SECRET || ""
            }
          });
          if (!res.ok) throw new Error(`${url} failed`);
          const data = await res.json();
          return { key, data };
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
          return { key, data: null };
        }
      })
    );

    // Build combined data
    let combinedData = { ...baseMockData };

    results.forEach(({ key, data }) => {
      if (!data) return;
      switch (key) {
        case "photo":
          combinedData.photoUrl = data.url;
          break;
        case "hero":
        case "username":
        case "about":
        case "contact":
        case "services":
        case "education":
        case "skills":
        case "projects":
          combinedData[key] = data;
          break;
        default:
          break;
      }
    });

    return NextResponse.json(combinedData);
  } catch (err) {
    console.error("Error in /all-data:", err);
    return NextResponse.json({ error: "Failed to fetch all data" }, { status: 500 });
  }
}
