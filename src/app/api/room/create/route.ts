import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/connect";
import { Room } from "@/models/room";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { nickname, sessionId, roomId, admin } = await req.json();

        const room = await Room.findOne({ roomId });

        if (room) {
            return NextResponse.json({ error: "Room Already Exists" }, { status: 409 });
        }

        const newRoom = new Room({
            roomId: roomId,
            users: [{
                nickname: nickname,
                sessionId: sessionId,
                admin: admin,
            }],
            createdTime: new Date()
        });

        await newRoom.save();

        return NextResponse.json({ message: "Room created successfully!", roomId }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
