const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const settingSchema = Schema(
  {
    name: {
      type: String,
      unique: true
    },
    value: {},
    text: String,
    sort: {
      type: Number
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    toObject: {
      virtuals: true
    },
    timestamps: true
  }
);
// settingSchema.index({
//   name: 1
// });
const Setting = mongoose.model("Setting", settingSchema, "setting");
module.exports = Setting;
