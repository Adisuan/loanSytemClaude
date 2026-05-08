const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const schema = Schema(
  {
    name: {
      th: {
        type: String,
        required: true
      },
      en: {
        type: String
      }
    },
    description: String,
    // ลำดับการแสดงใน dropdown
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
schema.index({ sort: 1, name: 1 });

const Occupation = mongoose.model("Occupation", schema, "occupation");
module.exports = Occupation;
