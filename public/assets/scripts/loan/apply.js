const typeNames = { personal: "สินเชื่อบุคคล", business: "สินเชื่อธุรกิจ", home: "สินเชื่อบ้าน", car: "สินเชื่อรถยนต์" };
let fpDateOfBirth;
$(document).ready(function () {
  initSelect2({ select: ".select-select2" });
  initSelect2({ select: "#namePrefix" });
  fpDateOfBirth = flatpickr("#dateOfbirth", {
    locale: "th",
    mode: "single",
    dateFormat: "Y-m-d", //"d-m-Y", //Y-m-d
    altFormat: "j M Y",
    enableTime: false,
    time_24hr: true,
    disableMobile: true,
    allowInput: true,
    defaultDate: moment().startOf("day").format("YYYY-MM-DD")
  });
});
function fmt(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcLoan() {
  const P = parseFloat(document.getElementById("loanAmount").value) || 0;
  const n = parseInt(document.getElementById("loanTerm").value) || 0;
  const r = (parseFloat(document.getElementById("loanRate").value) || 0) / 100 / 12;
  const type = document.getElementById("loanType").value;

  document.getElementById("sum-type").textContent = typeNames[type] || "-";
  document.getElementById("sum-amount").textContent = P ? "฿" + fmt(P) : "-";
  document.getElementById("sum-term").textContent = n ? n + " เดือน" : "-";
  document.getElementById("sum-rate").textContent = document.getElementById("loanRate").value + "%/ปี";

  if (P && n && r) {
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = M * n;
    const interest = total - P;
    document.getElementById("monthlyPayment").textContent = "฿" + fmt(M);
    document.getElementById("totalInterest").textContent = "฿" + fmt(interest);
    document.getElementById("totalPayment").textContent = "฿" + fmt(total);
    document.getElementById("sum-monthly").textContent = "฿" + fmt(M) + "/เดือน";
    document.getElementById("calcResult").style.display = "";
  }
}

["loanAmount", "loanTerm", "loanRate", "loanType"].forEach((id) => {
  document.getElementById(id).addEventListener("input", calcLoan);
  document.getElementById(id).addEventListener("change", calcLoan);
});

// หลักค้ำประกัน toggle
const collateralSwitch = document.getElementById("hasCollateral");
const collateralDetail = document.getElementById("collateralDetail");
const collateralTypeSelect = document.getElementById("collateralType");
const sumCollateral = document.getElementById("sum-collateral");
const collateralModeInput = document.getElementById("collateralMode");
const modeExisting = document.getElementById("collateralModeExisting");
const modeNew = document.getElementById("collateralModeNew");

const collateralTypeNames = {
  land: "ที่ดิน / โฉนดที่ดิน",
  house: "บ้าน / อาคาร",
  car: "รถยนต์",
  motorcycle: "รถจักรยานยนต์",
  phone: "โทรศัพท์มือถือ",
  electronics: "เครื่องใช้ไฟฟ้า",
  jewelry: "ทองคำ / เครื่องประดับ",
  other: "อื่นๆ"
};

// apply icon backgrounds from data-bg
document.querySelectorAll(".collateral-icon[data-bg]").forEach((el) => {
  el.style.background = el.dataset.bg;
  el.style.width = "40px";
  el.style.height = "40px";
});

function updateSummaryFromMode() {
  if (!collateralSwitch.checked) {
    sumCollateral.textContent = "ไม่มี";
    sumCollateral.style.color = "";
    return;
  }
  sumCollateral.style.color = "#10b981";
  if (collateralModeInput.value === "existing") {
    const picked = document.querySelector('input[name="existingCollateralId"]:checked');
    if (picked) {
      const label = picked.closest(".collateral-option");
      const title = label ? label.querySelector(".fw-500").textContent : "";
      sumCollateral.textContent = title || "เลือกแล้ว";
    } else {
      sumCollateral.textContent = "มี (ยังไม่เลือก)";
    }
  } else {
    sumCollateral.textContent = collateralTypeNames[collateralTypeSelect.value] || "มี (ยังไม่ระบุประเภท)";
  }
}

collateralSwitch.addEventListener("change", function () {
  collateralDetail.style.display = this.checked ? "" : "none";
  updateSummaryFromMode();
});

collateralTypeSelect.addEventListener("change", function () {
  const val = this.value;
  document.getElementById("extra-land").style.display = val === "land" || val === "house" ? "" : "none";
  document.getElementById("extra-vehicle").style.display = val === "car" || val === "motorcycle" ? "" : "none";
  document.getElementById("extra-other").style.display =
    val === "phone" || val === "electronics" || val === "jewelry" || val === "other" ? "" : "none";
  updateSummaryFromMode();
});

// Tab switching
document.querySelectorAll("#collateralModeTabs button[data-mode]").forEach((btn) => {
  btn.addEventListener("click", function () {
    const mode = this.dataset.mode;
    collateralModeInput.value = mode;
    document.querySelectorAll("#collateralModeTabs .nav-link").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    modeExisting.classList.toggle("d-none", mode !== "existing");
    modeNew.classList.toggle("d-none", mode !== "new");
    updateSummaryFromMode();
  });
});

// Existing collateral selection — update summary
document.querySelectorAll('input[name="existingCollateralId"]').forEach((r) => {
  r.addEventListener("change", updateSummaryFromMode);
});

// Highlight selected card
document.querySelectorAll(".collateral-option").forEach((label) => {
  label.addEventListener("click", () => {
    document.querySelectorAll(".collateral-option").forEach((l) => l.classList.remove("border-primary", "bg-primary-tint"));
    const radio = label.querySelector('input[type="radio"]');
    if (radio && radio.checked) label.classList.add("border-primary", "bg-primary-tint");
  });
});

// Search filter (collateral)
const collateralSearch = document.getElementById("collateralSearch");
const collateralListEmpty = document.getElementById("collateralListEmpty");
if (collateralSearch) {
  collateralSearch.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".collateral-option").forEach((el) => {
      const match = !q || el.dataset.search.includes(q);
      el.classList.toggle("d-none", !match);
      if (match) visible++;
    });
    if (collateralListEmpty) collateralListEmpty.classList.toggle("d-none", visible !== 0);
  });
}

