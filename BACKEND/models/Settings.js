const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    adPagesCount: { type: Number, default: 0, min: 0, max: 4 },
    adTimer: { type: Number, default: 10, min: 3 },
    adScript: { type: String, default: "" },
    rootFileName: { type: String, default: "" },
    rootFileContent: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
