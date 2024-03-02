const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json());

app.listen(8500, () => {
    console.log(`Server is listening on port ${8500}`)
})