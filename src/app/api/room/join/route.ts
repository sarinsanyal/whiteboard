import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/connect";
import { Room } from "@/models/room";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { nickname, sessionId, roomId, admin } = await req.json();

        const room = await Room.findOne({ roomId });

        if (!room) {
            return NextResponse.json({ error: "No such Room exists" }, { status: 409 });
        }

        // Safety: Initialize users array if missing
        if (!room.users) {
            room.users = [];
        }

        const sessionExists = room.users.some((user: any) => user.sessionId === sessionId);
        if (sessionExists) {
            return NextResponse.json({ error: "Session already exists in room" }, { status: 409 });
        }

        room.users.push({
            nickname,
            sessionId,
            admin: admin || false, 
        });

        await room.save();

        return NextResponse.json({ 
            message: "Joined Room successfully", 
            redirectUrl: `/room/${roomId}` 
        }, { status: 200 });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
