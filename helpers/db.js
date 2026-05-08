const moment = require("moment");
const Setting = require("../models/settingModel");

async function generateCustomerCode() {
  let customerCode = await Setting.findOne({
    name: "customerCode"
  });
  if (customerCode) {
    customerCode = customerCode.value;
    let nextNumber = customerCode.number + 1;
    let runningNumber = String(nextNumber).padStart(4, "0");
    return {
      code: `${customerCode.code}${runningNumber}`,
      customerCode
    };
  }
}
async function generateLoanCode() {
  let year = moment().format("YYYY");
  let prefix = `LN-${year}-`;
  let loanCode = await Setting.findOne({
    name: "loanCode"
  });
  if (loanCode) {
    loanCode = loanCode.value;
    let number = loanCode.number + 1;
    let runningNumber = String(number).padStart(4, "0");
    if (year != loanCode.year) {
      await Setting.updateOne(
        {
          name: "loanCode"
        },
        {
          $set: {
            "value.year": year
          }
        }
      );
    } else {
      year = loanCode.year;
    }
    return {
      code: `${loanCode.code}-${year}-${runningNumber}`
    };
  }
  return {
    code: `${prefix}${runningNumber}`,
    number,
    setting: setting.value
  };
}
module.exports = {
  generateCustomerCode,
  generateLoanCode
};
