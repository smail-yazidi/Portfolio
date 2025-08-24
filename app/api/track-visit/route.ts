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

function extractOSAndDevice(userAgent: string) {
  let deviceType = "Unknown";
  let os = "Unknown";

  if (/Windows/i.test(userAgent)) os = "Windows";
  else if (/Macintosh/i.test(userAgent)) os = "MacOS";
  else if (/Linux/i.test(userAgent)) os = "Linux";
  else if (/Android/i.test(userAgent)) os = "Android";
  else if (/iPhone|iPad/i.test(userAgent)) os = "iOS";

  if (/Mobile/i.test(userAgent)) deviceType = "Mobile";
  else if (/Tablet/i.test(userAgent)) deviceType = "Tablet";
  else deviceType = "Desktop";

  return { os, deviceType };
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

    // تحليل نظام التشغيل والجهاز من UserAgent
    const { os, deviceType } = extractOSAndDevice(userAgent);

    const newEntry = {
      ip: ip || "",
      country: country || "",
      userAgent,
      device,
      language,
      time: new Date(),
    };

    // البحث عن الزائر حسب البصمة
    let existingVisitor = await visitorsCollection.findOne({ fingerprint });

    if (!existingVisitor) {
      // إذا الزائر جديد → إنشئ سجل جديد
      await visitorsCollection.insertOne({
        fingerprint,
        userAgentOS: os,
        deviceType: deviceType,
        history: [newEntry],
      });
    } else {
      // الزائر موجود → تحقق من السجل الأخير
      const lastEntry =
        existingVisitor.history?.[existingVisitor.history.length - 1];

      if (!lastEntry) {
        // ما فيه أي تاريخ محفوظ → أضف أول سجل
        await visitorsCollection.updateOne(
          { _id: existingVisitor._id },
          { $push: { history: newEntry } }
        );
      } else {
        const importantChanged =
          lastEntry.userAgent !== userAgent ||
          lastEntry.device !== device ||
          lastEntry.language !== language;

        if (importantChanged) {
          // تغييرات مهمة → إضافة سجل جديد
          await visitorsCollection.updateOne(
            { _id: existingVisitor._id },
            { $push: { history: newEntry } }
          );
        } else {
          // لم تتغير البيانات المهمة → فقط تحديث IP و الدولة و الوقت
          await visitorsCollection.updateOne(
            { _id: existingVisitor._id },
            {
              $set: {
                "history.$[last].ip": ip || "",
                "history.$[last].country": country || "",
                "history.$[last].time": new Date(),
              },
            },
            {
              arrayFilters: [{ "last.time": lastEntry.time }],
            }
          );
        }
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




