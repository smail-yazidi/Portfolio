import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
// DELETE: delete a message by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 

  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid message ID" }, { status: 400 });
    }

    const db = await connectDB();
    const messagesCollection = db.collection("messages");

    const result = await messagesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ message: "Failed to delete message" }, { status: 500 });
  }
}
