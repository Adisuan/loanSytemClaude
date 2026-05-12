const mongoose = require("./connectDB");
const Schema = mongoose.Schema;
const schema = Schema(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    installmentNumber: {
      type: Number,
      required: true // งวดที่ 1, 2, 3...
    },
    dueDate: Date,
    daysPastDue: { type: Number, default: 0 }, // ค้างชำระกี่วัน
    scheduledAmount: { type: Number, required: true }, // ค่างวดที่ต้องจ่าย (867.74)
    scheduledPrincipal: { type: Number, required: true }, // ส่วนเงินต้น (805.24)
    scheduledInterest: { type: Number, required: true }, // ส่วนดอกเบี้ย (62.50)
    paidAmount: { type: Number, default: 0 }, // จ่ายมาทั้งหมด
    paidPrincipal: { type: Number, default: 0 }, // ตัดเงินต้นไปเท่าไหร่
    paidInterest: { type: Number, default: 0 }, // จ่ายดอกเบี้ยไปเท่าไหร่
    paidPenalty: { type: Number, default: 0 }, // จ่ายค่าปรับไปเท่าไหร่
    // ===== ค่าปรับ =====
    penaltyAmount: { type: Number, default: 0 }, // ค่าปรับสะสม
    penaltyRate: { type: Number, default: 0 }, // อัตราค่าปรับ %/วัน
    // ===== ยอดคงเหลือ ====
    remainingBalance: { type: Number, required: true }, // เงินต้นคงเหลือหลังงวดนี้

    fullyPaidAt: Date, // จ่ายครบเมื่อไหร่
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

const LoanInstallment = mongoose.model("LoanInstallment", schema, "loanInstallment");
module.exports = LoanInstallment;
