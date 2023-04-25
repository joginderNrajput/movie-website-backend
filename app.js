// const express = require("express");
import express from "express";
// const cors = require('cors');
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes";
import adminRouter from "./routes/admin-routes";
import movieRouter from "./routes/movie-routes";
import bookingRouter from "./routes/booking-routes";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);


mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.nh61j5z.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(5000, () => {
        console.log("connected to Databse & Server is runnnig at Port : 5000");
    })
}).catch((error) => {
    console.log(`Error Occored ${error}`);  
})





