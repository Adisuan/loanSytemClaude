var express = require('express');
var router = express.Router();

const mockPayments = [
  { receiptNo:'RCP-2025-0248', loanId:'LN-2025-0001', borrower:'สมชาย ใจดี',      installment:12, amount:'4,625.90', channel:'โอนเงิน',      channelIcon:'bank',         status:'สำเร็จ',   date:'01/04/2568' },
  { receiptNo:'RCP-2025-0247', loanId:'LN-2025-0003', borrower:'ประเสริฐ สุขสม',   installment:20, amount:'15,633.20',channel:'หักบัญชีอัตโนมัติ',channelIcon:'arrow-repeat', status:'สำเร็จ',   date:'01/04/2568' },
  { receiptNo:'RCP-2025-0246', loanId:'LN-2025-0007', borrower:'นิรันดร์ ทองคำ',   installment:15, amount:'23,199.10',channel:'QR Code',        channelIcon:'qr-code',      status:'สำเร็จ',   date:'01/04/2568' },
  { receiptNo:'RCP-2025-0245', loanId:'LN-2025-0008', borrower:'พัชรา เจริญสุข',   installment:2,  amount:'16,744.30',channel:'โอนเงิน',        channelIcon:'bank',         status:'สำเร็จ',   date:'01/04/2568' },
  { receiptNo:'RCP-2025-0244', loanId:'LN-2025-0005', borrower:'อนันต์ พรมมา',     installment:3,  amount:'4,876.50', channel:'เงินสด',         channelIcon:'cash',         status:'ค้างชำระ', date:'25/03/2568' },
  { receiptNo:'RCP-2025-0243', loanId:'LN-2025-0001', borrower:'สมชาย ใจดี',      installment:11, amount:'4,625.90', channel:'ATM',             channelIcon:'credit-card',  status:'สำเร็จ',   date:'01/03/2568' },
  { receiptNo:'RCP-2025-0242', loanId:'LN-2025-0003', borrower:'ประเสริฐ สุขสม',   installment:19, amount:'15,633.20',channel:'หักบัญชีอัตโนมัติ',channelIcon:'arrow-repeat', status:'สำเร็จ',   date:'01/03/2568' },
  { receiptNo:'RCP-2025-0241', loanId:'LN-2025-0002', borrower:'วิไล มีทอง',      installment:8,  amount:'15,812.60',channel:'โอนเงิน',        channelIcon:'bank',         status:'สำเร็จ',   date:'28/02/2568' },
  { receiptNo:'RCP-2025-0240', loanId:'LN-2025-0007', borrower:'นิรันดร์ ทองคำ',   installment:14, amount:'23,199.10',channel:'QR Code',        channelIcon:'qr-code',      status:'ค้างชำระ', date:'25/02/2568' },
  { receiptNo:'RCP-2025-0239', loanId:'LN-2025-0008', borrower:'พัชรา เจริญสุข',   installment:1,  amount:'16,744.30',channel:'โอนเงิน',        channelIcon:'bank',         status:'สำเร็จ',   date:'01/02/2568' },
];

const dueTodayList = [
  { loanId:'LN-2025-0001', name:'สมชาย ใจดี',      installment:13, amount:'4,625.90',  color:'#3b82f6' },
  { loanId:'LN-2025-0002', name:'วิไล มีทอง',      installment:9,  amount:'15,812.60', color:'#8b5cf6' },
  { loanId:'LN-2025-0003', name:'ประเสริฐ สุขสม',   installment:21, amount:'15,633.20', color:'#10b981' },
  { loanId:'LN-2025-0007', name:'นิรันดร์ ทองคำ',   installment:16, amount:'23,199.10', color:'#0ea5e9' },
];

const overdueList = [
  { loanId:'LN-2025-0005', name:'อนันต์ พรมมา',    amount:'4,876.50',  overdueDays: 37 },
  { loanId:'LN-2025-0009', name:'ดารณี พัฒนา',     amount:'8,200.00',  overdueDays: 22 },
  { loanId:'LN-2025-0012', name:'ชาญชัย วงษ์ดี',   amount:'12,450.00', overdueDays: 15 },
];

