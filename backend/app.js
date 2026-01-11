
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


// CORS middleware FIRST!
let corsOptions;
if (process.env.CORS_ORIGIN === '*') {
    corsOptions = {
        origin: '*',
        credentials: true,
    };
} else {
    const allowedOrigins = String(process.env.CORS_ORIGIN || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    corsOptions = {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    };
}
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Logging middleware removed for production

// Parse cookies and bodies BEFORE mounting routes
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

// Register routes after parsers are in place
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin", async (req, res, next) => {
    try {
        const mod = await import("./routes/admin.routes.js");
        const adminrouter = mod.default;
        if (!adminrouter) {
            return res.status(500).json({ ok: false, message: "Admin routes are not exported as default" });
        }
        return adminrouter(req, res, next);
    } catch (err) {
        return next(err);
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running")
})

app.get("/health", (req, res) => {
    res.json({ ok: true })
})

// Lazy-load routes so the server can boot even if user routes are mid-work.
app.use("/api/v1/users", async (req, res, next) => {
    try {
        const mod = await import("./routes/user.routes.js")
        const userrouter = mod.default
        if (!userrouter) {
            return res.status(500).json({ ok: false, message: "User routes are not exported as default" })
        }
        return userrouter(req, res, next)
    } catch (err) {
        return next(err)
    }
})

app.use("/api/v1/addresses", async (req, res, next) => {
    try {
        const mod = await import("./routes/address.routes.js");
        const addressrouter = mod.default;
        if (!addressrouter) {
            return res.status(500).json({ ok: false, message: "Address routes are not exported as default" });
        }
        return addressrouter(req, res, next);
    } catch (err) {
        return next(err);
    }
});

app.use("/api/v1/products", async (req, res, next) => {
    try {
        const mod = await import("./routes/product.routes.js")
        const productrouter = mod.default
        if (!productrouter) {
            return res.status(500).json({ ok: false, message: "Product routes are not exported as default" })
        }
        return productrouter(req, res, next)
    } catch (err) {
        return next(err)
    }
})

// Global error handler (should be last middleware)
app.use((err, req, res, next) => {
    const status = typeof err.statuscode === 'number' ? err.statuscode : 500;
    res.status(status).json({
        statuscode: status,
        message: err.message || 'Internal Server Error',
        success: false,
        error: err.error || [],
    });
});

export default app

