const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan")

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const server = express();
server.use(express.json());

// third party middleware
// server.use(helmet());
// server.use(morgan("dev"));


server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/users", userRouter);
server.use("/posts", postRouter);


//custom middleware
function logger(req, res, next) {
  console.log(`${req.method}\n Request to \n${req.originalUrl} at ${Date.now()}`)

  next();
}

module.exports = server;
