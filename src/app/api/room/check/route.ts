import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/connect';
import { Room } from '@/models/room';

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const roomId = req.nextUrl.searchParams.get('roomId');

        if (!roomId) {
            return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
        }

        const room = await Room.findOne({ roomId });
        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Room exists" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
