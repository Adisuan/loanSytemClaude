let mockPayments = [
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

let dueTodayList = [
  { loanId:'LN-2025-0001', name:'สมชาย ใจดี',      installment:13, amount:'4,625.90',  color:'#3b82f6' },
  { loanId:'LN-2025-0002', name:'วิไล มีทอง',      installment:9,  amount:'15,812.60', color:'#8b5cf6' },
  { loanId:'LN-2025-0003', name:'ประเสริฐ สุขสม',   installment:21, amount:'15,633.20', color:'#10b981' },
  { loanId:'LN-2025-0007', name:'นิรันดร์ ทองคำ',   installment:16, amount:'23,199.10', color:'#0ea5e9' },
];

let overdueList = [
  { loanId:'LN-2025-0005', name:'อนันต์ พรมมา',    amount:'4,876.50',  overdueDays: 37 },
  { loanId:'LN-2025-0009', name:'ดารณี พัฒนา',     amount:'8,200.00',  overdueDays: 22 },
  { loanId:'LN-2025-0012', name:'ชาญชัย วงษ์ดี',   amount:'12,450.00', overdueDays: 15 },
];

let loanMap = {
  'LN-2025-0001': { borrower:'สมชาย ใจดี',    type:'สินเชื่อบุคคล',  amount:150000,  rate:7.5, term:36,  paid:12, color:'#3b82f6' },
  'LN-2025-0002': { borrower:'วิไล มีทอง',    type:'สินเชื่อบ้าน',   amount:2500000, rate:4.5, term:240, paid:8,  color:'#8b5cf6' },
  'LN-2025-0003': { borrower:'ประเสริฐ สุขสม', type:'สินเชื่อธุรกิจ', amount:800000,  rate:6.5, term:60,  paid:20, color:'#10b981' },
};

module.exports = { mockPayments, dueTodayList, overdueList, loanMap };
