let allowCloseNotification = true;
const TIME_RELOAD_TABLE = 5000 * 60;
const CONFIG = {
  DATA_TABLE_LANGUAGE: {
    decimal: "",
    emptyTable: "ไม่พบข้อมูล",
    info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
    infoEmpty: "แสดง 0 ถึง 0 จาก 0 รายการ",
    infoFiltered: "(ค้นหา จากทั้งหมด _MAX_ รายการ )",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "แสดง _MENU_ รายการ",
    loadingRecords: "Loading...",
    processing: "กำลังค้นหาข้อมูล...",
    search: "ค้นหา:",
    zeroRecords: "ไม่พบข้อมูล",
    paginate: {
      first: "หน้าแรก",
      last: "หน้าสุดท้าย",
      next: "ถัดไป",
      previous: "ย้อนกลับ"
    },
    aria: {
      sortAscending: ": activate to sort column ascending",
      sortDescending: ": activate to sort column descending"
    }
  },
  WITHDRAW_AUTO_STATUS: {
    processing: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังทำรายการ"
    },
    input_pin: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังระบุรหัส"
    },
    select_bank: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังเลือกธนาคาร"
    },
    input_account_number: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังระบุเลขบัญชี"
    },
    input_amount: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังระบุจำนวนเงิน"
    },
    confirm: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto กำลังยืนยันรายการ"
    },
    insufficient_funds: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto ยอดเงินไม่เพียงพอ"
    },
    account_invalid: {
      class: "badge bg-danger bg-opacity-10 text-danger rounded-3 ms-1",
      text: "Auto บัญชีไม่ถูกต้อง"
    },
    completed: {
      class: "badge bg-warning bg-opacity-10 text-warning rounded-3 ms-1",
      text: "Auto"
    },
    error: {
      class: "badge bg-danger bg-opacity-10 text-danger rounded-3 ms-1",
      text: "Auto เกิดข้อผิดพลาด"
    }
  },
  CREDIT_TRANSACTION_GROUPS: ["affiliate", "checkIn", "commission", "commissionEvent", "coupon", "refund", "wheelOfFortune", "store"]
};
const AVATAR_PALETTE = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6b7280", "#0ea5e9", "#d946ef"];
const SIDEBAR_COLLAPSED_KEY = "sidebarCollapsed";
function initSelect2({ select, modal, placeholder }) {
  let init = {
    theme: "bootstrap-5",
    // minimumResultsForSearch: Infinity,
    language: "th",
    width: "100%"
  };
  if (modal) {
    init.dropdownParent = $(modal);
  }
  if (placeholder) {
    init.placeholder = placeholder;
  }
  $(select).select2(init);
}
function sweetAlert2Loading() {
  (Swal.fire({
    // title: "แจ้งเตือน",
    text: "กรุณารอสักครู่..",
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: "",
    scrollbarPadding: false
  }),
    Swal.showLoading());
}
function sweetAlert2({ icon, text, confirmButtonClass, color }) {
  allowCloseNotification = false;
  // btn btn-danger waves-effect waves-light
  let swalConfig = {
    icon,
    // title: 'แจ้งเตือน',
    text: text,
    allowOutsideClick: false,
    confirmButtonText: "ตกลง",
    // confirmButtonColor: color ? color : '#dc3545',
    customClass: {
      confirmButton: "btn btn-danger waves-effect waves-light"
    },
    scrollbarPadding: false
  };
  if (confirmButtonClass) {
    swalConfig.customClass.confirmButton = confirmButtonClass;
  }
  Swal.fire(swalConfig).then(() => {
    allowCloseNotification = true;
  });
}
function sweetAlert2Toast({ icon, text }) {
  allowCloseNotification = false;
  let Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    width: "auto"
  });
  Toast.fire({
    icon: icon,
    title: text
  }).then(() => {
    allowCloseNotification = true;
  });
}
// แปลง string วันที่จาก flatpickr (Y-m-d) หรือฟอร์แมตอื่นเป็น Date object
// รองรับ พ.ศ. (year > 2400 → ลบ 543)
function parseFlexibleDate(str) {
  if (!str) return null;
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    let year = parseInt(m[1], 10);
    let month = parseInt(m[2], 10) - 1;
    let day = parseInt(m[3], 10);
    if (year > 2400) year -= 543;
    return new Date(year, month, day);
  }
  m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    let day = parseInt(m[1], 10);
    let month = parseInt(m[2], 10) - 1;
    let year = parseInt(m[3], 10);
    if (year > 2400) year -= 543;
    return new Date(year, month, day);
  }
  let d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function calcAgeFromDate(dob) {
  if (!dob) return "";
  let today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  let mDiff = today.getMonth() - dob.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age == -1) {
    age = 0;
  }
  return age >= 0 ? age : "";
}
$(document).on("keypress", ".number", function (e) {
  let key = e.which || e.keyCode;
  let char = String.fromCharCode(key);

  // อนุญาตเฉพาะ 0-9 และจุด
  if (/^[0-9.]$/.test(char)) {
    // ป้องกันพิมพ์จุดมากกว่า 1 จุด
    if (char === "." && $(this).val().includes(".")) {
      return false;
    }
    return true;
  }
  return false;
});
