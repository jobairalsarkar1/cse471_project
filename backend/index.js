// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// Routes
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
// const sectionRoutes = require("./routes/sectionRoutes");
// const classroomRoutes = require("./routes/classroomRoutes");
// const consultationRoutes = require("./routes/consultationRoutes");
// const advisingPanelRoutes = require("./routes/advisingPanelRoutes");
// const gradeSheetRoutes = require("./routes/gradeSheetRoutes");
const path = require("path");

// Load Environment variables
dotenv.config();

// Initialize the App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error(`MongoDB connection error ${error}`);
  });

// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
// app.use("/api/sections", sectionRoutes);
// module 2
// app.use("/api/classrooms", classroomRoutes);
// app.use("/api/consultations", consultationRoutes);
// app.use("/api/advising-panels", advisingPanelRoutes);
// app.use("/api/grade-sheets", gradeSheetRoutes);

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// // Catch-all handler to return index.html for any non-API routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
