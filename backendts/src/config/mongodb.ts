import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    mongoose.connection.on("error", (err) => console.error("MongoDB error:", err.message));

    const base = process.env.MONGODB_URL;
    if (!base) {
        console.warn("MONGODB_URL not set — skipping DB connection");
        return;
    }

    const uri = buildUri(base, "nagarAarogya");

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`MongoDB connection failed: ${msg}`);
        console.error("Server will keep running, but DB-backed routes will fail.");
    }
};

function buildUri(base: string, dbName: string): string {
    const qIdx = base.indexOf("?");
    const head = qIdx === -1 ? base : base.slice(0, qIdx);
    const query = qIdx === -1 ? "" : base.slice(qIdx);
    const headNoSlash = head.endsWith("/") ? head.slice(0, -1) : head;
    return `${headNoSlash}/${dbName}${query}`;
}

export default connectDB;