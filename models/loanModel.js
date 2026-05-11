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
    loanTypeId: Schema.Types.ObjectId,
    purposeOfloan: String,
    loanAmount: {
      type: Number,
      default: 0
    },
    loanTerm: {
      type: Number,
      default: 0
    },
    loanRate: {
      type: Number,
      default: 0
    },
    totalPaid: { type: Number, default: 0 }, //จ่ายแล้ว
    totalPayment: { type: Number, default: 0 },
    totalInterest: { type: Number, default: 0 }, //ดอกเบี้ย
    outstandingBalance: { type: Number, default: 0 }, //คงเหลือ
    isActive: {
      type: Boolean,
      default: true
    },
    applicationStatus: {
      type: String,
      enum: [
        "draft", // ลูกค้ากำลังกรอกข้อมูล ยังไม่ส่ง
        "submitted", // ส่งใบสมัครแล้ว รอตรวจสอบ
        "under_review", // กำลังตรวจสอบเอกสาร
        "pending_documents", // รอเอกสารเพิ่มเติม
        "credit_check", // กำลังเช็คเครดิต
        "approved", // อนุมัติแล้ว
        "rejected", // ปฏิเสธ
        "cancelled", // ยกเลิกโดยลูกค้า
        "expired" // หมดอายุ (ลูกค้าไม่ตอบรับ)
      ],
      default: "draft"
    },
    loanStatus: {
      type: String,
      enum: [
        "pending_disbursement", // รอการเบิกจ่าย
        "active", // กำลังผ่อนชำระปกติ
        "overdue", // ค้างชำระ
        "in_grace_period", // อยู่ในช่วงผ่อนผัน
        "restructured", // ปรับโครงสร้างหนี้
        "paid_off", // ชำระครบแล้ว
        "defaulted", // ผิดนัดชำระ (NPL)
        "written_off", // ตัดหนี้สูญ
        "legal_action", // ดำเนินคดี
        "settled" // ประนอมหนี้แล้ว
      ],
      required: false
    },
    installmentStatus: {
      type: String,
      enum: [
        "upcoming", // ยังไม่ถึงกำหนด
        "due", // ถึงกำหนดชำระ
        "paid", // ชำระแล้ว
        "partial", // ชำระบางส่วน
        "overdue", // เลยกำหนด
        "waived" // ยกเว้น
      ],
      required: false
    },
    closedAt: Date,
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
