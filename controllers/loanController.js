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

    return res.render("main", {
      page: "loan/index",
      title: "รายการสินเชื่อ",
      breadcrumb: "รายการสินเชื่อ",
      allLoans: filtered,
      activeStatus: statusKey,
      counts
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
    let endDate = moment(currentDate).endOf("day").toDate();
    console.log(req.body);
    if (customerMode == "new") {
      let customer = await Customer.findOne({
        idCard
      });
      if (!customer) {
        for (let index = 0; index < 99; index++) {
          let generateCode = await generateCustomerCode();
          let customerExist = await Customer.exists({
            code: generateCode.code
          });
          if (!customerExist) {
            let customerCreate = await Customer.create({
              code: generateCode.code,
              name: {
                prefix: namePrefix,
                firstName,
                lastName
              },
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
            });
            customerId = customerCreate.id;
            break;
          } else {
            await Setting.updateOne(
              {
                name: "customerCode"
              },
              {
                $inc: {
                  "value.number": 1
                }
              }
            );
          }
        }
      } else {
        customerId = customer.id;
        await Customer.updateOne(
          {
            _id: customer.id
          },
          {
            $set: {
              name: {
                prefix: namePrefix,
                firstName,
                lastName
              },
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
            }
          }
        );
      }
    }
    for (let index = 0; index < 99; index++) {
      let loanCode = await generateLoanCode();
      let codeExist = await Loan.exists({
        code: loanCode.code
      });
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

        console.log(loanSchedule);
        return res.send(error(500));
        let loanCreate = await Loan.create({
          code: loanCode.code,
          customerId,
          loanTypeId,
          purposeOfloan,
          loanAmount,
          loanTerm,
          loanRate,
          totalPayment: summary.totalPayment,
          totalInterest: summary.totalInterest,
          outstandingBalance: summary.totalPayment
        });
        loanSchedule = loanSchedule.map((item, index) => {
          return {
            loanId: loanCreate.id,
            installmentNumber: item.number,
            dueDate: endDate
          };
        });
        await LoanInstallment.createMany(loadSchedule);
        break;
      } else {
        await Setting.updateOne(
          {
            name: "loanCode"
          },
          {
            $inc: {
              "value.number": 1
            }
          }
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

module.exports = {
  index,
  apply,
  detail,
  loanCreatePost
};
