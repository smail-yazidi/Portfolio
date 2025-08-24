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

    const newEntry = {
      ip: ip || "",
      country: country || "",
      userAgent,
      device,
      language,
      time: new Date(),
    };

    const { os, deviceType } = extractOSAndDevice(userAgent);

    // العثور على الزائر حسب البصمة
    let existingVisitor = await visitorsCollection.findOne({ fingerprint });

    if (!existingVisitor) {
      // تحقق أولاً من وجود زائر مشابه بنفس نظام التشغيل ونوع الجهاز
      const similarVisitor = await visitorsCollection.findOne({
        "userAgentOS": os,
        "deviceType": deviceType,
      });

     if (similarVisitor) {
  const lastEntry = similarVisitor.history?.[similarVisitor.history.length - 1];

  if (!lastEntry) {
    // no history → just add the first entry
    await visitorsCollection.updateOne(
      { _id: similarVisitor._id },
      { $push: { history: newEntry } }
    );
  } else {
    const importantChanged =
      lastEntry.userAgent !== userAgent ||
      lastEntry.device !== device ||
      lastEntry.language !== language;

    if (importantChanged) {
      // something important changed → push new history entry
      await visitorsCollection.updateOne(
        { _id: similarVisitor._id },
        { $push: { history: newEntry } }
      );
    } else {
      // no important change → update only last entry with new ip/country/time
      await visitorsCollection.updateOne(
        { _id: similarVisitor._id },
        {
          $set: {
            "history.$[last].ip": ip || "",
            "history.$[last].country": country || "",
            "history.$[last].time": new Date(),
          },
        },
        { arrayFilters: [{ "last.time": lastEntry.time }] }
      );
    }
  }
}
 else {
        // إذا لم يوجد → إنشاء زائر جديد
        await visitorsCollection.insertOne({
          fingerprint,
          userAgentOS: os,
          deviceType: deviceType,
          history: [newEntry],
        });
      }
    } else {
      const lastEntry = existingVisitor.history?.[existingVisitor.history.length - 1];

if (!lastEntry) {
  // إذا لم يكن هناك أي تاريخ محفوظ → أضف أول سجل
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
    // تغيّرت بيانات مهمة → إضافة سجل جديد
    await visitorsCollection.updateOne(
      { _id: existingVisitor._id },
      { $push: { history: newEntry } }
    );
  } else {
    // لم تتغيّر البيانات المهمة → فقط تحديث IP والبلد للتاريخ الأخير
    await visitorsCollection.updateOne(
      { _id: existingVisitor._id },
      {
        $set: {
          "history.$[last].ip": ip || "",
          "history.$[last].country": country || "",
          "history.$[last].time": new Date(),
        },
      },
      { arrayFilters: [{ "last.time": lastEntry.time }] } // 👈 يضمن تحديث آخر سجل فقط
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



