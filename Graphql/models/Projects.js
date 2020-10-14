const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  createdBy: {
    /**
     * Id realated to entity
     */
    type: mongoose.Schema.Types.ObjectId,
    /**
     * ref is the a collection to go relationship
     */
    ref: "Users",
  },
  register: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Projects", ProjectSchema);
