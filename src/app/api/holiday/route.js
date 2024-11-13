import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options.ts";
import getNextSequenceValue from "@/db/utils/getNextSequenceValue";

const url = process.env.MONGODB_URL;
const dbName = 'scaledb';
const collectionName = 'holidays'; // Added collection name

let client;
let db;
let collection;

async function connectToDatabase() {
    if (!client) {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db(dbName);
        collection = db.collection(collectionName);
    }
}

export async function GET(request) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();

        const role = session?.data?.role;
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        // if (role === "Administrator") {
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
        // } else {
        //     const query = { email: session.data.email };
        //     if (id) {
        //         query._id = new ObjectId(id);
        //     }
        //     if (slug) {
        //         query.projectSlug = slug;
        //     }
        //     const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        //     return new Response(JSON.stringify(records), { status: 200 });
        // }

    } catch (error) {
        console.error('Error fetching records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function POST(request) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();
        const contactData = await request.json();
        contactData.email = session.data.email;
        contactData.reportedBy = session.data.email;
        contactData.organization = session.data.organization;
        contactData.organizationId = session.data.organizationId;
        contactData.createdAt = new Date();
        const nextVal = await getNextSequenceValue(session.data.organizationId, contactData.key, contactData.projectSlug);
        contactData.key = nextVal;

        const result = await collection.insertOne(contactData);

        const role = session?.data?.role;
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        // if (role === "Administrator") {
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
        // } else {
        //     const query = { email: session.data.email };
        //     if (id) {
        //         query._id = new ObjectId(id);
        //     }
        //     if (slug) {
        //         query.projectSlug = slug;
        //     }
        //     const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        //     return new Response(JSON.stringify(records), { status: 200 });
        // }
    } catch (error) {
        console.error('Error creating contact:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function PUT(request) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    await connectToDatabase();
    try {
        const { _id, email, ...updateData } = await request.json();

        console.log('object ', new ObjectId(_id));
        // Ensure createdAt is not modified during update
        delete updateData.createdAt;
        updateData.updatedAt = new Date();

        const updatedContact = collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: updateData }, function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                console.log("Updated");
                return new Response("Updated", {
                    status: 200,
                });
            }
        });
        const role = session?.data?.role;
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        // if (role === "Administrator") {
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
        // } else {
        //     const query = { email: session.data.email };
        //     if (id) {
        //         query._id = new ObjectId(id);
        //     }
        //     if (slug) {
        //         query.projectSlug = slug;
        //     }
        //     const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        //     return new Response(JSON.stringify(records), { status: 200 });
        // }
    } catch (error) {
        console.error('Error updating contact:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

export async function DELETE(request) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated!" },
            {
                status: 401,
            }
        );
    }
    try {
        await connectToDatabase();

        const ids = await request.json();
        if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({
                error: 'Invalid IDs format',
                status: 400,
            }));
        }

        const convertedIds = ids.map(id => new ObjectId(id));

        const deletedrecords = await collection.deleteMany({ _id: { $in: convertedIds } });

        if (!deletedrecords || deletedrecords.deletedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                status: 404,
                data: ids
            }));
        }
        const role = session?.data?.role;
        const formData = await request.nextUrl.searchParams;
        const slug = formData.get('slug');
        const id = formData.get('id');
        // if (role === "Administrator") {
        const query = { organizationId: session.data.organizationId };
        if (id) {
            query._id = new ObjectId(id);
        }
        if (slug) {
            query.projectSlug = slug;
        }

        const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(records), { status: 200 });
        // } else {
        //     const query = { email: session.data.email };
        //     if (id) {
        //         query._id = new ObjectId(id);
        //     }
        //     if (slug) {
        //         query.projectSlug = slug;
        //     }
        //     const records = await collection.find(query).sort({ createdAt: -1 }).toArray();
        //     return new Response(JSON.stringify(records), { status: 200 });
        // }
    } catch (error) {
        console.error('Error deleting records:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
