var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    title: 'แดชบอร์ด',
    loans: [
      { id: 'LN-2025-0001', name: 'สมชาย ใจดี',      type: 'สินเชื่อบุคคล',  amount: '150,000', status: 'อนุมัติ',   color: '#3b82f6', date: '01/04/2568' },
      { id: 'LN-2025-0002', name: 'วิไล มีทอง',      type: 'สินเชื่อบ้าน',   amount: '2,500,000', status: 'รออนุมัติ', color: '#8b5cf6', date: '02/04/2568' },
      { id: 'LN-2025-0003', name: 'ประเสริฐ สุขสม',   type: 'สินเชื่อธุรกิจ', amount: '800,000', status: 'อนุมัติ',   color: '#10b981', date: '03/04/2568' },
      { id: 'LN-2025-0004', name: 'มาลี รักเรียน',    type: 'สินเชื่อรถยนต์', amount: '450,000', status: 'ปฏิเสธ',   color: '#f59e0b', date: '05/04/2568' },
      { id: 'LN-2025-0005', name: 'อนันต์ พรมมา',    type: 'สินเชื่อบุคคล',  amount: '200,000', status: 'รออนุมัติ', color: '#ef4444', date: '06/04/2568' },
    ]
  });
});

module.exports = router;
