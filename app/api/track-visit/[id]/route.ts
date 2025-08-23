// /app/api/track-visit/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const forbidden = checkApiKey(req);
  if (forbidden) return notFound();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Missing visitor ID" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const visitorsCollection = db.collection("visitors");

    const result = await visitorsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Visitor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    console.error("Error deleting visitor:", error);
    return NextResponse.json(
      { message: "Failed to delete visitor" },
      { status: 500 }
    );
  }
}
