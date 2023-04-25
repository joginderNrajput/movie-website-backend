import express from "express";
import { deleteBooking, getBookingById, getBookings, newBooking } from "../controllers/booking-controller";

const bookingRouter = express.Router();

bookingRouter.post("/", newBooking);
bookingRouter.get("/:id", getBookingById);
bookingRouter.get("/", getBookings);
bookingRouter.delete("/:id", deleteBooking);

export default bookingRouter;