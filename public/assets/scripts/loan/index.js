let table;

function colorFromName(name) {
  let key = String(name || "");
  let idx = 0;
  for (let i = 0; i < key.length; i++) idx = (idx + key.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

function fullNameFromCustomer(customer) {
  if (!customer || !customer.name) return "";
  let { firstName, middleName, lastName } = customer.name;
  return [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
}

function displayStatus(applicationStatus, loanStatus) {
  if (["rejected", "cancelled", "expired"].includes(applicationStatus)) {
    return { label: "ปฏิเสธ", badge: "bg-danger bg-opacity-15 text-danger", icon: "bi-x-circle-fill" };
  }
  if (["paid_off", "settled", "written_off"].includes(loanStatus)) {
    return { label: "ปิดบัญชี", badge: "bg-secondary bg-opacity-15 text-secondary", icon: "" };
  }
  if (applicationStatus === "approved") {
    return { label: "อนุมัติ", badge: "bg-success bg-opacity-15 text-success", icon: "bi-check-circle-fill" };
  }
  return { label: "รออนุมัติ", badge: "bg-warning bg-opacity-20 text-warning", icon: "bi-clock-fill" };
}

function thaiDate(d) {
  if (!d) return "-";
  let m = moment(d);
  return `${m.format("DD/MM/")}${m.year() + 543}`;
}

$(document).ready(function () {
  dataTable();
});
function dataTable() {
  if ($.fn.dataTable && $.fn.dataTable.ext) {
    $.fn.dataTable.ext.errMode = "throw";
  }
  table = $("#table").DataTable({
    language: CONFIG.DATA_TABLE_LANGUAGE,
    stateSave: true,
    stateDuration: -1,
    autoWidth: false,
    ordering: false,
    pageLength: 25,
    lengthMenu: [
      [10, 25, 50, 100, 500, 1000],
      [10, 25, 50, 100, 500, 1000]
    ],
    serverSide: true,
    serverMethod: "POST",
    processing: false,
    ajax: {
      url: `/loan/list/dataTable`,
      dataType: "json",
      contentType: "application/json",
      data: function (data) {
        return JSON.stringify(data);
      },
      dataSrc: "data"
    },
    columns: [
      {
        className: "ps-4 col-checkbox",
        orderable: false,
        render: function () {
          return `<input type="checkbox" class="form-check-input">`;
        }
      },
      {
        render: function (data, type, full) {
          let { code } = full;
          return `<a href="/loan/${code}" class="text-primary fw-500 text-decoration-none">${code}</a>`;
        }
      },
      {
        render: function (data, type, full) {
          let { customer } = full;
          let name = fullNameFromCustomer(customer) || "-";
          let phone = customer?.phone || "-";
          let color = colorFromName(name);
          let initial = name && name !== "-" ? name.charAt(0) : "?";
          return `
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-circle d-flex align-items-center justify-content-center text-white avatar-md flex-shrink-0" style="background:${color};">
                ${initial}
              </div>
              <div>
                <div class="fs-88 fw-500">${name}</div>
                <div class="text-muted fs-78">${phone}</div>
              </div>
            </div>`;
        }
      },
      {
        render: function (data, type, full) {
          let { loanType } = full;
          let typeName = loanType?.name?.th || "-";
          return `<span class="text-muted fs-88">${typeName}</span>`;
        }
      },
      {
        className: "fw-500",
        render: function (data, type, full) {
          let { loanAmount } = full;
          let value = typeof loanAmount === "number" ? numeral(loanAmount).format("0,0") : loanAmount || "0";
          return `฿${value}`;
        }
      },
      {
        render: function (data, type, full) {
          let { loanRate } = full;
          return `${loanRate ?? 0}%`;
        }
      },
      {
        render: function (data, type, full) {
          let { loanTerm } = full;
          return `${loanTerm ?? 0} เดือน`;
        }
      },
      {
        render: function (data, type, full) {
          let { paidInstallments, loanTerm } = full;
          let paid = paidInstallments || 0;
          let term = loanTerm || 0;
          let percent = term > 0 ? Math.round((paid / term) * 100) : 0;
          return `
            <div class="fs-80">
              <span class="fw-500">${paid}</span>
              <span class="text-muted">/ ${term}</span>
            </div>
            <div class="progress mt-1" style="width:80px;">
              <div class="progress-bar bg-primary" style="width:${percent}%"></div>
            </div>`;
        }
      },
      {
        render: function (data, type, full) {
          let { applicationStatus, loanStatus } = full;
          let { label, badge, icon } = displayStatus(applicationStatus, loanStatus);
          let iconHtml = icon ? `<i class="bi ${icon} me-1"></i>` : "";
          return `<span class="badge-status ${badge}">${iconHtml}${label}</span>`;
        }
      },
      {
        className: "text-muted fs-85",
        render: function (data, type, full) {
          return thaiDate(full.createdAt);
        }
      },
      {
        orderable: false,
        render: function (data, type, full) {
          let { code } = full;
          return `
            <div class="dropdown">
              <button class="btn btn-sm btn-light border-0" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 dropdown-menu-text">
                <li><a class="dropdown-item" href="/loan/${code}"><i class="bi bi-eye me-2"></i>ดูรายละเอียด</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>แก้ไข</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>ลบ</a></li>
              </ul>
            </div>`;
        }
      }
    ],
    rowCallback: function (row, data, index) {},
    drawCallback: function (settings) {
      if (typeof allowCloseNotification !== "undefined" && allowCloseNotification) {
        Swal.close();
      }
    }
  });
  setInterval(function () {
    table.ajax.reload(null, false);
  }, TIME_RELOAD_TABLE);
  let $input = $(table.table().container()).find('input[type="search"]');
  $input.unbind();
  $input.on("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      searchText = $input.val();
      sweetAlert2Loading();
      table.search(this.value).draw();
    }
  });
  $input.on("paste", function () {
    let $this = $(this);
    setTimeout(function () {
      let val = $this.val();
      searchText = val;
      if (val.trim() !== "") {
        sweetAlert2Loading();
        table.search(val).draw();
      }
    }, 100);
  });
}
