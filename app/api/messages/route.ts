// /app/api/messages/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkApiKey } from "@/lib/checkApiKey";
import { notFound } from "next/navigation";
// GET: fetch all messages
export async function GET(req: Request) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const messagesCollection = db.collection("messages");

    const messages = await messagesCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST: store a new message
export async function POST(req: Request) {
     const forbidden = checkApiKey(req);
  if (forbidden) return notFound(); 
  try {
    const db = await connectDB();
    const messagesCollection = db.collection("messages");

    const data = await req.json();

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ message: "Name, email, and message are required" }, { status: 400 });
    }

    const newMessage = {
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date()
    };

    const result = await messagesCollection.insertOne(newMessage);

    return NextResponse.json({
      message: "Message sent successfully",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
