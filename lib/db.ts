import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
	const connectionState = mongoose.connection.readyState;

	if (connectionState === 1) {
		console.log("Database is already connected");
		return;
	}

	if (connectionState === 2) {
		console.log("Database is connecting");
		return;
	}

	try {
		mongoose.connect(MONGODB_URI!, {
			dbName: "Cluster0",
			bufferCommands: true,
		});
		console.log("Database connected");
	} catch (error) {
		console.log("Database connection error", error);
		throw new Error("Database connection error");
	}
};

export default connect;
