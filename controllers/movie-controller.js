import jwt from "jsonwebtoken";
import Movie from "../models/Movie";
import Admin from "../models/Admin";
import mongoose from "mongoose";

export const addMovie = async (req, res, next) => {
  const extractToken = req.headers.authorization.split(" ")[1];

  if (!extractToken && extractToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" });
  }

  let adminId;
  jwt.verify(extractToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  const { title, description, releaseDate, posterUrl, featured, actors } =
    req.body;

  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    // adminUser.addedMovies.push(movie._id);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
  }

  if (!movie) {
    return res.status(500).json({ message: "request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;
  try {
    movies = await Movie.find();
  } catch (error) {
    console.log(error);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request failed" });
  }

  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (error) {
    console.log(error);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie Id" });
  }

  return res.status(200).json({ movie });
};
