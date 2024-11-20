const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: [true, "Please provide the location where the ground is"],
  },
  photo: {
    type: String,
    required: [true, "Provide a photo to help people visualize"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const FootballGround =
  mongoose.models.FootballGround ||
  mongoose.model("FootballGround", turfSchema);

export default FootballGround;