// ============================================================
// ลูกค้าเดิม / ลูกค้าใหม่
// ============================================================
const customerModeInput = document.getElementById("customerMode");
const customerModeExisting = document.getElementById("customerModeExisting");
const existingCustomerIdInput = document.getElementById("existingCustomerId");
const pickedCustomerInfo = document.getElementById("pickedCustomerInfo");

// avatar bg
document.querySelectorAll(".customer-avatar[data-bg]").forEach((el) => {
  el.style.background = el.dataset.bg;
  el.style.width = "40px";
  el.style.height = "40px";
  el.style.fontWeight = "600";
});

// customer field references for autofill / clear
const customerFields = {
  prefix: document.getElementById("namePrefix"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  idCard: document.getElementById("idCard"),
  dateOfbirth: document.getElementById("dateOfbirth"),
  age: document.getElementById("age"),
  phone: document.getElementById("phone"),
  email: document.getElementById("email"),
  address: document.getElementById("address"),
  occupation: document.getElementById("occupation"),
  companyName: document.getElementById("companyName"),
  companyAddress: document.getElementById("companyAddress"),
  income: document.getElementById("income"),
  incomeOther: document.getElementById("incomeOther"),
  debt: document.getElementById("debt")
};

function setVal(el, val) {
  if (!el) return;
  el.value = val == null ? "" : val;
  // notify select2 if jQuery + select2 are present
  if (window.jQuery && el.classList.contains("form-select")) {
    try {
      window.jQuery(el).trigger("change");
    } catch (e) {}
  }
}

// flatpickr-aware setter (สำหรับ #dateOfbirth)
function setDateVal(el, val) {
  if (!el) return;
  if (el._flatpickr) {
    el._flatpickr.setDate(val || "", true);
  } else {
    el.value = val == null ? "" : val;
  }
}

function stripComma(v) {
  return (v == null ? "" : v.toString()).replace(/,/g, "");
}

function clearCustomerFields() {
  setVal(customerFields.prefix, "");
  setVal(customerFields.firstName, "");
  setVal(customerFields.lastName, "");
  setVal(customerFields.idCard, "");
  setDateVal(customerFields.dateOfbirth, "");
  setVal(customerFields.age, "");
  setVal(customerFields.phone, "");
  setVal(customerFields.email, "");
  setVal(customerFields.address, "");
  setVal(customerFields.occupation, "");
  setVal(customerFields.companyName, "");
  setVal(customerFields.companyAddress, "");
  setVal(customerFields.income, "");
  setVal(customerFields.incomeOther, "");
  setVal(customerFields.debt, "");
}

function fillCustomer(cust) {
  // ใช้ firstName/lastName ตรง ๆ ถ้ามี ไม่งั้น fallback แยกจาก name
  let firstName = cust.firstName;
  let lastName = cust.lastName;
  if (!firstName && !lastName && cust.name) {
    let parts = cust.name.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  setVal(customerFields.prefix, cust.prefix || "");
  setVal(customerFields.firstName, firstName || "");
  setVal(customerFields.lastName, lastName || "");
  setVal(customerFields.idCard, cust.idCard || "");
  setDateVal(customerFields.dateOfbirth, cust.dateOfbirth || "");
  setVal(customerFields.phone, cust.phone || "");
  setVal(customerFields.email, cust.email || "");
  setVal(customerFields.address, cust.address || "");
  setVal(customerFields.occupation, cust.occupation || "");
  setVal(customerFields.companyName, cust.companyName || "");
  setVal(customerFields.companyAddress, cust.companyAddress || "");
  // income ฯลฯ มาเป็น "45,000" — strip commas สำหรับ number input
  setVal(customerFields.income, stripComma(cust.income));
  setVal(customerFields.incomeOther, stripComma(cust.incomeOther));
  setVal(customerFields.debt, stripComma(cust.debt));
}

// Tab switching
document.querySelectorAll("#customerModeTabs button[data-mode]").forEach((btn) => {
  btn.addEventListener("click", function () {
    const mode = this.dataset.mode;
    customerModeInput.value = mode;
    document.querySelectorAll("#customerModeTabs .nav-link").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    customerModeExisting.classList.toggle("d-none", mode !== "existing");

    if (mode === "new") {
      // clear selection + fields
      const checked = document.querySelector('input[name="pickCustomerId"]:checked');
      if (checked) checked.checked = false;
      existingCustomerIdInput.value = "";
      pickedCustomerInfo.classList.add("d-none");
      document.querySelectorAll(".customer-option").forEach((l) => l.classList.remove("border-primary", "bg-primary-tint"));
      clearCustomerFields();
    }
  });
});

// Pick existing customer → autofill
document.querySelectorAll('input[name="pickCustomerId"]').forEach((r) => {
  r.addEventListener("change", function () {
    const label = this.closest(".customer-option");
    if (!label) return;
    document.querySelectorAll(".customer-option").forEach((l) => l.classList.remove("border-primary", "bg-primary-tint"));
    label.classList.add("border-primary", "bg-primary-tint");

    let cust;
    try {
      cust = JSON.parse(label.dataset.customer);
    } catch (e) {
      cust = null;
    }
    if (cust) {
      existingCustomerIdInput.value = cust.id;
      fillCustomer(cust);
      pickedCustomerInfo.classList.remove("d-none");
    }
  });
});

// Customer search filter
const customerSearch = document.getElementById("customerSearch");
const customerListEmpty = document.getElementById("customerListEmpty");
if (customerSearch) {
  customerSearch.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".customer-option").forEach((el) => {
      const match = !q || el.dataset.search.includes(q);
      el.classList.toggle("d-none", !match);
      if (match) visible++;
    });
    if (customerListEmpty) customerListEmpty.classList.toggle("d-none", visible !== 0);
  });
}
$(document).on("click", "#btnCreate", function () {
  // ===== ข้อมูลโหมดลูกค้า =====
  let customerMode = $("#customerMode").val(); // "new" | "existing"
  let existingCustomerId = $("#existingCustomerId").val();

  // ===== ข้อมูลส่วนตัว =====
  let namePrefix = $("#namePrefix").val();
  if (!namePrefix || namePrefix.length === 0) {
    $("#namePrefix").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาเลือกคำนำหน้า",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  let firstName = $("#firstName").val();
  if (!firstName || firstName.trim().length === 0) {
    $("#firstName").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุชื่อจริง",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  let lastName = $("#lastName").val();
  if (!lastName || lastName.trim().length === 0) {
    $("#lastName").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุนามสกุล",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  let idCard = $("#idCard").val();
  if (!idCard || idCard.trim().length === 0) {
    $("#idCard").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุเลขบัตรประชาชน",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let idCardDigits = idCard.replace(/\D/g, "");
  if (idCardDigits.length !== 13) {
    $("#idCard").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  let dateOfbirth = $("#dateOfbirth").val();
  if (!dateOfbirth || dateOfbirth.trim().length === 0) {
    $("#dateOfbirth").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาเลือกวันเกิด",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let age = $("#age").val();

  let phone = $("#phone").val();
  if (!phone || phone.trim().length === 0) {
    $("#phone").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุเบอร์โทรศัพท์",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  // let phoneDigits = phone.replace(/\D/g, "");
  // if (phoneDigits.length < 9 || phoneDigits.length > 10) {
  //   $("#phone").focus();
  //   sweetAlert2Toast({
  //     icon: "warning",
  //     text: "เบอร์โทรศัพท์ไม่ถูกต้อง",
  //     confirmButtonClass: "btn btn-danger waves-effect waves-light"
  //   });
  //   return false;
  // }

  let email = $("#email").val();

  let address = $("#address").val();
  if (!address || address.trim().length === 0) {
    $("#address").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุที่อยู่ปัจจุบัน",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  // ===== การงาน / รายได้ =====
  let occupation = $("#occupation").val();
  if (!occupation || occupation.length === 0) {
    $("#occupation").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาเลือกอาชีพ",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let companyName = $("#companyName").val();
  let companyAddress = $("#companyAddress").val();

  let income = $("#income").val();
  if (!income || parseFloat(income) <= 0) {
    $("#income").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุรายได้ต่อเดือน",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let incomeOther = $("#incomeOther").val() || 0;
  let debt = $("#debt").val() || 0;

  // ===== รายละเอียดสินเชื่อ =====
  let loanType = $("#loanType").val();
  if (!loanType || loanType.length === 0) {
    $("#loanType").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาเลือกประเภทสินเชื่อ",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let purposeOfloan = $("#purposeOfloan").val();

  let loanAmount = $("#loanAmount").val();
  if (!loanAmount || parseFloat(loanAmount) <= 0) {
    $("#loanAmount").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาระบุวงเงินที่ต้องการ",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }

  let loanTerm = $("#loanTerm").val();
  if (!loanTerm || loanTerm.length === 0) {
    $("#loanTerm").focus();
    sweetAlert2Toast({
      icon: "warning",
      text: "กรุณาเลือกระยะเวลาผ่อน",
      confirmButtonClass: "btn btn-danger waves-effect waves-light"
    });
    return false;
  }
  let loanRate = $("#loanRate").val();

  // ===== หลักค้ำประกัน (เฉพาะตอน toggle เปิด) =====
  let hasCollateral = $("#hasCollateral").is(":checked");
  let collateralMode = null;
  let collateralType = null;
  let collateralValue = null;
  let existingCollateralId = null;

  if (hasCollateral) {
    collateralMode = $("#collateralMode").val();
    if (collateralMode === "new") {
      collateralType = $("#collateralType").val();
      if (!collateralType || collateralType.length === 0) {
        $("#collateralType").focus();
        sweetAlert2Toast({
          icon: "warning",
          text: "กรุณาเลือกประเภทหลักค้ำประกัน",
          confirmButtonClass: "btn btn-danger waves-effect waves-light"
        });
        return false;
      }
      collateralValue = $("#collateralValue").val();
      if (!collateralValue || parseFloat(collateralValue) <= 0) {
        $("#collateralValue").focus();
        sweetAlert2Toast({
          icon: "warning",
          text: "กรุณาระบุมูลค่าประเมินหลักค้ำประกัน",
          confirmButtonClass: "btn btn-danger waves-effect waves-light"
        });
        return false;
      }
    } else if (collateralMode === "existing") {
      existingCollateralId = $('input[name="existingCollateralId"]:checked').val();
      if (!existingCollateralId) {
        sweetAlert2Toast({
          icon: "warning",
          text: "กรุณาเลือกหลักประกันจากคลัง",
          confirmButtonClass: "btn btn-danger waves-effect waves-light"
        });
        return false;
      }
    }
  }
  sweetAlert2Loading();
  $.ajax({
    url: "/loan/create",
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      customerMode,
      existingCustomerId,
      namePrefix,
      firstName,
      lastName,
      idCard,
      dateOfbirth,
      age,
      phone,
      email,
      address,
      occupation,
      companyName,
      companyAddress,
      income,
      incomeOther,
      debt,
      loanType,
      purposeOfloan,
      loanAmount,
      loanTerm,
      loanRate,
      hasCollateral,
      collateralMode,
      collateralType,
      collateralValue,
      existingCollateralId
    }),
    success: function (response) {
      if (response.code == 0) {
        sweetAlert2Toast("success", response.message);
      } else {
        sweetAlert2Toast("warning", response.message);
      }
    },
    error: function () {
      sweetAlert2Toast("error", "ทำรายการไม่สำเร็จ");
    }
  });
});

$(document).on("change", "#dateOfbirth", function () {
  let val = $(this).val();
  let dob = parseFlexibleDate(val);
  $("#age").val(calcAgeFromDate(dob));
});
