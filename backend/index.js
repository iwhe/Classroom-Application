const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const { app } = require("./server.js");

dotenv.config({
  path: "./.env",
});

// MongoDB Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 7000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo db connection failed!", err);
  });
