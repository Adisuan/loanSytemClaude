const moment = require("moment");
const error = require("../src/error/error");
const { successCodeMessage } = require("../src/code");
const { mockLoans } = require("../data/loan");
const { mockCollaterals, collateralTypes } = require("../data/collateral");
const { mockCustomers } = require("../data/customer");
const { generateCustomerCode, generateLoanCode } = require("../helpers/db");
const { calculateLoan, generateAmortizationSchedule, verifySchedule } = require("../helpers/loanCalculator");
const Occupation = require("../models/occupationModel");
const Customer = require("../models/customerModel");
const Setting = require("../models/settingModel");
const Loan = require("../models/loanModel");
const LoanType = require("../models/loanTypeModel");
const LoanInstallment = require("../models/loanInstallmentModel");

let STATUS_MAP = {
  all: null,
  pending: "รออนุมัติ",
  approved: "อนุมัติ",
  rejected: "ปฏิเสธ",
  closed: "ปิดบัญชี"
};

function fmt(v) {
  return v.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function index(req, res, next) {
  try {
    let statusKey = (req.query.status || "all").toLowerCase();
    let targetStatus = STATUS_MAP[statusKey];
    let filtered = targetStatus ? mockLoans.filter((l) => l.status === targetStatus) : mockLoans;

    let counts = {
      all: mockLoans.length,
      pending: mockLoans.filter((l) => l.status === "รออนุมัติ").length,
      approved: mockLoans.filter((l) => l.status === "อนุมัติ").length,
      rejected: mockLoans.filter((l) => l.status === "ปฏิเสธ").length,
      closed: mockLoans.filter((l) => l.status === "ปิดบัญชี").length
    };

    let parseAmount = (s) => parseFloat(String(s).replace(/,/g, "")) || 0;
    let activeLoans = mockLoans.filter((l) => l.status === "อนุมัติ");
    let totalAmount = mockLoans
      .filter((l) => l.status === "อนุมัติ" || l.status === "ปิดบัญชี")
      .reduce((sum, l) => sum + parseAmount(l.amount), 0);
    let outstandingAmount = activeLoans.reduce((sum, l) => {
      let amt = parseAmount(l.amount);
      let remainRatio = l.term ? Math.max(0, 1 - l.paidInstallments / l.term) : 0;
      return sum + amt * remainRatio;
    }, 0);
    // TODO: overdue tracking ยังไม่มีในข้อมูลจริง ใช้ heuristic ชั่วคราว (approved+progress<10%)
    let overdueCount = activeLoans.filter((l) => l.paidInstallments / l.term < 0.1).length;

    let stats = {
      totalAmount,
      outstandingAmount,
      pendingCount: counts.pending,
      overdueCount
    };

    return res.render("main", {
      page: "loan/index",
      title: "รายการสินเชื่อ",
      breadcrumb: "รายการสินเชื่อ",
      allLoans: filtered,
      activeStatus: statusKey,
      counts,
      stats
    });
  } catch (e) {
    return res.redirect("/");
  }
}

async function apply(req, res, next) {
  try {
    let availableCollaterals = mockCollaterals.filter((c) => c.status === "ว่าง");
    let [occupation, loanType] = await Promise.all([
      Occupation.find({
        isActive: true
      }).sort({
        sort: 1
      }),
      LoanType.find({
        isActive: true
      }).sort({
        sort: 1
      })
    ]);
    return res.render("main", {
      page: "loan/apply",
      title: "ยื่นขอสินเชื่อ",
      breadcrumb: "ยื่นขอสินเชื่อ",
      availableCollaterals,
      collateralTypes,
      existingCustomers: mockCustomers,
      occupation,
      loanType
    });
  } catch (e) {
    console.log(e);
    return res.redirect("/loan");
  }
}

async function detail(req, res, next) {
  try {
    let { id } = req.params;
    let loan = mockLoans.find((l) => l.id === id) || mockLoans[0];

    let P = 150000;
    let r = 7.5 / 100 / 12;
    let n = 36;
    let M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let totalPayment = M * n;
    let totalInterest = totalPayment - P;

    let schedule = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      let interestAmt = balance * r;
      let principalAmt = M - interestAmt;
      balance -= principalAmt;
      let month = new Date(2025, 3 + i, 1);
      let thMonth = month.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
      schedule.push({
        no: i,
        dueDate: thMonth,
        principal: fmt(principalAmt),
        interest: fmt(interestAmt),
        payment: fmt(M),
        balance: fmt(Math.max(0, balance)),
        status: i <= 12 ? "ชำระแล้ว" : i === 13 ? "ค้างชำระ" : "รอชำระ"
      });
    }

    return res.render("main", {
      page: "loan/detail",
      title: loan.id,
      breadcrumb: "รายละเอียดสินเชื่อ",
      loan: {
        ...loan,
        email: "somchai@email.com",
        address: "123/45 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110",
        idCard: "1-1020-12345-67-8",
        occupation: "พนักงานเอกชน",
        income: "45,000",
        monthly: fmt(M),
        totalInterest: fmt(totalInterest),
        totalPayment: fmt(totalPayment),
        startDate: "01/05/2568",
        endDate: "01/04/2571"
      },
      schedule,
      timeline: [
        { title: "อนุมัติสินเชื่อ", desc: "อนุมัติโดย นายสุชาติ หัวหน้าสินเชื่อ", date: "05/04/2568", color: "#10b981" },
        { title: "ตรวจสอบเอกสารแล้ว", desc: "เอกสารครบถ้วน ผ่านการตรวจสอบ", date: "03/04/2568", color: "#3b82f6" },
        { title: "รับคำขอสินเชื่อ", desc: "รับใบคำขอและเอกสารประกอบครบ", date: "01/04/2568", color: "#6b7280" }
      ],
      documents: [
        { name: "บัตรประชาชน.pdf", size: "1.2 MB" },
        { name: "ทะเบียนบ้าน.pdf", size: "0.8 MB" },
        { name: "สลิปเงินเดือน.pdf", size: "0.5 MB" },
        { name: "Statement-6เดือน.pdf", size: "2.1 MB" }
      ]
    });
  } catch (e) {
    return res.redirect("/loan");
  }
}
async function loanCreatePost(req, res, next) {
  try {
    let {
      customerMode,
      customerId,
      namePrefix,
      firstName,
      middleName,
      lastName,
      idCard,
      dateOfbirth,
      age,
      phone,
      email,
      address,
      occupationId,
      companyName,
      companyAddress,
      income,
      incomeOther,
      debt,
      loanTypeId,
      purposeOfloan,
      loanAmount,
      loanTerm,
      loanRate,
      hasCollateral,
      collateralMode,
      collateralType,
      collateralValue,
      existingCollateralId
    } = req.body;
    let currentDate = moment().startOf("day").toDate();

    if (customerMode == "new") {
      let existing = await Customer.findOne({ idCard });
      let customerPayload = {
        name: { prefix: namePrefix, firstName, middleName, lastName },
        idCard,
        dateOfbirth,
        phone,
        email,
        address,
        occupationId,
        companyName,
        companyAddress,
        income,
        incomeOther,
        debt
      };
      if (!existing) {
        for (let index = 0; index < 99; index++) {
          let generateCode = await generateCustomerCode();
          let customerExist = await Customer.exists({ code: generateCode.code });
          if (!customerExist) {
            let customerCreate = await Customer.create({
              code: generateCode.code,
              ...customerPayload
            });
            customerId = customerCreate._id;
            break;
          } else {
            await Setting.updateOne(
              { name: "customerCode" },
              { $inc: { "value.number": 1 } }
            );
          }
        }
      } else {
        customerId = existing._id;
        await Customer.updateOne({ _id: existing._id }, { $set: customerPayload });
      }
    }

    let [customerDoc, loanTypeDoc, occupationDoc] = await Promise.all([
      Customer.findById(customerId),
      LoanType.findById(loanTypeId),
      occupationId ? Occupation.findById(occupationId) : null
    ]);

    if (!customerDoc || !loanTypeDoc) {
      return res.send(error(500));
    }

    let customerSnap = {
      id: customerDoc._id,
      name: {
        prefix: customerDoc.name?.prefix,
        firstName: customerDoc.name?.firstName,
        middleName: customerDoc.name?.middleName,
        lastName: customerDoc.name?.lastName
      },
      idCard: customerDoc.idCard,
      dateOfbirth: customerDoc.dateOfbirth,
      phone: customerDoc.phone,
      email: customerDoc.email,
      address: customerDoc.address,
      income: customerDoc.income,
      incomeOther: customerDoc.incomeOther,
      debt: customerDoc.debt
    };
    let loanTypeSnap = {
      id: loanTypeDoc._id,
      name: { th: loanTypeDoc.name?.th, en: loanTypeDoc.name?.en }
    };
    let occupationSnap = occupationDoc
      ? {
          id: occupationDoc._id,
          name: { th: occupationDoc.name?.th, en: occupationDoc.name?.en }
        }
      : undefined;

    for (let index = 0; index < 99; index++) {
      let loanCode = await generateLoanCode();
      let codeExist = await Loan.exists({ code: loanCode.code });
      if (!codeExist) {
        let summary = calculateLoan({
          principal: loanAmount,
          annualRate: loanRate,
          months: loanTerm
        });
        let loanSchedule = generateAmortizationSchedule({
          principal: loanAmount,
          annualRate: loanRate,
          months: loanTerm,
          date: currentDate
        });

        let loanCreate = await Loan.create({
          code: loanCode.code,
          customer: customerSnap,
          loanType: loanTypeSnap,
          occupation: occupationSnap,
          purposeOfloan,
          loanAmount,
          loanTerm,
          loanRate,
          totalPayment: summary.totalPayment,
          totalInterest: summary.totalInterest,
          outstandingBalance: summary.totalPayment
        });
        loanSchedule = loanSchedule.map((item) => ({
          customerId,
          loanId: loanCreate._id,
          installmentNumber: item.installment,
          dueDate: item.dueDate,
          scheduledAmount: item.payment,
          scheduledPrincipal: item.principal,
          scheduledInterest: item.interest,
          remainingBalance: item.balance
        }));
        await LoanInstallment.insertMany(loanSchedule);
        break;
      } else {
        await Setting.updateOne(
          { name: "loanCode" },
          { $inc: { "value.number": 1 } }
        );
      }
    }
    res.send({
      code: 0,
      message: successCodeMessage({ code: 3 }),
      result: true
    });
  } catch (e) {
    console.log(e);
    return res.send(error(500));
  }
}
async function loanListDataTable(req, res, next) {
  try {
    let { draw, length, start, search, startDate, endDate } = req.body;
    start = Number(start || 0);
    length = Number(length || 50);

    let match = { deletedAt: null };
    if (startDate && endDate) {
      match.createdAt = {
        $gte: moment(startDate).startOf("day").toDate(),
        $lte: moment(endDate).endOf("day").toDate()
      };
    }
    if (search && search.value) {
      let escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let safe = escapeRegex(search.value);
      let isNumeric = !isNaN(search.value) && search.value.trim() !== "";
      let or = [{ code: { $regex: safe, $options: "i" } }];
      if (isNumeric) {
        or.push({ loanAmount: Number(search.value) });
      }
      match.$or = or;
    }

    let basePipeline = [
      { $match: match },
      {
        $lookup: {
          from: "loanInstallment",
          let: { lid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$loanId", "$$lid"] },
                deletedAt: null,
                paidAmount: { $gt: 0 }
              }
            },
            { $count: "count" }
          ],
          as: "paidData"
        }
      },
      {
        $addFields: {
          paidInstallments: { $ifNull: [{ $arrayElemAt: ["$paidData.count", 0] }, 0] }
        }
      },
      {
        $project: {
          _id: 1,
          code: 1,
          customer: 1,
          loanType: 1,
          loanAmount: 1,
          loanRate: 1,
          loanTerm: 1,
          paidInstallments: 1,
          applicationStatus: 1,
          loanStatus: 1,
          createdAt: 1
        }
      }
    ];

    let [result] = await Loan.aggregate([
      ...basePipeline,
      {
        $facet: {
          data: [{ $sort: { createdAt: -1 } }, { $skip: start }, { $limit: length }],
          count: [{ $count: "total" }]
        }
      }
    ]).allowDiskUse(true);

    let data = result?.data || [];
    let countAll = result?.count?.[0]?.total || 0;

    res.send({
      draw,
      recordsTotal: countAll,
      recordsFiltered: countAll,
      data
    });
  } catch (e) {
    console.log(e);
    res.send(error(500));
  }
}
module.exports = {
  index,
  apply,
  detail,
  loanCreatePost,
  loanListDataTable
};
