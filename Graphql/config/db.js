const mongoose = require("mongoose");

require("dotenv").config({
  path: "variables.env",
});

/**
 * Create the dbConnection
 */
const createConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log("Error \n");
    console.log(error);
    process.exit(1); //abort app (close)
  }
};

module.exports = createConnection;
