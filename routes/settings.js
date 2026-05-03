var express = require('express');
var router = express.Router();

const settingsNav = [
  { key: 'general',       label: 'ทั่วไป',              icon: 'bi-building',         desc: 'ข้อมูลบริษัท ภาษา และรูปแบบ' },
  { key: 'loan-products', label: 'ประเภทสินเชื่อ',      icon: 'bi-file-earmark-text', desc: 'ดอกเบี้ย วงเงิน และระยะเวลา' },
  { key: 'fees',          label: 'ค่าธรรมเนียม & ค่าปรับ', icon: 'bi-cash-coin',        desc: 'ค่าปรับล่าช้าและค่าธรรมเนียม' },
  { key: 'channels',      label: 'ช่องทางการชำระ',      icon: 'bi-credit-card',       desc: 'เงินสด โอน QR และอัตโนมัติ' },
  { key: 'notifications', label: 'การแจ้งเตือน',        icon: 'bi-bell',              desc: 'SMS Email และเทมเพลตข้อความ' },
  { key: 'users',         label: 'ผู้ใช้งาน & สิทธิ์',    icon: 'bi-people',           desc: 'จัดการผู้ใช้ระบบและบทบาท' },
  { key: 'security',      label: 'ความปลอดภัย',         icon: 'bi-shield-lock',       desc: 'รหัสผ่านและการเข้าใช้งาน' },
  { key: 'system',        label: 'ระบบ & เอกสาร',       icon: 'bi-gear',              desc: 'เลขเอกสาร สำรองข้อมูล' },
];

const company = {
  name: 'บริษัท ลีนโปร แคปปิตอล จำกัด',
  taxId: '0105563012345',
  address: '88 อาคารแสงโชค ชั้น 12 ถ.สีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500',
  phone: '02-123-4567',
  email: 'contact@loanpro.co.th',
  website: 'www.loanpro.co.th',
  language: 'th',
  timezone: 'Asia/Bangkok',
  dateFormat: 'DD/MM/YYYY (พ.ศ.)',
  currency: 'THB',
};

const loanProducts = [
  { code: 'PER', name: 'สินเชื่อบุคคล',  rateMin: 7.5, rateMax: 24,   amountMin: 10_000,  amountMax: 500_000,    termMin: 6,  termMax: 60,  active: true },
  { code: 'BIZ', name: 'สินเชื่อธุรกิจ', rateMin: 5.5, rateMax: 9.5,  amountMin: 100_000, amountMax: 10_000_000, termMin: 12, termMax: 84,  active: true },
  { code: 'HOM', name: 'สินเชื่อบ้าน',   rateMin: 3.5, rateMax: 6.0,  amountMin: 500_000, amountMax: 20_000_000, termMin: 60, termMax: 360, active: true },
  { code: 'CAR', name: 'สินเชื่อรถยนต์', rateMin: 4.5, rateMax: 8.0,  amountMin: 50_000,  amountMax: 3_000_000,  termMin: 12, termMax: 84,  active: true },
  { code: 'GLD', name: 'สินเชื่อจำนำทอง', rateMin: 1.0, rateMax: 1.5,  amountMin: 5_000,   amountMax: 1_000_000,  termMin: 1,  termMax: 12,  active: false },
];

const fees = {
  openFeePct: 1.0,
  openFeeMin: 500,
  prepaymentFeePct: 2.0,
  latePenaltyPctPerDay: 0.10,
  graceDays: 7,
  bouncedChequeFee: 200,
  documentReissueFee: 100,
  earlyClosureFee: 1500,
};

const channels = [
  { key: 'cash',     name: 'เงินสด',                 icon: 'bi-cash',          enabled: true,  fee: 0 },
  { key: 'transfer', name: 'โอนเงิน / PromptPay',    icon: 'bi-bank',          enabled: true,  fee: 0 },
  { key: 'qr',       name: 'QR Code (Thai QR)',      icon: 'bi-qr-code',       enabled: true,  fee: 0 },
  { key: 'atm',      name: 'ATM / CDM',              icon: 'bi-credit-card',   enabled: true,  fee: 10 },
  { key: 'auto',     name: 'หักบัญชีอัตโนมัติ',       icon: 'bi-arrow-repeat',  enabled: true,  fee: 0 },
  { key: 'card',     name: 'บัตรเครดิต / เดบิต',      icon: 'bi-credit-card-2-back', enabled: false, fee: 1.5 },
  { key: 'wallet',   name: 'TrueMoney / Rabbit LINE Pay', icon: 'bi-wallet2',  enabled: false, fee: 0 },
];

const bankAccount = {
  bank: 'ธนาคารไทยพาณิชย์',
  accountName: 'บจ. ลีนโปร แคปปิตอล',
  accountNo: '123-4-56789-0',
  branch: 'สีลม',
};

const notifications = {
  reminderDaysBefore: [7, 3, 1],
  overdueDaysAfter: [1, 7, 15, 30],
  channels: { sms: true, email: true, line: false, push: true },
  templates: {
    reminder: 'เรียน คุณ{ชื่อผู้กู้} สัญญาเลขที่ {เลขสัญญา} ครบกำหนดชำระ {วันที่} จำนวน {ยอดเงิน} บาท ขอบคุณครับ',
    overdue:  'เรียน คุณ{ชื่อผู้กู้} สัญญาเลขที่ {เลขสัญญา} ค้างชำระมา {จำนวนวัน} วัน กรุณาติดต่อชำระภายในวันที่ {วันที่}',
    receipt:  'ใบเสร็จเลขที่ {เลขใบเสร็จ} จำนวน {ยอดเงิน} บาท ของคุณ {ชื่อผู้กู้} ได้รับการบันทึกเรียบร้อยแล้ว',
  },
};

