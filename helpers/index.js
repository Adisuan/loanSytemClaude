const uniqid = require("uniqid");
const chance = require("chance").Chance();
const moment = require("moment");

function isValidPassword(str) {
  const allowedChars = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
  return allowedChars.test(str);
}
function generateCode() {
  return `${uniqid.time()}${chance.integer({ min: 100, max: 999 })}`;
}
function isValidUsername(username) {
  return /^[a-zA-Z0-9]+$/.test(username);
}
function hasEng(text) {
  return /[a-zA-Z]/.test(text);
}
function isBetweenTime({ start, end }) {
  let now = moment();
  let startTime = moment(start, "HH:mm");
  let endTime = moment(end, "HH:mm");
  // กรณีคร่อมเที่ยงคืน
  if (endTime.isBefore(startTime)) {
    // end เป็นของวันถัดไป
    endTime.add(1, "day");
    // ถ้าเวลาปัจจุบันเลย start ไปแล้ว ให้ถือว่าอยู่วันเดียวกัน
    if (now.isBefore(startTime)) {
      now.add(1, "day");
    }
  }
  return now.isBetween(startTime, endTime, null, "[]"); // รวม start + end
}
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = {
  isValidPassword,
  isValidUsername,
  generateCode,
  hasEng,
  isBetweenTime,
  shuffleArray
};
