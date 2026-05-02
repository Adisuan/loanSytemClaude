var express = require('express');
var router = express.Router();
const { mockCollaterals, collateralTypes } = require('../data/collaterals');

const mockLoans = [
  { id:'LN-2025-0001', name:'สมชาย ใจดี',      phone:'081-234-5678', type:'สินเชื่อบุคคล',  amount:'150,000',   rate:7.5,  term:36, paidInstallments:12, status:'อนุมัติ',   color:'#3b82f6', date:'01/04/2568' },
  { id:'LN-2025-0002', name:'วิไล มีทอง',      phone:'082-345-6789', type:'สินเชื่อบ้าน',   amount:'2,500,000', rate:4.5,  term:240,paidInstallments:8,  status:'รออนุมัติ', color:'#8b5cf6', date:'02/04/2568' },
  { id:'LN-2025-0003', name:'ประเสริฐ สุขสม',   phone:'083-456-7890', type:'สินเชื่อธุรกิจ', amount:'800,000',   rate:6.5,  term:60, paidInstallments:20, status:'อนุมัติ',   color:'#10b981', date:'03/04/2568' },
  { id:'LN-2025-0004', name:'มาลี รักเรียน',    phone:'084-567-8901', type:'สินเชื่อรถยนต์', amount:'450,000',   rate:5.9,  term:60, paidInstallments:0,  status:'ปฏิเสธ',   color:'#f59e0b', date:'05/04/2568' },
  { id:'LN-2025-0005', name:'อนันต์ พรมมา',    phone:'085-678-9012', type:'สินเชื่อบุคคล',  amount:'200,000',   rate:8.0,  term:48, paidInstallments:3,  status:'รออนุมัติ', color:'#ef4444', date:'06/04/2568' },
  { id:'LN-2025-0006', name:'จิรา สว่างใจ',    phone:'086-789-0123', type:'สินเชื่อบุคคล',  amount:'80,000',    rate:9.0,  term:24, paidInstallments:24, status:'ปิดบัญชี',  color:'#6b7280', date:'01/01/2568' },
  { id:'LN-2025-0007', name:'นิรันดร์ ทองคำ',   phone:'087-890-1234', type:'สินเชื่อธุรกิจ', amount:'1,200,000', rate:6.0,  term:60, paidInstallments:15, status:'อนุมัติ',   color:'#0ea5e9', date:'10/03/2568' },
  { id:'LN-2025-0008', name:'พัชรา เจริญสุข',   phone:'088-901-2345', type:'สินเชื่อบ้าน',   amount:'3,200,000', rate:3.99, term:300,paidInstallments:2,  status:'อนุมัติ',   color:'#d946ef', date:'15/04/2568' },
];

router.get('/', function(req, res) {
  res.render('loans/index', { title: 'รายการสินเชื่อ', allLoans: mockLoans });
});

router.get('/apply', function(req, res) {
  const availableCollaterals = mockCollaterals.filter(c => c.status === 'ว่าง');
  res.render('loans/apply', {
    title: 'ยื่นขอสินเชื่อ',
    availableCollaterals,
    collateralTypes,
  });
});

router.post('/apply', function(req, res) {
  res.redirect('/loans');
});

router.get('/:id', function(req, res) {
  const loan = mockLoans.find(l => l.id === req.params.id) || mockLoans[0];

  const P = 150000, r = 7.5 / 100 / 12, n = 36;
  const M = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  const totalPayment = M * n;
  const totalInterest = totalPayment - P;

  function fmt(v) { return v.toLocaleString('th-TH', { minimumFractionDigits:2, maximumFractionDigits:2 }); }

  const schedule = [];
  let balance = P;
  for (let i = 1; i <= n; i++) {
    const interestAmt = balance * r;
    const principalAmt = M - interestAmt;
    balance -= principalAmt;
    const month = new Date(2025, 3 + i, 1);
    const thMonth = month.toLocaleDateString('th-TH', { day:'2-digit', month:'2-digit', year:'numeric' });
    schedule.push({
      no: i, dueDate: thMonth,
      principal: fmt(principalAmt),
      interest: fmt(interestAmt),
      payment: fmt(M),
      balance: fmt(Math.max(0, balance)),
      status: i <= 12 ? 'ชำระแล้ว' : i === 13 ? 'ค้างชำระ' : 'รอชำระ'
    });
  }

  res.render('loans/detail', {
    title: loan.id,
    loan: {
      ...loan,
      email: 'somchai@email.com',
      address: '123/45 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110',
      idCard: '1-1020-12345-67-8',
      occupation: 'พนักงานเอกชน',
      income: '45,000',
      monthly: fmt(M),
      totalInterest: fmt(totalInterest),
      totalPayment: fmt(totalPayment),
      startDate: '01/05/2568',
      endDate: '01/04/2571',
    },
    schedule,
    timeline: [
      { title:'อนุมัติสินเชื่อ',       desc:'อนุมัติโดย นายสุชาติ หัวหน้าสินเชื่อ', date:'05/04/2568', color:'#10b981' },
      { title:'ตรวจสอบเอกสารแล้ว',     desc:'เอกสารครบถ้วน ผ่านการตรวจสอบ',         date:'03/04/2568', color:'#3b82f6' },
      { title:'รับคำขอสินเชื่อ',       desc:'รับใบคำขอและเอกสารประกอบครบ',           date:'01/04/2568', color:'#6b7280' },
    ],
    documents: [
      { name:'บัตรประชาชน.pdf',      size:'1.2 MB' },
      { name:'ทะเบียนบ้าน.pdf',      size:'0.8 MB' },
      { name:'สลิปเงินเดือน.pdf',    size:'0.5 MB' },
      { name:'Statement-6เดือน.pdf', size:'2.1 MB' },
    ]
  });
});

module.exports = router;
