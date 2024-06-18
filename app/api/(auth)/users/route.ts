import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, username } = body;

    await connect();

    if (!userId || !username) {
      return new NextResponse(
        JSON.stringify({ error: "userId and username are required!" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid userId!" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: username,
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ error: "User not found!" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "user is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "userId is required!" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid userId!" }), {
        status: 400,
      });
    }

    await connect();

    const deletedUser = await User.findOneAndDelete({
      _id: new ObjectId(userId),
    });

    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ error: "User not found!" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ message: "user is deleted" }), {
      status: 200,
    });
  } catch (error) {}
};
