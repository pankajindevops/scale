import dbConnect from "@/db/config/dbConnect";
import TeamcharterMaster from "@/db/models/teamcharterMaster";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(req) {
    const session = await getServerSession(options)
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        const masters = await TeamcharterMaster.find({ organizationId: session.data.organizationId });

        let data = JSON.stringify(masters);
        return new Response(data, {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Error fetching masters',
            status: 500,
            error: error.message,
        }));
    }
}

export async function POST(request) {
    const masterData = await request.json();
    masterData.createdAt = new Date();
    masterData.updatedAt = new Date();
    const masters = await TeamcharterMaster.create(masterData);
    const data = JSON.stringify(masters);
    return new Response(data, {
        status: 200,
    });
}


export async function PUT(request) {
    const session = await getServerSession()
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }

    const masterData = await request.json();
    const { userId, ...updateData } = masterData;
    masterData.updatedAt = new Date();


    const updatedMaster = await TeamcharterMaster.findOneAndUpdate({ organizationId: session.data.organizationId }, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedMaster) {
        return new Response('User not found', { status: 404 });
    }

    const data = JSON.stringify(updatedMaster);
    return new Response(data, { status: 200 });
}

