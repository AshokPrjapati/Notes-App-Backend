const express = require("express");
const connection = require("./config/db");
const auth = require("./routes/user.routes");
const authenticate = require("./middleware/authenticate.mw");
const note = require("./routes/Notes.routes");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", auth);
app.use(authenticate)
app.use("/notes", note);



app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to mongoDB")
    } catch (e) {
        console.log(e.message)
    }
    console.log(`server is running at port ${port}`);
})