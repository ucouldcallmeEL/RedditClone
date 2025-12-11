require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./Db_config/connectDB");


//Routers
const uploadRoute = require("./Routes/upload");
const notificationRouter = require("./Routes/notification.routes");
const userRouter = require("./Routes/user.routes");
const postRouter = require("./Routes/post.routes");





const app = express();
app.use(cors({origin: "*"}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    

connectDB();      

app.use("/upload", uploadRoute);
app.use("/notifications" , notificationRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);


app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
