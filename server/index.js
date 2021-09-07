const express = require("express");
const cors = require("cors");

// 1. adding already written routes
const authRoutes = require("./routes/auth.js")

//  creating instance od express
const app = express();
const PORT = process.env.PORT || 5000;




//  to make cross-origin requests
app.use(cors());

//  to pass JSON payloads from the front-end to the back-end
app.use(express.json());


app.use(express.urlencoded());

//  creating a route
app.get("/", (req, res) => {
    res.send("Hello World!")
})

// 2. adding already written routes
app.use("/auth", authRoutes)


app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));