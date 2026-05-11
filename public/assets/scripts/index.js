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
