import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import jwt from 'jsonwebtoken'

import cookieParser from 'cookie-parser';
import { conncectDb } from './utils/connectDatabase.js';
import { ErrorHandler, ErrorHandlerMiddleware } from './middleware/errorHandler.js';
import employeeRoutes from './routes/employee.js';
import adminRoutes from './routes/admin.js';
import superVisorAndAdminRoutes from './routes/supervisorAndAdmin.js'
import Employee from './model/employee.js';
import Admin from './model/admin.js';
import logout from './controllers/logout.js';

const app = express();
dotenv.config()
const port = process.env.PORT || 3000


const allowedOrigins = [
  'http://localhost:5173',
  "https://erp-frontend-two-pink.vercel.app",
  'http://localhost:4173',
  'https://erp-software-tawny.vercel.app',
  process.env.CLIENT_URL?.trim(),  // Handle potential whitespace
  process.env.ADMIN_URL?.trim()
].filter(Boolean); // Remove undefined values


await conncectDb();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked: ${origin} | Allowed: ${allowedOrigins}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/admin',adminRoutes);
app.use('/api/employee',employeeRoutes);
app.use('/api/supervisor-admin',superVisorAndAdminRoutes)

app.post('/api/logout',logout)

app.get("/api/me", async (req, res, next) => {
  try {
    console.log("========== /api/me ==========");

    const authToken = req.cookies.token;
    console.log("Cookie Token:", authToken);

    if (!authToken) {
      return next(new ErrorHandler("Please login to visit this route", 401));
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);

    let user;

    if (decoded.role === "ADMIN") {
      user = await Admin.findById(decoded.id).select("name email role");
    } else if (
      decoded.role === "WORKER" ||
      decoded.role === "SUPERVISOR"
    ) {
      user = await Employee.findById(decoded.id).select("name email role");
    } else {
      return next(new ErrorHandler("Invalid user role", 403));
    }

    if (!user) {
      console.log("User NOT Found in DB");
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Unauthorized access", 401));
  }
});

app.get("/mock",(req,res)=>{
  res.send('hello');
})



app.use(ErrorHandlerMiddleware)



app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})