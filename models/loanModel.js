const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const schema = Schema(
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
schema.index({
  createdAt: 1
});

const Loan = mongoose.model("Loan", schema, "loan");
module.exports = Loan;
