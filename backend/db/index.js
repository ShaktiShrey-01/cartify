import mongoose from "mongoose";
import {DB_name} from "../constants.js";
 

// Connects to MongoDB using MONGODB_URL from .env
// Ensures DB name is present in the URI for Atlas
const connectDb = async () => {
    try {
        let uri = process.env.MONGODB_URL;
        // If DB name is not in the URL, append it
        if (!uri.endsWith(DB_name) && !uri.includes(`/${DB_name}`)) {
            uri = uri.endsWith('/') ? `${uri}${DB_name}` : `${uri}/${DB_name}`;
        }
        // Connect to MongoDB
        const connectinstance = await mongoose.connect(uri);
        // DB connected (log removed for production)
    } catch (error) {
        // Log and exit on connection failure
        // DB connection failed (log removed for production)
        process.exit(1);
    }
}

export default connectDb;