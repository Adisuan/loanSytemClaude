const Decimal = require("decimal.js");
function calculatePMT({ principal, annualRate, months }) {
  // ดอกเบี้ยต่อเดือน
  let monthlyRate = new Decimal(annualRate).div(100).div(12);

  // กรณีดอกเบี้ย 0%
  if (monthlyRate.eq(0)) {
    return new Decimal(principal).div(months).toNumber();
  }

  // (1 + r)^n
  let factor = monthlyRate.plus(1).pow(months);

  // PMT = P × r × (1+r)^n / ((1+r)^n - 1)
  let pmt = new Decimal(principal).mul(monthlyRate).mul(factor).div(factor.minus(1));

  return parseFloat(pmt.toFixed(2));
}
function calculateLoan({ principal, annualRate, months }) {
  let monthlyPayment = calculatePMT({
    principal,
    annualRate,
    months
  });
  let totalPayment = new Decimal(monthlyPayment).mul(months);
  let totalInterest = totalPayment.minus(principal);

  return {
    monthlyPayment, //จำนวนเงินที่ต้องจ่ายแต่ละงวด
    totalPayment: parseFloat(totalPayment.toFixed(2)), //เงินที่ต้องจ่ายตลอดสัญญา (เงินต้น + ดอกเบี้ย)
    totalInterest: parseFloat(totalInterest.toFixed(2)), //ดอกเบี้ยที่ต้องจ่ายทั้งหมด
    principal, //จำนวนเงินที่กู้ตอนเริ่มต้น (input)
    annualRate, //อัตราดอกเบี้ยต่อปี (input)
    months //ผ่อนกี่เดือน/งวด (input)
  };
}
function generateAmortizationSchedule({ principal, annualRate, months }) {
  const monthlyRate = new Decimal(annualRate).div(100).div(12);
  const monthlyPayment = calculatePMT({
    principal,
    annualRate,
    months
  });

  let schedule = [];
  let balance = new Decimal(principal);

  for (let i = 1; i <= months; i++) {
    // ดอกเบี้ยงวดนี้ = balance × r
    let interest = balance.mul(monthlyRate);

    // เงินต้นงวดนี้ = ค่างวด - ดอกเบี้ย
    let principalPayment = new Decimal(monthlyPayment).minus(interest);
    let payment = new Decimal(monthlyPayment);

    // งวดสุดท้าย: ปรับให้ balance = 0 พอดี (จัดการ rounding)
    if (i === months) {
      principalPayment = balance;
      payment = balance.plus(interest);
    }

    balance = balance.minus(principalPayment);

    schedule.push({
      installment: i,
      payment: parseFloat(payment.toFixed(2)),
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      balance: parseFloat(Math.max(0, balance.toNumber()).toFixed(2))
    });
  }

  return schedule;
}
function verifySchedule(schedule, principal) {
  let totalPrincipal = schedule.reduce((sum, s) => sum.plus(s.principal), new Decimal(0));

  let diff = totalPrincipal.minus(principal).abs();

  if (diff.gt(0.01)) {
    throw new Error(`Schedule error: total principal ${totalPrincipal.toFixed(2)} ≠ ${principal}`);
  }
  return true;
}
module.exports = {
  calculatePMT,
  calculateLoan,
  generateAmortizationSchedule,
  verifySchedule
};
