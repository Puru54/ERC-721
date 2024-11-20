import connectMongoDB from "@/lib/mongodb";
import FootballGround from "@/model/turf";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function POST(request: { json: () => PromiseLike<{ name: any; description: any; photo: any; location: any; }> | { name: any; description: any; photo: any; location: any; }; }) {
    try {
        const { name, description, photo, location } = await request.json();
        const turf = await FootballGround.create({ name, description, photo, location });
        return NextResponse.json({ message: "Football Ground Listed", id: turf._id }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function GET() {
    try {
        const turfs = await FootballGround.find();
        return NextResponse.json({ turfs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
