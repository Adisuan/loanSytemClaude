var express = require('express');
var router = express.Router();
const { mockCollaterals, collateralTypes } = require('../data/collaterals');

function calcStats(items) {
  const sumValue = items.reduce((acc, c) => {
    const n = parseFloat(String(c.estimatedValue).replace(/,/g, '')) || 0;
    return acc + n;
  }, 0);
  return {
    total: items.length,
    available: items.filter(c => c.status === 'ว่าง').length,
    inUse: items.filter(c => c.status === 'ใช้ค้ำอยู่').length,
    released: items.filter(c => c.status === 'ปลดแล้ว').length,
    sumValue: sumValue.toLocaleString('th-TH'),
  };
}

router.get('/', function(req, res) {
  res.render('collaterals/index', {
    title: 'หลักประกัน',
    page: 'collaterals',
    breadcrumb: 'หลักประกัน',
    collaterals: mockCollaterals,
    stats: calcStats(mockCollaterals),
  });
});

router.get('/new', function(req, res) {
  res.render('collaterals/form', {
    title: 'เพิ่มหลักประกัน',
    page: 'collaterals',
    breadcrumb: 'เพิ่มหลักประกัน',
    mode: 'create',
    item: null,
    types: collateralTypes,
  });
});

router.post('/new', function(req, res) {
  res.redirect('/collaterals');
});

router.get('/:id', function(req, res) {
  const item = mockCollaterals.find(c => c.id === req.params.id) || mockCollaterals[0];
  res.render('collaterals/detail', {
    title: item.title,
    page: 'collaterals',
    breadcrumb: 'หลักประกัน',
    item,
  });
});

router.get('/:id/edit', function(req, res) {
  const item = mockCollaterals.find(c => c.id === req.params.id) || mockCollaterals[0];
  res.render('collaterals/form', {
    title: 'แก้ไขหลักประกัน',
    page: 'collaterals',
    breadcrumb: 'แก้ไขหลักประกัน',
    mode: 'edit',
    item,
    types: collateralTypes,
  });
});

router.post('/:id/edit', function(req, res) {
  res.redirect('/collaterals/' + req.params.id);
});

router.post('/:id/delete', function(req, res) {
  res.redirect('/collaterals');
});

module.exports = router;
