const express = require("express");
const app = express();
const cors = require('cors')
const dotenv = require("dotenv");
const bodyParser =   require("body-parser")
const connectMongoDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const PORT = process.env.PORT  || 5000;


dotenv.config();
connectMongoDB();


app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
app.use("/api/v1" , userRoutes);


app.get("/", (req, res) => {
  res.send("api is working");
});



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