const users = [
  { id: 1, name: 'อดิสรรณ์ จันทร์ดี',    email: 'admin@loanpro.co.th',     role: 'ผู้ดูแลระบบ',  status: 'active',  lastLogin: '03/05/2569 09:42', avatar: 'อด', color: '#3b82f6' },
  { id: 2, name: 'สุชาติ หัวหน้าสินเชื่อ', email: 'suchat@loanpro.co.th',   role: 'หัวหน้าสินเชื่อ', status: 'active',  lastLogin: '02/05/2569 16:20', avatar: 'สช', color: '#10b981' },
  { id: 3, name: 'นภัสรา เก็บเงิน',      email: 'napatsara@loanpro.co.th', role: 'พนักงานเก็บเงิน', status: 'active',  lastLogin: '03/05/2569 08:15', avatar: 'นภ', color: '#8b5cf6' },
  { id: 4, name: 'พิชัย ตรวจสอบ',        email: 'pichai@loanpro.co.th',    role: 'ผู้ตรวจสอบ',     status: 'active',  lastLogin: '01/05/2569 11:30', avatar: 'พช', color: '#f59e0b' },
  { id: 5, name: 'มาลี รับโทรศัพท์',     email: 'malee@loanpro.co.th',     role: 'พนักงานทั่วไป',  status: 'inactive',lastLogin: '15/04/2569 14:50', avatar: 'มล', color: '#6b7280' },
];

const roles = [
  { name: 'ผู้ดูแลระบบ',     desc: 'เข้าถึงทุกฟังก์ชัน + ตั้งค่าระบบ', count: 1, color: '#3b82f6' },
  { name: 'หัวหน้าสินเชื่อ',   desc: 'อนุมัติสินเชื่อและดูรายงานทั้งหมด', count: 2, color: '#10b981' },
  { name: 'พนักงานเก็บเงิน',   desc: 'บันทึกการชำระและออกใบเสร็จ',      count: 4, color: '#8b5cf6' },
  { name: 'ผู้ตรวจสอบ',       desc: 'ดูได้อย่างเดียว ไม่สามารถแก้ไข',    count: 1, color: '#f59e0b' },
  { name: 'พนักงานทั่วไป',     desc: 'จัดการข้อมูลลูกค้าและคำขอสินเชื่อ', count: 3, color: '#6b7280' },
];

const security = {
  passwordMinLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSymbol: true,
  passwordExpireDays: 90,
  twoFactorEnabled: true,
  sessionTimeoutMin: 30,
  loginAttempts: 5,
  ipWhitelist: '',
};

const recentLogins = [
  { user: 'อดิสรรณ์ จันทร์ดี',    ip: '203.150.21.45', device: 'Chrome / macOS',   when: '03/05/2569 09:42', status: 'success' },
  { user: 'นภัสรา เก็บเงิน',      ip: '110.49.233.12', device: 'Chrome / Windows', when: '03/05/2569 08:15', status: 'success' },
  { user: 'unknown@test.com',    ip: '45.142.78.90',  device: 'Firefox / Linux',  when: '02/05/2569 23:18', status: 'failed'  },
  { user: 'สุชาติ หัวหน้าสินเชื่อ', ip: '171.99.102.4',  device: 'Safari / iOS',     when: '02/05/2569 16:20', status: 'success' },
];

const system = {
  loanPrefix: 'LN',
  loanFormat: '{PREFIX}-{YYYY}-{####}',
  receiptPrefix: 'RCP',
  receiptFormat: '{PREFIX}-{YYYY}-{####}',
  customerPrefix: 'CUS',
  collateralPrefix: 'COL',
  fiscalYearStart: 'ม.ค.',
  autoBackup: true,
  backupTime: '02:00',
  backupRetentionDays: 30,
  lastBackup: '02/05/2569 02:00',
  storageUsed: 1.2,
  storageQuota: 10,
};

router.get('/', function(req, res) {
  res.redirect('/settings/general');
});

function render(section, extra) {
  return function(req, res) {
    const item = settingsNav.find(s => s.key === section) || settingsNav[0];
    res.render('settings/' + section, Object.assign({
      title: 'ตั้งค่า — ' + item.label,
      settingsNav,
      activeSection: section,
      sectionLabel: item.label,
      saved: req.query.saved === '1',
    }, extra));
  };
}

router.get('/general',       render('general',       { company }));
router.get('/loan-products', render('loan-products', { loanProducts }));
router.get('/fees',          render('fees',          { fees }));
router.get('/channels',      render('channels',      { channels, bankAccount }));
router.get('/notifications', render('notifications', { notifications }));
router.get('/users',         render('users',         { users, roles }));
router.get('/security',      render('security',      { security, recentLogins }));
router.get('/system',        render('system',        { system }));

[ 'general','loan-products','fees','channels','notifications','users','security','system' ].forEach(s => {
  router.post('/' + s, function(req, res) {
    res.redirect('/settings/' + s + '?saved=1');
  });
});

module.exports = router;
