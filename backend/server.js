const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectDB, sequelize } = require("./config/db");

// --- XAVFSIZLIK KUTUBXONALARI ---
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");

// Routerlar
const authRoutes = require("./routes/authRoutes");
const houseRoutes = require("./routes/houseRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

dotenv.config();

const app = express();

// Server turini yashirish
app.disable("x-powered-by");

// LOGGING
app.use(morgan("dev"));

// ============================================
// XAVFSIZLIK QAVATLARI (MIDDLEWARES)
// ============================================

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS sozlamalari — ruxsat etilgan domenlar
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
 "https://nokis-ijara-uyler.vercel.app",
  // "https://sizning-saytingiz.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Origin yo'q (Postman, server-to-server) — ruxsat
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS ruxsat etilmagan: " + origin), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Rate Limiting (DDOS himoyasi)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: "Juda ko'p so'rov yuborildi.",
});
app.use("/api/", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(xss());
app.use(hpp());

// ============================================

// STATIK FAYLLAR (Rasmlar)
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);

// MARSHRUTLAR (ROUTES)
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Nokis Ijara API ishlayapti!");
});

const PORT = process.env.PORT || 10000;

// ============================================
// SUPERADMIN SEEDER — .env dan o'qib yaratadi
// ============================================
const createSuperAdmin = async () => {
  try {
    const User = require("./models/User");

    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const name = process.env.SUPERADMIN_NAME || "Super Admin";

    if (!email || !password) {
      console.warn("SUPERADMIN_EMAIL yoki SUPERADMIN_PASSWORD .env da yo'q, o'tkazib yuborildi.");
      return;
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("Superadmin allaqachon mavjud:", email);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
      houseLimit: 9999,
    });

    console.log("Superadmin yaratildi:", email);
  } catch (error) {
    console.error("Superadmin yaratishda xatolik:", error.message);
  }
};

// ============================================
// SERVERNI ISHGA TUSHIRISH
// ============================================
const startServer = async () => {
  try {
    // 1. Bazaga ulanish
    await connectDB();

    // 2. Jadvallarni sinxronlash
    await sequelize.sync({ alter: true });
    console.log("Baza sinxronlastirIldi.");

    // 3. Superadmin yaratish (agar mavjud bo'lmasa)
    await createSuperAdmin();

    // 4. Serverni ishga tushirish
    app.listen(PORT, () => {
      console.log("Server " + PORT + "-portta ishga tushdi");
    });
  } catch (error) {
    console.error("Server xatoligi:", error);
  }
};

startServer();
