function error(code, text, text2) {
  const errorCode = {
    100: "ข้อมูลไม่ถูกต้อง",
    412: "ทำรายการไม่สำเร็จ",

    413: "ไม่พบข้อมูล",
    429: "Too Many Requests",

    500: "ระบบไม่พร้อมใช้งาน",
    // 501: "ทำรายการไม่สำเร็จ",

    1600: `` //custom
  };
  let message = errorCode[code];
  if (text) {
    message = `${message}${text}`;
  }
  return {
    code,
    message,
    error: true
  };
}

module.exports = error;
