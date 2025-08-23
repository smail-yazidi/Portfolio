import { NextResponse } from "next/server";

export function checkApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key");

  if (apiKey !== process.env.API_SECRET) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 } // يرفض الطلب
    );
  }

  return null; // المفتاح صحيح → السماح بالاستمرار
}
