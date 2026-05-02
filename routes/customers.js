var express = require('express');
var router = express.Router();

const mockCustomers = [
  {
    id: 'CUS-001', prefix: 'นาย', name: 'สมชาย ใจดี',
    idCard: '1-1020-12345-67-8', phone: '081-234-5678', email: 'somchai@email.com',
    occupation: 'พนักงานเอกชน', company: 'บริษัท ABC จำกัด', income: '45,000',
    address: '123/45 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110',
    loanCount: 1, activeLoans: 1, totalBorrowed: '150,000', status: 'ปกติ',
    color: '#3b82f6', joinDate: '01/01/2568',
  },
  {
    id: 'CUS-002', prefix: 'นาง', name: 'วิไล มีทอง',
    idCard: '1-2030-23456-78-9', phone: '082-345-6789', email: 'wilai@email.com',
    occupation: 'ข้าราชการ/รัฐวิสาหกิจ', company: 'กระทรวงศึกษาธิการ', income: '62,000',
    address: '89/12 ถ.พระราม 4 แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
    loanCount: 2, activeLoans: 1, totalBorrowed: '2,500,000', status: 'ปกติ',
    color: '#8b5cf6', joinDate: '05/01/2568',
  },
  {
    id: 'CUS-003', prefix: 'นาย', name: 'ประเสริฐ สุขสม',
    idCard: '1-3040-34567-89-0', phone: '083-456-7890', email: 'prasert@email.com',
    occupation: 'ธุรกิจส่วนตัว', company: 'ร้านประเสริฐการค้า', income: '95,000',
    address: '45/67 ถ.เจริญกรุง แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500',
    loanCount: 3, activeLoans: 1, totalBorrowed: '800,000', status: 'ปกติ',
    color: '#10b981', joinDate: '10/01/2568',
  },
  {
    id: 'CUS-004', prefix: 'นางสาว', name: 'มาลี รักเรียน',
    idCard: '1-4050-45678-90-1', phone: '084-567-8901', email: 'malee@email.com',
    occupation: 'พนักงานเอกชน', company: 'บริษัท XYZ จำกัด', income: '28,000',
    address: '56/78 ถ.ลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230',
    loanCount: 1, activeLoans: 0, totalBorrowed: '450,000', status: 'ค้างชำระ',
    color: '#f59e0b', joinDate: '15/01/2568',
  },
  {
    id: 'CUS-005', prefix: 'นาย', name: 'อนันต์ พรมมา',
    idCard: '1-5060-56789-01-2', phone: '085-678-9012', email: 'anan@email.com',
    occupation: 'เกษตรกร', company: '', income: '22,000',
    address: '12/3 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000',
    loanCount: 1, activeLoans: 1, totalBorrowed: '200,000', status: 'ติดตาม',
    color: '#ef4444', joinDate: '20/01/2568',
  },
  {
    id: 'CUS-006', prefix: 'นาง', name: 'จิรา สว่างใจ',
    idCard: '1-6070-67890-12-3', phone: '086-789-0123', email: 'jira@email.com',
    occupation: 'ฟรีแลนซ์', company: '', income: '35,000',
    address: '78/9 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพมหานคร 10400',
    loanCount: 2, activeLoans: 0, totalBorrowed: '80,000', status: 'ปกติ',
    color: '#6b7280', joinDate: '01/02/2568',
  },
  {
    id: 'CUS-007', prefix: 'นาย', name: 'นิรันดร์ ทองคำ',
    idCard: '1-7080-78901-23-4', phone: '087-890-1234', email: 'nirun@email.com',
    occupation: 'ธุรกิจส่วนตัว', company: 'ห้างหุ้นส่วนทองคำ', income: '150,000',
    address: '234/56 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
    loanCount: 2, activeLoans: 1, totalBorrowed: '1,200,000', status: 'ปกติ',
    color: '#0ea5e9', joinDate: '10/02/2568',
  },
  {
    id: 'CUS-008', prefix: 'นางสาว', name: 'พัชรา เจริญสุข',
    idCard: '1-8090-89012-34-5', phone: '088-901-2345', email: 'patchara@email.com',
    occupation: 'ข้าราชการ/รัฐวิสาหกิจ', company: 'การไฟฟ้านครหลวง', income: '78,000',
    address: '90/12 ถ.สาทร แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120',
    loanCount: 1, activeLoans: 1, totalBorrowed: '3,200,000', status: 'ปกติ',
    color: '#d946ef', joinDate: '15/04/2568',
  },
];

router.get('/', function(req, res) {
  res.render('customers/index', {
    title: 'ข้อมูลลูกค้า',
    page: 'customers',
    breadcrumb: 'ข้อมูลลูกค้า',
    customers: mockCustomers,
    stats: {
      total: mockCustomers.length,
      newThisMonth: 2,
      hasLoan: mockCustomers.filter(c => c.activeLoans > 0).length,
      overdue: mockCustomers.filter(c => c.status === 'ค้างชำระ').length,
    },
  });
});

router.get('/:id', function(req, res) {
  const customer = mockCustomers.find(c => c.id === req.params.id) || mockCustomers[0];

  const loans = [
    { id: 'LN-2025-0001', type: 'สินเชื่อบุคคล',  amount: '150,000',   rate: 7.5,  term: 36,  paid: 12, status: 'อนุมัติ',   date: '01/04/2568' },
  ];

  const payments = [
    { no: 12, date: '01/04/2568', amount: '4,625.90', channel: 'โอนเงิน', status: 'สำเร็จ' },
    { no: 11, date: '01/03/2568', amount: '4,625.90', channel: 'โอนเงิน', status: 'สำเร็จ' },
    { no: 10, date: '01/02/2568', amount: '4,625.90', channel: 'เงินสด',  status: 'สำเร็จ' },
    { no: 9,  date: '01/01/2568', amount: '4,625.90', channel: 'โอนเงิน', status: 'สำเร็จ' },
    { no: 8,  date: '01/12/2567', amount: '4,625.90', channel: 'QR Code', status: 'สำเร็จ' },
  ];

  res.render('customers/detail', {
    title: customer.prefix + customer.name,
    page: 'customers',
    breadcrumb: 'ข้อมูลลูกค้า',
    customer,
    loans,
    payments,
  });
});

module.exports = router;
