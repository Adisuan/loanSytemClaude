var express = require('express');
var router = express.Router();
const { mockCollaterals, collateralTypes } = require('../data/collaterals');

function fmt(n, d) {
  const dec = d == null ? 2 : d;
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtInt(n) { return Number(n).toLocaleString('th-TH'); }

const reportList = [
  {
    key: 'summary',
    title: 'สรุปสินเชื่อ',
    desc: 'ภาพรวมพอร์ตสินเชื่อ ยอดอนุมัติ ยอดคงเหลือ และแนวโน้มรายเดือน',
    icon: 'bi-bar-chart-line-fill', color: '#3b82f6',
    href: '/reports/summary', tag: 'การเงิน',
  },
  {
    key: 'revenue',
    title: 'รายรับ',
    desc: 'ยอดเงินที่จัดเก็บได้ แยกตามประเภทสินเชื่อ ช่องทางการชำระ และเดือน',
    icon: 'bi-cash-stack', color: '#10b981',
    href: '/reports/revenue', tag: 'การเงิน',
  },
  {
    key: 'overdue',
    title: 'หนี้ค้างชำระ',
    desc: 'รายงานยอดค้างชำระแยกตามอายุหนี้ (Aging) 1-30, 31-60, 61-90, 90+ วัน',
    icon: 'bi-exclamation-triangle-fill', color: '#ef4444',
    href: '/reports/overdue', tag: 'การเงิน',
  },
  {
    key: 'portfolio',
    title: 'พอร์ตสินเชื่อ',
    desc: 'การกระจายตัวของสินเชื่อ แยกตามประเภท สถานะ และผู้กู้รายใหญ่',
    icon: 'bi-pie-chart-fill', color: '#8b5cf6',
    href: '/reports/portfolio', tag: 'พอร์ต',
  },
  {
    key: 'collateral',
    title: 'หลักประกัน',
    desc: 'มูลค่าหลักประกันรวม แยกตามประเภท สถานะ และอัตราส่วนค้ำประกัน',
    icon: 'bi-shield-fill-check', color: '#f59e0b',
    href: '/reports/collateral', tag: 'พอร์ต',
  },
  {
    key: 'customer',
    title: 'ลูกค้า',
    desc: 'จำนวนลูกค้าใหม่ ลูกค้าที่มีสัญญาหลายฉบับ และอันดับยอดสินเชื่อ',
    icon: 'bi-people-fill', color: '#06b6d4',
    href: '/reports/customer', tag: 'ลูกค้า',
  },
];

router.get('/', function(req, res) {
  res.render('reports/index', {
    title: 'รายงาน',
    reportList,
  });
});

// ---------- รายงานสรุปสินเชื่อ ----------
router.get('/summary', function(req, res) {
  const kpi = {
    totalLoans: 1248,
    totalAmount: 248_500_000,
    outstanding: 168_320_500,
    avgRate: 6.8,
    newThisMonth: 42,
    closedThisMonth: 18,
  };

  const monthly = [
    { month: 'พ.ย. 67', newLoans: 28, amount: 4_200_000 },
    { month: 'ธ.ค. 67', newLoans: 35, amount: 5_800_000 },
    { month: 'ม.ค. 68', newLoans: 41, amount: 6_500_000 },
    { month: 'ก.พ. 68', newLoans: 38, amount: 7_100_000 },
    { month: 'มี.ค. 68', newLoans: 45, amount: 8_300_000 },
    { month: 'เม.ย. 68', newLoans: 42, amount: 9_600_000 },
  ];

  const byType = [
    { type: 'สินเชื่อบุคคล',  count: 599, amount: 89_000_000, color: '#3b82f6' },
    { type: 'สินเชื่อธุรกิจ', count: 374, amount: 95_500_000, color: '#10b981' },
    { type: 'สินเชื่อบ้าน',   count: 200, amount: 52_000_000, color: '#8b5cf6' },
    { type: 'สินเชื่อรถยนต์', count: 75,  amount: 12_000_000, color: '#f59e0b' },
  ];

  const byStatus = [
    { status: 'อนุมัติ',  count: 892, color: '#10b981' },
    { status: 'รออนุมัติ', count: 143, color: '#f59e0b' },
    { status: 'ปฏิเสธ',   count: 89,  color: '#ef4444' },
    { status: 'ปิดบัญชี',  count: 124, color: '#6b7280' },
  ];

  res.render('reports/summary', {
    title: 'รายงานสรุปสินเชื่อ',
    kpi, monthly, byType, byStatus,
    fmt, fmtInt,
  });
});

// ---------- รายงานรายรับ ----------
router.get('/revenue', function(req, res) {
  const kpi = {
    totalCollected: 12_540_300,
    thisMonth: 2_180_500,
    interestIncome: 3_640_200,
    penaltyIncome: 84_500,
    growth: 8.4,
  };

  const monthly = [
    { month: 'พ.ย. 67', principal: 1_350_000, interest: 480_000, penalty: 12_000 },
    { month: 'ธ.ค. 67', principal: 1_480_000, interest: 510_000, penalty: 9_000  },
    { month: 'ม.ค. 68', principal: 1_620_000, interest: 540_000, penalty: 14_500 },
    { month: 'ก.พ. 68', principal: 1_710_000, interest: 580_000, penalty: 11_000 },
    { month: 'มี.ค. 68', principal: 1_840_000, interest: 620_000, penalty: 15_000 },
    { month: 'เม.ย. 68', principal: 1_590_000, interest: 580_000, penalty: 23_000 },
  ];

  const byChannel = [
    { channel: 'โอนเงิน / PromptPay',   amount: 5_280_000, count: 412, color: '#3b82f6', icon: 'bi-bank' },
    { channel: 'หักบัญชีอัตโนมัติ',     amount: 4_100_500, count: 256, color: '#10b981', icon: 'bi-arrow-repeat' },
    { channel: 'QR Code',              amount: 1_640_000, count: 198, color: '#8b5cf6', icon: 'bi-qr-code' },
    { channel: 'เงินสด',                amount: 920_800,   count: 142, color: '#f59e0b', icon: 'bi-cash' },
    { channel: 'ATM',                  amount: 599_000,   count: 64,  color: '#06b6d4', icon: 'bi-credit-card' },
  ];

  const byLoanType = [
    { type: 'สินเชื่อบุคคล',  amount: 4_820_000, color: '#3b82f6' },
    { type: 'สินเชื่อธุรกิจ', amount: 4_280_000, color: '#10b981' },
    { type: 'สินเชื่อบ้าน',   amount: 2_640_300, color: '#8b5cf6' },
    { type: 'สินเชื่อรถยนต์', amount: 800_000,   color: '#f59e0b' },
  ];

  res.render('reports/revenue', {
    title: 'รายงานรายรับ',
    kpi, monthly, byChannel, byLoanType,
    fmt, fmtInt,
  });
});

// ---------- รายงานหนี้ค้างชำระ ----------
router.get('/overdue', function(req, res) {
  const kpi = {
    totalOverdue: 4_185_600,
    accounts: 38,
    nplRatio: 2.49,
    oldestDays: 142,
  };

  const aging = [
    { bucket: '1-30 วัน',  range: '1-30',   count: 18, amount: 980_500,   color: '#facc15' },
    { bucket: '31-60 วัน', range: '31-60',  count: 9,  amount: 1_240_300, color: '#fb923c' },
    { bucket: '61-90 วัน', range: '61-90',  count: 6,  amount: 1_125_800, color: '#f97316' },
    { bucket: '90+ วัน',   range: '90+',    count: 5,  amount: 839_000,   color: '#ef4444' },
  ];

  const accounts = [
    { loanId:'LN-2025-0005', name:'อนันต์ พรมมา',    type:'สินเชื่อบุคคล',  amount: 4_876.50,  days: 37, bucket: '31-60', phone:'085-678-9012', color:'#ef4444' },
    { loanId:'LN-2025-0009', name:'ดารณี พัฒนา',     type:'สินเชื่อบุคคล',  amount: 8_200.00,  days: 22, bucket: '1-30',  phone:'089-123-4567', color:'#06b6d4' },
    { loanId:'LN-2025-0012', name:'ชาญชัย วงษ์ดี',   type:'สินเชื่อธุรกิจ', amount: 12_450.00, days: 15, bucket: '1-30',  phone:'081-234-9876', color:'#10b981' },
    { loanId:'LN-2025-0018', name:'พิมพ์ใจ สดใส',    type:'สินเชื่อรถยนต์', amount: 9_680.00,  days: 68, bucket: '61-90', phone:'084-555-1212', color:'#f59e0b' },
    { loanId:'LN-2025-0022', name:'วรพล กิจเจริญ',   type:'สินเชื่อธุรกิจ', amount: 28_500.00, days: 92, bucket: '90+',   phone:'086-444-3322', color:'#8b5cf6' },
    { loanId:'LN-2025-0027', name:'สุนิสา ทองอินทร์', type:'สินเชื่อบุคคล',  amount: 5_400.00,  days: 45, bucket: '31-60', phone:'083-777-9988', color:'#0ea5e9' },
    { loanId:'LN-2025-0031', name:'อรุณ ฤทธิ์รุ่งโรจน์', type:'สินเชื่อบ้าน', amount: 18_750.00,days: 142,bucket: '90+',   phone:'088-321-6543', color:'#d946ef' },
    { loanId:'LN-2025-0034', name:'ทรงศักดิ์ พงษ์เพ็ชร', type:'สินเชื่อธุรกิจ', amount: 22_100.00, days: 12, bucket: '1-30', phone:'087-666-2233', color:'#3b82f6' },
  ];

  res.render('reports/overdue', {
    title: 'รายงานหนี้ค้างชำระ',
    kpi, aging, accounts,
    fmt, fmtInt,
  });
});

// ---------- รายงานพอร์ตสินเชื่อ ----------
router.get('/portfolio', function(req, res) {
  const kpi = {
    totalPortfolio: 248_500_000,
    activeLoans: 892,
    avgTicket: 278_587,
    avgTerm: 48,
  };

  const byType = [
    { type: 'สินเชื่อบุคคล',  count: 599, amount: 89_000_000, share: 35.8, color: '#3b82f6' },
    { type: 'สินเชื่อธุรกิจ', count: 374, amount: 95_500_000, share: 38.4, color: '#10b981' },
    { type: 'สินเชื่อบ้าน',   count: 200, amount: 52_000_000, share: 20.9, color: '#8b5cf6' },
    { type: 'สินเชื่อรถยนต์', count: 75,  amount: 12_000_000, share: 4.9,  color: '#f59e0b' },
  ];

  const byStatus = [
    { status: 'ปกติ',         count: 854, amount: 230_400_000, color: '#10b981' },
    { status: 'ค้างชำระ',     count: 38,  amount: 4_185_600,   color: '#ef4444' },
    { status: 'ปรับโครงสร้าง', count: 6,   amount: 1_240_000,   color: '#f59e0b' },
    { status: 'ปิดบัญชี',      count: 124, amount: 12_674_400,  color: '#6b7280' },
  ];

  const topBorrowers = [
    { name:'บริษัท แสงทอง พัฒนา จำกัด', type:'สินเชื่อธุรกิจ', amount: 8_500_000, loans: 2, color:'#10b981' },
    { name:'พัชรา เจริญสุข',            type:'สินเชื่อบ้าน',   amount: 3_200_000, loans: 1, color:'#d946ef' },
    { name:'นิรันดร์ ทองคำ',             type:'สินเชื่อธุรกิจ', amount: 1_200_000, loans: 1, color:'#0ea5e9' },
    { name:'วิไล มีทอง',                 type:'สินเชื่อบ้าน',   amount: 2_500_000, loans: 1, color:'#8b5cf6' },
    { name:'ประเสริฐ สุขสม',             type:'สินเชื่อธุรกิจ', amount: 800_000,   loans: 1, color:'#10b981' },
  ];

  res.render('reports/portfolio', {
    title: 'รายงานพอร์ตสินเชื่อ',
    kpi, byType, byStatus, topBorrowers,
    fmt, fmtInt,
  });
});

// ---------- รายงานหลักประกัน ----------
router.get('/collateral', function(req, res) {
  const totalValue = mockCollaterals.reduce((s, c) => s + Number(String(c.estimatedValue).replace(/,/g,'')), 0);
  const inUse = mockCollaterals.filter(c => c.status === 'ใช้ค้ำอยู่');
  const free = mockCollaterals.filter(c => c.status === 'ว่าง');
  const released = mockCollaterals.filter(c => c.status === 'ปลดแล้ว');

  const inUseValue = inUse.reduce((s, c) => s + Number(String(c.estimatedValue).replace(/,/g,'')), 0);
  const outstanding = 168_320_500;

  const kpi = {
    totalCount: mockCollaterals.length,
    totalValue,
    inUseValue,
    coverage: outstanding > 0 ? (inUseValue / outstanding * 100) : 0,
  };

  const byType = collateralTypes.map(t => {
    const items = mockCollaterals.filter(c => c.type === t.value);
    const value = items.reduce((s,c)=>s+Number(String(c.estimatedValue).replace(/,/g,'')),0);
    return { type: t.value, icon: t.icon, color: t.color, count: items.length, value };
  }).filter(x => x.count > 0);

  const byStatus = [
    { status: 'ใช้ค้ำอยู่', count: inUse.length,    value: inUseValue, color: '#3b82f6' },
    { status: 'ว่าง',        count: free.length,    value: free.reduce((s,c)=>s+Number(String(c.estimatedValue).replace(/,/g,'')),0), color: '#10b981' },
    { status: 'ปลดแล้ว',     count: released.length, value: released.reduce((s,c)=>s+Number(String(c.estimatedValue).replace(/,/g,'')),0), color: '#6b7280' },
  ];

  res.render('reports/collateral', {
    title: 'รายงานหลักประกัน',
    kpi, byType, byStatus, items: mockCollaterals,
    fmt, fmtInt,
  });
});

// ---------- รายงานลูกค้า ----------
router.get('/customer', function(req, res) {
  const kpi = {
    totalCustomers: 936,
    newThisMonth: 28,
    multiContract: 142,
    avgLoanPerCustomer: 1.33,
  };

  const monthly = [
    { month: 'พ.ย. 67', newCustomers: 18 },
    { month: 'ธ.ค. 67', newCustomers: 22 },
    { month: 'ม.ค. 68', newCustomers: 25 },
    { month: 'ก.พ. 68', newCustomers: 31 },
    { month: 'มี.ค. 68', newCustomers: 26 },
    { month: 'เม.ย. 68', newCustomers: 28 },
  ];

  const ageGroups = [
    { group: '20-30 ปี', count: 184, color: '#3b82f6' },
    { group: '31-40 ปี', count: 312, color: '#10b981' },
    { group: '41-50 ปี', count: 248, color: '#8b5cf6' },
    { group: '51-60 ปี', count: 142, color: '#f59e0b' },
    { group: '60+ ปี',   count: 50,  color: '#6b7280' },
  ];

  res.render('reports/customer', {
    title: 'รายงานลูกค้า',
    kpi, monthly, ageGroups,
    fmt, fmtInt,
  });
});

module.exports = router;
