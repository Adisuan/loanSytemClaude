const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const { MONGO_DB_URL, WEB_NAME } = require("./config");

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const userAgent = require("express-useragent");
const MongoStore = require("connect-mongo").default;

const indexRouter = require("./routes/index");
const loansRouter = require("./routes/loans");
const paymentsRouter = require("./routes/payments");
const customersRouter = require("./routes/customers");
const collateralsRouter = require("./routes/collaterals");
const reportsRouter = require("./routes/reports");
const settingsRouter = require("./routes/settings");

const app = express();
app.use(userAgent.express());
let sessionCreate = {
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
    // expires: 86400000 * 7,
    //  expires: 60000  // Session expires after 1 min of inactivity.
  },
  // store: new RedisStore({
  //   client: redisClient,
  //   prefix: 'staff',
  //   ttl: ms('1d')
  // }),
  // store: new MemoryStore({
  //   checkPeriod: ms('7d')
  // }),
  store: new MongoStore({
    mongoUrl: MONGO_DB_URL,
    mongoOptions: {
      writeConcern: { w: 1 }
    },
    crypto: {
      secret: process.env.SESSION_CRYPTO_SECRET
    },
    collectionName: "staffSession",
    ttl: 24 * 60 * 60 * 7, // = 14 days. Default
    autoRemove: "interval",
    autoRemoveInterval: 60
  }),
  name: "BACKEND",
  secret: "BACKEND_DKDS",
  resave: false,
  saveUninitialized: false
};
app.use(session(sessionCreate));
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // เชื่อถือ proxy ชั้นแรก (เช่น Nginx, Cloudflare)
}
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(
  express.json({
    limit: "100mb"
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "100mb"
  })
);
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "14d"
  })
);

app.use("/", indexRouter);
app.use("/loans", loansRouter);
app.use("/payments", paymentsRouter);
app.use("/customers", customersRouter);
app.use("/collaterals", collateralsRouter);
app.use("/reports", reportsRouter);
app.use("/settings", settingsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
