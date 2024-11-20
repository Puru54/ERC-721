import connectMongoDB from "@/lib/mongodb";
import FootballGround from "@/model/turf";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request: { json: () => PromiseLike<{ name: any; description: any; photo: any; location: any; status: any; }> | { name: any; description: any; photo: any; location: any; status: any; }; }, { params }: any) {
    try {
        const { id } = params;
        const { name, description, photo, location, status } = await request.json();
        await FootballGround.findByIdAndUpdate(id, { name, description, photo, location, status }, { runValidators: true });
        return NextResponse.json({ message: "Football Ground updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function GET(request: any, { params }: any) {
    try {
        const { id } = params;
        const turf = await FootballGround.findOne({ _id: id });
        return NextResponse.json({ turf }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}


export async function DELETE(request: any, { params }: any) {
    try {
        const { id } = params;
        await FootballGround.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Football Ground deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}