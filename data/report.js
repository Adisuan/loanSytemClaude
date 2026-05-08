let reportList = [
  {
    key: 'summary',
    title: 'สรุปสินเชื่อ',
    desc: 'ภาพรวมพอร์ตสินเชื่อ ยอดอนุมัติ ยอดคงเหลือ และแนวโน้มรายเดือน',
    icon: 'bi-bar-chart-line-fill', color: '#3b82f6',
    href: '/report/summary', tag: 'การเงิน',
  },
  {
    key: 'revenue',
    title: 'รายรับ',
    desc: 'ยอดเงินที่จัดเก็บได้ แยกตามประเภทสินเชื่อ ช่องทางการชำระ และเดือน',
    icon: 'bi-cash-stack', color: '#10b981',
    href: '/report/revenue', tag: 'การเงิน',
  },
  {
    key: 'overdue',
    title: 'หนี้ค้างชำระ',
    desc: 'รายงานยอดค้างชำระแยกตามอายุหนี้ (Aging) 1-30, 31-60, 61-90, 90+ วัน',
    icon: 'bi-exclamation-triangle-fill', color: '#ef4444',
    href: '/report/overdue', tag: 'การเงิน',
  },
  {
    key: 'portfolio',
    title: 'พอร์ตสินเชื่อ',
    desc: 'การกระจายตัวของสินเชื่อ แยกตามประเภท สถานะ และผู้กู้รายใหญ่',
    icon: 'bi-pie-chart-fill', color: '#8b5cf6',
    href: '/report/portfolio', tag: 'พอร์ต',
  },
  {
    key: 'collateral',
    title: 'หลักประกัน',
    desc: 'มูลค่าหลักประกันรวม แยกตามประเภท สถานะ และอัตราส่วนค้ำประกัน',
    icon: 'bi-shield-fill-check', color: '#f59e0b',
    href: '/report/collateral', tag: 'พอร์ต',
  },
  {
    key: 'customer',
    title: 'ลูกค้า',
    desc: 'จำนวนลูกค้าใหม่ ลูกค้าที่มีสัญญาหลายฉบับ และอันดับยอดสินเชื่อ',
    icon: 'bi-people-fill', color: '#06b6d4',
    href: '/report/customer', tag: 'ลูกค้า',
  },
];

module.exports = { reportList };
