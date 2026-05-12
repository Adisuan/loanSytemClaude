function calculateLoan({ principal, annualRate, months }) {
  let principalDecimal = new Decimal(principal);
  let annualRateDecimal = new Decimal(annualRate);
  let monthsDecimal = new Decimal(months);

  // จำนวนปี = จำนวนงวด / 12
  let years = monthsDecimal.div(12);

  // ดอกเบี้ยทั้งหมด = เงินต้น × ดอกเบี้ยต่อปี × จำนวนปี
  let totalInterest = principalDecimal.mul(annualRateDecimal).div(100).mul(years);

  // ดอกเบี้ยต่อเดือน
  let monthlyInterest = totalInterest.div(monthsDecimal);

  // เงินต้นต่อเดือน
  let monthlyPrincipal = principalDecimal.div(monthsDecimal);

  // ค่างวดต่อเดือน
  let monthlyPayment = monthlyPrincipal.plus(monthlyInterest);

  // เงินที่ต้องจ่ายทั้งหมด
  let totalPayment = principalDecimal.plus(totalInterest);

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    monthlyPrincipal: parseFloat(monthlyPrincipal.toFixed(2)),
    monthlyInterest: parseFloat(monthlyInterest.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    principal: parseFloat(principalDecimal.toFixed(2)),
    annualRate: parseFloat(annualRateDecimal.toFixed(2)),
    months: parseInt(months, 10),
    years: parseFloat(years.toFixed(2))
  };
}
function generateAmortizationSchedule({ principal, annualRate, months }) {
  let loan = calculatePMT({
    principal,
    annualRate,
    months
  });

  let schedule = [];
  let balance = new Decimal(principal);

  for (let i = 1; i <= Number(months); i++) {
    let principalPayment = new Decimal(loan.monthlyPrincipal);
    let interest = new Decimal(loan.monthlyInterest);
    let payment = principalPayment.plus(interest);

    // งวดสุดท้าย ปรับเศษทศนิยมให้ balance = 0
    if (i === Number(months)) {
      principalPayment = balance;
      payment = principalPayment.plus(interest);
    }

    balance = balance.minus(principalPayment);

    schedule.push({
      installment: i,
      payment: parseFloat(payment.toFixed(2)),
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      balance: parseFloat(Decimal.max(0, balance).toFixed(2))
    });
  }

  return schedule;
}

function verifySchedule(schedule, principal) {
  let totalPrincipal = schedule.reduce((sum, s) => {
    return sum.plus(s.principal);
  }, new Decimal(0));

  let diff = totalPrincipal.minus(principal).abs();

  if (diff.gt(0.01)) {
    throw new Error(`Schedule error: total principal ${totalPrincipal.toFixed(2)} ≠ ${principal}`);
  }

  return true;
}
