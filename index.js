const express = require("express");
const cors = require("cors");

const app = express();

const postRouter = require("./routes/posts");

const port = 3000;

app.use(cors());

app.use("/posts", postRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
