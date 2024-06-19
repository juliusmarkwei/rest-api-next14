import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Blog from "@/lib/models/blog";

export const GET = async (req: Request, context: { params: any }) => {
	const blogId = context.params.blog;
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

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

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(
				JSON.stringify({ message: "Invalid or missing categoryId" }),
				{ status: 400 }
			);
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse(
				JSON.stringify({ message: "User not found" }),
				{ status: 400 }
			);
		}

		const category = await Category.findOne({
			user: userId,
			_id: categoryId,
		});

		if (!category) {
			return new NextResponse(
				JSON.stringify({ message: "Category not found" }),
				{ status: 400 }
			);
		}

		const blog = await Blog.findOne({
			user: userId,
			category: categoryId,
			_id: blogId,
		});

		if (!blog) {
			return new NextResponse(
				JSON.stringify({ message: "Blog not found" }),
				{ status: 400 }
			);
		}

		return new NextResponse(JSON.stringify({ blog: blog }), {
			status: 200,
		});
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({ message: "Error fetching blog" + error.message }),
			{ status: 500 }
		);
	}
};

export const PATCH = async (req: Request, context: { params: any }) => {
	const blogId = context.params.blog;
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

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

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(
				JSON.stringify({ message: "Invalid or missing categoryId" }),
				{ status: 400 }
			);
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse(
				JSON.stringify({ message: "User not found" }),
				{ status: 400 }
			);
		}

		const category = await Category.findOne({
			user: userId,
			_id: categoryId,
		});

		if (!category) {
			return new NextResponse(
				JSON.stringify({ message: "Category not found" }),
				{ status: 400 }
			);
		}

		const blog = await Blog.findOne({
			user: userId,
			category: categoryId,
			_id: blogId,
		});

		if (!blog) {
			return new NextResponse(
				JSON.stringify({ message: "Blog not found" }),
				{ status: 400 }
			);
		}

		const { title, content } = await req.json();
		const updatedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{ title, content },
			{ new: true }
		);

		return new NextResponse(
			JSON.stringify({ message: "Blog is updated", blog: updatedBlog }),
			{ status: 200 }
		);
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({ message: "Error updating blog" + error.message }),
			{ status: 500 }
		);
	}
};

export const DELETE = async (req: Request, context: { params: any }) => {
	const blogId = context.params.blog;
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

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

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse(
				JSON.stringify({ message: "Invalid or missing categoryId" }),
				{ status: 400 }
			);
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse(
				JSON.stringify({ message: "User not found" }),
				{ status: 400 }
			);
		}

		const category = await Category.findOne({
			user: userId,
			_id: categoryId,
		});

		if (!category) {
			return new NextResponse(
				JSON.stringify({ message: "Category not found" }),
				{ status: 400 }
			);
		}

		const blog = await Blog.findOne({
			user: userId,
			category: categoryId,
			_id: blogId,
		});

		if (!blog) {
			return new NextResponse(
				JSON.stringify({ message: "Blog not found" }),
				{ status: 400 }
			);
		}

		await Blog.findByIdAndDelete(blogId);

		return new NextResponse(
			JSON.stringify({ message: "Blog is deleted successfully!" }),
			{ status: 200 }
		);
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({ message: "Error deleting blog" + error.message }),
			{ status: 500 }
		);
	}
};
