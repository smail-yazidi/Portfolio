import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";

// ✅ Get all visitors count (secure with API key)
export async function GET(req: Request) {
  const forbidden = checkApiKey(req);
  if (forbidden) return notFound();

  try {
    const db = await connectDB();
    const visitorsCollection = db.collection("visitors");

    const totalVisitors = await visitorsCollection.countDocuments();
    const visitors = await visitorsCollection
      .find({})
      .sort({ time: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ totalVisitors, visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      { message: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const visitorsCollection = db.collection("visitors");

    const data = await req.json();
    const { fingerprint, ip, userAgent, country, device, language } = data;

    if (!fingerprint) {
      return NextResponse.json(
        { message: "Missing fingerprint" },
        { status: 400 }
      );
    }

    const newEntry = {
      ip: ip || "",
      country: country || "",
      userAgent: userAgent || "",
      device: device || "",
      language: language || "",
      time: new Date(),
    };

    // العثور على الزائر حسب البصمة
    const existingVisitor = await visitorsCollection.findOne({ fingerprint });

    if (!existingVisitor) {
      // إذا البصمة غير موجودة → إنشاء زائر جديد
      await visitorsCollection.insertOne({
        fingerprint,
        history: [newEntry],
      });
    } else {
      // البصمة موجودة → تحقق من التغيرات في المعلومات المهمة (باستثناء IP والبلد)
      const lastEntry = existingVisitor.history?.[existingVisitor.history.length - 1];

      const otherChanged =
        lastEntry?.userAgent !== userAgent ||
        lastEntry?.device !== device ||
        lastEntry?.language !== language;

      if (otherChanged) {
        // إذا تغيرت معلومات مهمة → إضافة سجل جديد
        await visitorsCollection.updateOne(
          { _id: existingVisitor._id },
          { $push: { history: newEntry } }
        );
      } else {
        // تحديث آخر سجل فقط للـ IP والبلد بدون إضافة سجل جديد
        await visitorsCollection.updateOne(
          { _id: existingVisitor._id, "history._id": lastEntry._id },
          { $set: { "history.$.ip": ip || "", "history.$.country": country || "" } }
        );
      }
    }

    const totalVisitors = await visitorsCollection.countDocuments();
    return NextResponse.json({ success: true, totalVisitors });
  } catch (error) {
    console.error("Error saving visitor:", error);
    return NextResponse.json(
      { message: "Failed to save visitor" },
      { status: 500 }
    );
  }
}


