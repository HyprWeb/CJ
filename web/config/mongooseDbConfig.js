const mongoose = require("mongoose");
mongoose
  .connect(`mongodb://mongodb:27018/hyprDB`, {
    socketTimeoutMS: 6000000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the DB");
  })
  .catch((e) => {
    console.log(e);
  });