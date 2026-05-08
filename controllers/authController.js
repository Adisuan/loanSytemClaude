async function login(req, res, next) {
  try {
    return res.render("main-auth", {
      page: "auth/login",
      title: "เข้าสู่ระบบ",
      error: null,
      username: ""
    });
  } catch (e) {
    return res.send({
      error: true
    });
  }
}

async function loginSubmit(req, res, next) {
  try {
    return res.redirect("/");
  } catch (e) {
    return res.send({
      error: true
    });
  }
}

async function logout(req, res, next) {
  try {
    return res.redirect("/auth/login");
  } catch (e) {
    return res.send({
      error: true
    });
  }
}

module.exports = {
  login,
  loginSubmit,
  logout
};
