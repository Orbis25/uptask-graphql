const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
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
  projectId: {
    /**
     * Id realated to entity
     */
    type: mongoose.Schema.Types.ObjectId,
    /**
     * ref is the a collection to go relationship
     */
    ref: "Projects",
  },
  state: {
    type: Boolean,
    default: false,
  },
  register: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Tasks", TaskSchema);
