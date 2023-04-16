const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");


connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json()); // body parser middleware



app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/shorten", require("./routes/shortenRoutes"));
app.use("/", require("./routes/homeRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use(errorHandler);


app.listen(port, () => console.log(`App listening on port ${port}!`));
