require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./configs/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./configs/connectDB");
const verifyToken = require("./middlewares/verifyToken");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");
const swaggerSecurity = require("./middlewares/swaggerSecurity");
const port = process.env.PORT || 4000;

connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => res.send("Welcome to Calorie Tracker API"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", require("./routes/authRoutes"));

app.use(swaggerSecurity);
app.use(verifyToken);
app.use("/users", require("./routes/userRoutes"));
app.use("/meals", require("./routes/mealRoutes"));
app.use("/foodEntries", require("./routes/foodEntryRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/invite", require("./routes/inviteRoutes"));

mongoose.connection.once("open", () =>
  app.listen(port, () =>
    console.log(`Calorie app server listening on port ${port}`)
  )
);

mongoose.connection.on("error", err => console.log(`MongoDB Error: ${err}`));
