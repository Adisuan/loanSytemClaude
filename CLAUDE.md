Before working on this project, read `.ai-context.md` first.
# CLAUDE.md

เอกสารนี้ใช้เป็นแนวทางให้ Claude Code หรือ AI Assistant เข้าใจโครงสร้าง โปรเจกต์ กติกา และข้อควรระวังของระบบสินเชื่อ

---
# Context maintenance

When you make changes that affect project structure, main flows, models, services, routes, commands, or important conventions, update `.ai-context.md` briefly.

Keep `.ai-context.md` short and useful. Do not include full code.
## ภาพรวมระบบ

เป็นระบบสินเชื่อ ใช้สำหรับการกู้เงิน ในการทำสัญญา ผู้กู้อาจจะมีหลักค่ำประกันแตกต่างกันไปเช่น ที่ดินโฉนด เครื่องใช้ไฟฟ้า รถยนต์ โทรศัพท์ เป็นต้น

ระบบควรรองรับการทำงานหลักดังนี้:

- จัดการข้อมูลลูกค้า
- จัดการคำขอสินเชื่อ
- คำนวณยอดผ่อนชำระ
- บันทึกประวัติการชำระเงิน
- ติดตามยอดคงเหลือ
- จัดการสถานะสัญญา
- รายงานยอดสินเชื่อ รายรับ และหนี้ค้างชำระ

---

## Tech Stack หลัก

ระบบนี้ใช้ Node.js เป็นหลัก


## Coding Style

ให้เขียนโค้ดให้อ่านง่าย แยกหน้าที่ชัดเจน และลด logic ซ้ำซ้อน
ห้ามใช้ inline syle ใน html แต่ถ้าผลเขียนเองไม่ต้องไปแก้

### JavaScript
