import { connectToDB } from "@/lib/connect";
import { Room } from "@/models/room";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { roomId, sessionId } = await req.json();

        const room = await Room.findOne({ roomId });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        // Remove user with the matching sessionId
        room.users = room.users.filter((user: { sessionId: string }) => user.sessionId !== sessionId);

        await room.save();

        return NextResponse.json({ message: "Left room successfully" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
