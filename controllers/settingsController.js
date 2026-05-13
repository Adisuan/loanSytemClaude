const {
  settingsNav,
  validSections,
  company,
  loanProducts,
  fees,
  channels,
  bankAccount,
  notifications,
  users,
  roles,
  security,
  recentLogins,
  system
} = require("../data/settings");

function renderSection(req, res, section, extra) {
  let item = settingsNav.find((s) => s.key === section) || settingsNav[0];
  return res.render("main", Object.assign({
    page: `settings/${section}`,
    title: `ตั้งค่า — ${item.label}`,
    breadcrumb: `ตั้งค่า — ${item.label}`,
    settingsNav,
    activeSection: section,
    sectionLabel: item.label,
    saved: req.query.saved === "1"
  }, extra));
}

async function indexRedirect(req, res, next) {
  try {
    return res.redirect("/settings/general");
  } catch (e) {
    return res.redirect("/");
  }
}

async function generalPage(req, res, next) {
  try {
    return renderSection(req, res, "general", { company });
  } catch (e) {
    return res.redirect("/");
  }
}

async function loanProductsPage(req, res, next) {
  try {
    return renderSection(req, res, "loan-products", { loanProducts });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function feesPage(req, res, next) {
  try {
    return renderSection(req, res, "fees", { fees });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function channelsPage(req, res, next) {
  try {
    return renderSection(req, res, "channels", { channels, bankAccount });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function notificationsPage(req, res, next) {
  try {
    return renderSection(req, res, "notifications", { notifications });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function usersPage(req, res, next) {
  try {
    return renderSection(req, res, "users", { users, roles });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function securityPage(req, res, next) {
  try {
    return renderSection(req, res, "security", { security, recentLogins });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function systemPage(req, res, next) {
  try {
    return renderSection(req, res, "system", { system });
  } catch (e) {
    return res.redirect("/settings");
  }
}

async function save(req, res, next) {
  try {
    const { section } = req.params;
    if (!validSections.includes(section)) {
      return res.redirect("/settings");
    }
    return res.redirect(`/settings/${section}?saved=1`);
  } catch (e) {
    return res.redirect("/settings");
  }
}

module.exports = {
  indexRedirect,
  generalPage,
  loanProductsPage,
  feesPage,
  channelsPage,
  notificationsPage,
  usersPage,
  securityPage,
  systemPage,
  save
};