function fmt(n) {
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

router.get('/', function(req, res) {
  res.render('payments/index', {
    title: 'การชำระเงิน',
    payments: mockPayments,
    dueTodayList,
    overdueList,
  });
});

router.get('/new', function(req, res) {
  const today = new Date().toISOString().split('T')[0];
  res.render('payments/new', {
    title: 'บันทึกการชำระเงิน',
    selectedLoanId: req.query.loan || '',
    today,
  });
});

router.post('/new', function(req, res) {
  const { loanId, amount, payDate, channel, refNo, note } = req.body;

  // Calculate breakdown (simplified)
  const loanMap = {
    'LN-2025-0001': { borrower:'สมชาย ใจดี',    type:'สินเชื่อบุคคล',  amount:150000,  rate:7.5, term:36,  paid:12, color:'#3b82f6' },
    'LN-2025-0002': { borrower:'วิไล มีทอง',    type:'สินเชื่อบ้าน',   amount:2500000, rate:4.5, term:240, paid:8,  color:'#8b5cf6' },
    'LN-2025-0003': { borrower:'ประเสริฐ สุขสม', type:'สินเชื่อธุรกิจ', amount:800000,  rate:6.5, term:60,  paid:20, color:'#10b981' },
  };

  const loan = loanMap[loanId] || { borrower:'ผู้กู้', type:'สินเชื่อบุคคล', amount:100000, rate:7.5, term:24, paid:1 };
  const r = loan.rate / 100 / 12;
  const n = loan.term;
  const P = loan.amount;
  const M = r > 0 ? P * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1) : P/n;

  let bal = P;
  for (let i = 0; i < loan.paid; i++) { bal -= (M - bal * r); }
  const interestAmt = bal * r;
  const principalAmt = M - interestAmt;
  const nextNo = loan.paid + 1;
  const remainBal = bal - principalAmt;

  const channelNames = { cash:'เงินสด', transfer:'โอนเงิน / PromptPay', qr:'QR Code', atm:'ATM', auto:'หักบัญชีอัตโนมัติ' };
  const receiptNo = 'RCP-' + Date.now().toString().slice(-8);

  const d = payDate ? new Date(payDate) : new Date();
  const payDateTh = d.toLocaleDateString('th-TH', { day:'2-digit', month:'2-digit', year:'numeric' });

  res.render('payments/receipt', {
    title: 'ใบเสร็จรับเงิน',
    receipt: {
      receiptNo,
      loanId: loanId || 'LN-2025-0001',
      borrower: loan.borrower,
      loanType: loan.type,
      installment: nextNo,
      totalInstallments: loan.term,
      payDate: payDateTh,
      principal: fmt(principalAmt),
      interest: fmt(interestAmt),
      penalty: null,
      total: fmt(parseFloat(amount) || M),
      channel: channelNames[channel] || channel || 'เงินสด',
      refNo: refNo || null,
      remainBalance: fmt(Math.max(0, remainBal)),
      remainInstallments: loan.term - nextNo,
    }
  });
});

router.get('/:receiptNo', function(req, res) {
  const p = mockPayments.find(x => x.receiptNo === req.params.receiptNo) || mockPayments[0];
  res.render('payments/receipt', {
    title: 'ใบเสร็จรับเงิน',
    receipt: {
      receiptNo: p.receiptNo,
      loanId: p.loanId,
      borrower: p.borrower,
      loanType: 'สินเชื่อบุคคล',
      installment: p.installment,
      totalInstallments: 36,
      payDate: p.date,
      principal: '4,068.55',
      interest: '557.35',
      penalty: null,
      total: p.amount,
      channel: p.channel,
      refNo: 'REF' + p.receiptNo.replace('RCP-',''),
      remainBalance: '101,776.28',
      remainInstallments: 36 - p.installment,
    }
  });
});

module.exports = router;
