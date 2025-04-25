import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/connect"
import { Newsletter } from "@/models/newsletter";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { email } = await req.json();

        const existingEmail = await Newsletter.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const newEmail = new Newsletter({ email, time: Date.now() })
        await newEmail.save();

        return NextResponse.json({ message: 'Email has been entered succesfully!' }, { status: 201 })
    } catch (err) {
        console.log("Error during registration:", err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}