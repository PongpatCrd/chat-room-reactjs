const configs = require("../configs");

const mongoose = require("mongoose");

const url = configs.mongoUri

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = mongoose
