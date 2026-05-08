const { mockLoans } = require("../data/loan");
const Occupation = require("../models/occupationModel");

async function dashboard(req, res, next) {
  try {
    return res.render("main", {
      page: "dashboard",
      title: "แดชบอร์ด",
      loans: mockLoans.slice(0, 5)
    });
  } catch (e) {
    return res.redirect("/auth/login");
  }
}
module.exports = {
  dashboard
};
