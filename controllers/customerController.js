const { mockCustomers } = require("../data/customer");

async function index(req, res, next) {
  try {
    return res.render("main", {
      page: "customer/index",
      title: "ข้อมูลลูกค้า",
      breadcrumb: "ข้อมูลลูกค้า",
      customers: mockCustomers,
      stats: {
        total: mockCustomers.length,
        newThisMonth: 2,
        hasLoan: mockCustomers.filter((c) => c.activeLoans > 0).length,
        overdue: mockCustomers.filter((c) => c.status === "ค้างชำระ").length
      }
    });
  } catch (e) {
    return res.redirect("/");
  }
}

async function detail(req, res, next) {
  try {
    let { id } = req.params;
    let customer = mockCustomers.find((c) => c.id === id) || mockCustomers[0];

    let loans = [
      { id: "LN-2025-0001", type: "สินเชื่อบุคคล", amount: "150,000", rate: 7.5, term: 36, paid: 12, status: "อนุมัติ", date: "01/04/2568" }
    ];

    let payments = [
      { no: 12, date: "01/04/2568", amount: "4,625.90", channel: "โอนเงิน", status: "สำเร็จ" },
      { no: 11, date: "01/03/2568", amount: "4,625.90", channel: "โอนเงิน", status: "สำเร็จ" },
      { no: 10, date: "01/02/2568", amount: "4,625.90", channel: "เงินสด", status: "สำเร็จ" },
      { no: 9, date: "01/01/2568", amount: "4,625.90", channel: "โอนเงิน", status: "สำเร็จ" },
      { no: 8, date: "01/12/2567", amount: "4,625.90", channel: "QR Code", status: "สำเร็จ" }
    ];

    return res.render("main", {
      page: "customer/detail",
      title: customer.prefix + customer.name,
      breadcrumb: "ข้อมูลลูกค้า",
      customer,
      loans,
      payments
    });
  } catch (e) {
    return res.redirect("/customer");
  }
}

module.exports = {
  index,
  detail
};
