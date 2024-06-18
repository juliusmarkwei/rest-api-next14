import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH = async (req: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await req.json();
    const { title } = body;

    // get user ID from query parameter
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    // get user from db
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    // get category to be updated
    const category = await Category.findOne({ user: userId, _id: categoryId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 400,
        }
      );
    }

    // update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category is updated!",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {}
};

export const DELETE = async (req: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    // get user ID from query parameter
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    // get user from db
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    // get category to be updated
    const category = await Category.findOne({ user: userId, _id: categoryId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        {
          status: 400,
        }
      );
    }

    // delete category
    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({
        message: "Category is deleted successfully!",
      }),
      { status: 200 }
    );
  } catch (error: any) {}
};
