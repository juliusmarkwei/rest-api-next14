import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
	matcher: "/api/:path*",
};

export default function middleware(req: Request) {
	if (req.url.includes("/api/blog")) {
		const logresult = logMiddleware(req);
		console.log(logresult.response);
	}

	const authResult = authMiddleware(req);
	// this line has been commented out for learning purposes
	// if (!authResult.isValid && req.url.includes("/api/")) {
	// 	return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
	// 		status: 401,
	// 	});
	// }
	return NextResponse.next();
}
