const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

const transcriptRouter = require("./routes/transcript");
app.use("/transcript", transcriptRouter);

app.listen(8500, () => {
  console.log(`Server is listening on port ${8500}`);
});
