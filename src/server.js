const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) =>
  res.render(path.resolve(__dirname, "..", "public", "index.html"))
);

const messages = [];

io.on("connection", (socket) => {
  console.log({
    message: `User has been conected`,
    pid: process.pid,
  });

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (message) => {
    console.count("sendMessage");
    console.log("Sending message", message);
    messages.push(message);
    socket.broadcast.emit("receivedMessage", message);
  });
});

server.listen(3000, () =>
  console.log("App started at port http://localhost:3000")
);
