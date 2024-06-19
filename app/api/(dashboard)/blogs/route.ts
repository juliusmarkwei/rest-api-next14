import { NextResponse } from "next/server";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import Blog from "@/lib/models/blog";
import connect from "@/lib/db";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");
		const searchKeywords = searchParams.get("keywords") as string;
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

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
		``;
		// get user from db
		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse(
				JSON.stringify({ message: "User not found" }),
				{
					status: 400,
				}
			);
		}

		// get category to be updated
		const category = await Category.findOne({
			user: userId,
			_id: categoryId,
		});

		if (!category) {
			return new NextResponse(
				JSON.stringify({ message: "Category not found" }),
				{
					status: 400,
				}
			);
		}

		const filter: any = {
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId),
		};

		// filter by keywords
		if (searchKeywords) {
			filter.$or = [
				{ title: { $regex: searchKeywords, $options: "i" } },
				{ content: { $regex: searchKeywords, $options: "i" } },
			];
		}

		// filter by date
		if (startDate && endDate) {
			filter.createdAt = {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			};
		} else if (startDate) {
			filter.createdAt = {
				$gte: new Date(startDate),
			};
		} else if (endDate) {
			filter.createdAt = {
				$lte: new Date(endDate),
			};
		}

		const skip = (page - 1) * limit;

		const blogs = await Blog.find(filter)
			.sort({ createdAt: "asc" })
			.skip(skip)
			.limit(limit); //return result in ascending order by creation date

		return new NextResponse(JSON.stringify({ blogs: blogs }), {
			status: 200,
		});
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({
				error: "Error in fetching blogs" + error.message,
			}),
			{ status: 500 }
		);
	}
};

export const POST = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

		const body = await req.json();
		const { title, content } = body;

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
			return new NextResponse(
				JSON.stringify({ message: "User not found" }),
				{
					status: 400,
				}
			);
		}

		// get category from
		const category = await Category.findOne({
			user: userId,
			_id: categoryId,
		});
		if (!category) {
			return new NextResponse(
				JSON.stringify({ message: "Category not found" }),
				{
					status: 400,
				}
			);
		}

		const blog = new Blog({
			title,
			content,
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId),
		});
		await blog.save();

		return new NextResponse(
			JSON.stringify({ message: "Blog is created", blog: blog }),
			{
				status: 200,
			}
		);
	} catch (error: any) {
		return new NextResponse(
			JSON.stringify({
				error: "Error in creating blog" + error.message,
			}),
			{ status: 500 }
		);
	}
};
