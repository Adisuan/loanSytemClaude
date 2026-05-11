const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
let schema = Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: ["personal", "business", "home", "car"]
    },
    name: {
      th: {
        type: String,
        required: true
      },
      en: {
        type: String
      }
    },
    rate: {
      type: Number,
      default: 0
    },
    description: String,
    sort: {
      type: Number,
      default: 1
    },
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
schema.index({
  createdAt: 1
});
schema.index({ sort: 1, "name.th": 1 });

let LoanType = mongoose.model("LoanType", schema, "loanType");
module.exports = LoanType;
