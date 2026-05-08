const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const userSchema = Schema(
  {
    code: {
      type: String,
      unique: true
    },
    customerId: Schema.Types.ObjectId,
    // name: {
    //   prefix: { type: String },
    //   firstName: { type: String, required: true },
    //   middleName: { type: String, trim: true },
    //   lastName: { type: String, required: true }
    // },
    occupationId: Schema.Types.ObjectId,
    data: {},
    isActive: {
      type: Boolean,
      default: true
    },
    deletedAt: {
      type: Date,
      default: null
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
userSchema.index({
  createdAt: 1
});

const User = mongoose.model("User", userSchema, "user");
module.exports = User;
