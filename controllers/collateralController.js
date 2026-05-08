const { mockCollaterals, collateralTypes } = require("../data/collateral");

function calcStats(items) {
  let sumValue = items.reduce((acc, c) => {
    let n = parseFloat(String(c.estimatedValue).replace(/,/g, "")) || 0;
    return acc + n;
  }, 0);
  return {
    total: items.length,
    available: items.filter((c) => c.status === "ว่าง").length,
    inUse: items.filter((c) => c.status === "ใช้ค้ำอยู่").length,
    released: items.filter((c) => c.status === "ปลดแล้ว").length,
    sumValue: sumValue.toLocaleString("th-TH")
  };
}

async function index(req, res, next) {
  try {
    return res.render("main", {
      page: "collateral/index",
      title: "หลักประกัน",
      breadcrumb: "หลักประกัน",
      collaterals: mockCollaterals,
      stats: calcStats(mockCollaterals)
    });
  } catch (e) {
    return res.redirect("/");
  }
}

async function newForm(req, res, next) {
  try {
    return res.render("main", {
      page: "collateral/form",
      title: "เพิ่มหลักประกัน",
      breadcrumb: "เพิ่มหลักประกัน",
      mode: "create",
      item: null,
      types: collateralTypes
    });
  } catch (e) {
    return res.redirect("/collateral");
  }
}

async function create(req, res, next) {
  try {
    return res.redirect("/collateral");
  } catch (e) {
    return res.redirect("/collateral");
  }
}

async function detail(req, res, next) {
  try {
    let { id } = req.params;
    let item = mockCollaterals.find((c) => c.id === id) || mockCollaterals[0];
    return res.render("main", {
      page: "collateral/detail",
      title: item.title,
      breadcrumb: "หลักประกัน",
      item
    });
  } catch (e) {
    return res.redirect("/collateral");
  }
}

async function editForm(req, res, next) {
  try {
    let { id } = req.params;
    let item = mockCollaterals.find((c) => c.id === id) || mockCollaterals[0];
    return res.render("main", {
      page: "collateral/form",
      title: "แก้ไขหลักประกัน",
      breadcrumb: "แก้ไขหลักประกัน",
      mode: "edit",
      item,
      types: collateralTypes
    });
  } catch (e) {
    return res.redirect("/collateral");
  }
}

async function update(req, res, next) {
  try {
    let { id } = req.params;
    return res.redirect(`/collateral/${id}`);
  } catch (e) {
    return res.redirect("/collateral");
  }
}

async function destroy(req, res, next) {
  try {
    return res.redirect("/collateral");
  } catch (e) {
    return res.redirect("/collateral");
  }
}

module.exports = {
  index,
  newForm,
  create,
  detail,
  editForm,
  update,
  destroy
};
