require("./loadEnv"); // Load environment variables before anything else
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
// const authRouter = require("./route/authRoute");
// const projectRouter = require("./route/projectRoute");
// const userRouter = require("./route/userRoute");
// const distributorRoute = require("./route/distributorRoute");
// const franchiseRouter = require("./route/franchiseRouter");
// const dmtRoute = require("./route/dmtRoute");
// const blobRoutes = require("./route/blobRoutes");
// const studentRouter = require("./route/studentRouter");
const router = require('./route/index');
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

app.set("trust proxy", 1); // Trust the first proxy

// Whitelist for allowed origins
const whitelist = [
  "http://localhost:5173",
  "capacitor://localhost",
  "https://localhost",
  "https://dev-digistorepay.azurewebsites.net",
];

// CORS options delegate function
const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true, // reflect (enable) the requested origin in the CORS response
      credentials: true, // include credentials (cookies, authorization headers, etc.)
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
  } else {
    corsOptions = {
      origin: false, // disable CORS for this request
    };
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));
// Middleware for file uploads
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const conString = `postgresql://${process.env.DB_USERNAME}:${dbPassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

app.use(
  session({
    store: new PgSession({
      conString: conString,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV,
      sameSite: "None",
      httpOnly: true,
    },
  })
);

function getISTDateTime() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(now);
}

app.get("/", (req, res) => {
  res.json({
    message: `Welcome to digistore pay application. Latest deployment on Production server: ${getISTDateTime()}`,
  });
});

// All routes will be here

// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/projects", projectRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/distributor", distributorRoute);
// app.use("/api/v1/franchiseRouter", franchiseRouter);
// app.use("/api/v1/dmtRoute", dmtRoute);
// app.use("/api/v1/studentRouter", studentRouter);
// app.use("/api/v1/blobs", blobRoutes);
app.use("/api", router);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server up and running", PORT);
});
