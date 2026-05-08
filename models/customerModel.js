const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const schema = Schema(
  {
    code: {
      type: String,
      unique: true
    },
    name: {
      prefix: { type: String },
      firstName: { type: String, required: true },
      middleName: { type: String, trim: true },
      lastName: { type: String, required: true }
    },
    idCard: String,
    dateOfbirth: Date,
    phone: String,
    email: String,
    address: String,

    // ข้อมูลการงาน / รายได้ — latest snapshot
    // (ตอนทำสัญญาควร snapshot ลง loanModel ด้วย เพื่อ audit ย้อนหลัง)
    occupationId: Schema.Types.ObjectId,
    companyName: String,
    companyAddress: String,
    income: Number,
    incomeOther: Number,
    debt: Number,

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
schema.index({ idCard: 1 });
schema.index({ phone: 1 });

const Customer = mongoose.model("Customer", schema, "customeruser");
module.exports = Customer;
