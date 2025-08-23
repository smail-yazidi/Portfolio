import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
export async function GET(req: Request) {

   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const adminPassword = await db.collection("adminpassword").findOne({});
    
    return NextResponse.json({
      hasPassword: !!adminPassword,
    });
    
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch password status" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const { currentPassword, newPassword } = await req.json();
    const db = await connectDB();

    // Check if we have an existing password
    const existing = await db.collection("adminpassword").findOne({});
    
    // If updating password, verify current one first
    if (existing) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }
      
      const isMatch = await bcrypt.compare(currentPassword, existing.hashedPassword);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Hash and store new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.collection("adminpassword").updateOne(
      {},
      { $set: { hashedPassword } },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Password updated successfully" }
    );

  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}