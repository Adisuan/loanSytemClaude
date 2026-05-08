const { mockPayments, dueTodayList, overdueList, loanMap } = require("../data/payment");

let CHANNEL_NAMES = {
  cash: "เงินสด",
  transfer: "โอนเงิน / PromptPay",
  qr: "QR Code",
  atm: "ATM",
  auto: "หักบัญชีอัตโนมัติ"
};

function fmt(n) {
  return Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function index(req, res, next) {
  try {
    return res.render("main", {
      page: "payment/index",
      title: "การชำระเงิน",
      breadcrumb: "การชำระเงิน",
      payments: mockPayments,
      dueTodayList,
      overdueList
    });
  } catch (e) {
    return res.redirect("/");
  }
}

async function newForm(req, res, next) {
  try {
    let today = new Date().toISOString().split("T")[0];
    return res.render("main", {
      page: "payment/new",
      title: "บันทึกการชำระเงิน",
      breadcrumb: "บันทึกการชำระเงิน",
      selectedLoanId: req.query.loan || "",
      today
    });
  } catch (e) {
    return res.redirect("/payment");
  }
}

async function create(req, res, next) {
  try {
    let { loanId, amount, payDate, channel, refNo } = req.body;

    let loan = loanMap[loanId] || {
      borrower: "ผู้กู้",
      type: "สินเชื่อบุคคล",
      amount: 100000,
      rate: 7.5,
      term: 24,
      paid: 1
    };
    let r = loan.rate / 100 / 12;
    let n = loan.term;
    let P = loan.amount;
    let M = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;

    let bal = P;
    for (let i = 0; i < loan.paid; i++) {
      bal -= M - bal * r;
    }
    let interestAmt = bal * r;
    let principalAmt = M - interestAmt;
    let nextNo = loan.paid + 1;
    let remainBal = bal - principalAmt;

    let receiptNo = "RCP-" + Date.now().toString().slice(-8);
    let d = payDate ? new Date(payDate) : new Date();
    let payDateTh = d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });

    return res.render("main", {
      page: "payment/receipt",
      title: "ใบเสร็จรับเงิน",
      breadcrumb: "ใบเสร็จรับเงิน",
      receipt: {
        receiptNo,
        loanId: loanId || "LN-2025-0001",
        borrower: loan.borrower,
        loanType: loan.type,
        installment: nextNo,
        totalInstallments: loan.term,
        payDate: payDateTh,
        principal: fmt(principalAmt),
        interest: fmt(interestAmt),
        penalty: null,
        total: fmt(parseFloat(amount) || M),
        channel: CHANNEL_NAMES[channel] || channel || "เงินสด",
        refNo: refNo || null,
        remainBalance: fmt(Math.max(0, remainBal)),
        remainInstallments: loan.term - nextNo
      }
    });
  } catch (e) {
    return res.redirect("/payment");
  }
}

async function receipt(req, res, next) {
  try {
    let { receiptNo } = req.params;
    let p = mockPayments.find((x) => x.receiptNo === receiptNo) || mockPayments[0];
    return res.render("main", {
      page: "payment/receipt",
      title: "ใบเสร็จรับเงิน",
      breadcrumb: "ใบเสร็จรับเงิน",
      receipt: {
        receiptNo: p.receiptNo,
        loanId: p.loanId,
        borrower: p.borrower,
        loanType: "สินเชื่อบุคคล",
        installment: p.installment,
        totalInstallments: 36,
        payDate: p.date,
        principal: "4,068.55",
        interest: "557.35",
        penalty: null,
        total: p.amount,
        channel: p.channel,
        refNo: "REF" + p.receiptNo.replace("RCP-", ""),
        remainBalance: "101,776.28",
        remainInstallments: 36 - p.installment
      }
    });
  } catch (e) {
    return res.redirect("/payment");
  }
}

module.exports = {
  index,
  newForm,
  create,
  receipt
};
