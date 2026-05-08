function successCodeMessage({ code }) {
  let message = {
    0: "ทำรายการสำเร็จ",
    1: "แก้ไขข้อมูลสำเร็จ",
    2: "ลบข้อมูลสำเร็จ",
    3: "เพิ่มข้อมูลสำเร็จ",
    4: "เพิ่มข้อมูลไม่สำเร็จ",
    10: "success"
  };
  return message[code];
}
module.exports = {
  successCodeMessage
};
