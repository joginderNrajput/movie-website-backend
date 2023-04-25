  import Admin from "../models/Admin";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";

  // export const addAdmin = async (req, res, next) => {
  //   const { email, password, movieId } = req.body; // add the movieId to the request body
  
  //   let existingAdmin;
  //   try {
  //     existingAdmin = await Admin.findOne({ email });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  
  //   if (existingAdmin) {
  //     return res.status(400).json({ message: "User Already Exists" });
  //   }
  
  //   let movie;
  //   try {
  //     movie = await Movie.findById(movieId);
  //     if (!movie) {
  //       return res.status(400).json({ message: "Movie not found" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  
  //   let admin;
  //   const hashedPassword = bcrypt.hashSync(password);
  //   try {
  //     admin = new Admin({ email, password: hashedPassword, addedMovies: [movieId] });
  //     admin = await admin.save();
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Unable to store admin" });
  //   }
  
  //   if (!admin) {
  //     return res.status(500).json({ message: "Unable to store admin" });
  //   }
  
  //   movie.addedAdmins.push(admin._id);
  //   try {
  //     await movie.save();
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Unable to update movie" });
  //   }
  
  //   return res.status(201).json(admin);
  // };
  
  export const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    let existingAdmin;

    try {
      existingAdmin = await Admin.findOne({ email });
    } catch (error) {
      console.log(error);
    }

    if (existingAdmin) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password);

    try {
      admin = new Admin({ email, password: hashedPassword });
      admin = await admin.save();
    } catch (error) {
      return console.log(error);
    }

    if (!admin) {
      return res.status(500).json({ message: "Unable to store admin" });
    }
    return res.status(201).json(admin);
  };

  export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email && email.trim() === "" && !password && password.trim() === "") {
      return res.status(422).json({ message: "  Invalid Inputs" });
    }

    let existingAdmin;
    try {
      existingAdmin = await Admin.findOne({ email });
    } catch (error) {
      console.log(error);
    }

    if (!existingAdmin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingAdmin.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "incorrect Password" });
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    return res
      .status(200)
      .json({ message: "Authentication Complete", token, id: existingAdmin._id });
  };

  export const getAdmins = async (req, res, next) => {
    let admins;
    try {
      admins = await Admin.find();
      // admins = await Admin.find().populate("addedMovies");
    } catch (error) {
      return console.log(error);
    }

    if (!admins) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ admins });
  };
