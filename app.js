// REQUIRED PACKAGES
const express = require("express");
const path = require("path"); 
const cookieParser = require("cookie-parser");

// EXPRESS SERVER APP
const app = express();

// PUBLIC FOLDER
app.use(express.static("public"));

// PARSE HTML
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// VIEW ENGINE
app.set("view engine", "ejs");

// ROUTES
app.use("/auth", require("./server/routes/auth"));
app.use("/", require("./server/routes/pages"));

// PORT NUMBER
const PORT = process.env.PORT || 3000;

// RUN SERVER
app.listen(PORT, () => {
  console.log(`Server started on port${PORT}`);
});

// Things modified by Ray:
// I DON'T HAVE ACCESS TO YOUR .ENV PLEASE GET THIS TO ME ASAP (Using my own reverse-engineered from usages)
// Updated mysql dependency to mysql2. Reason: better pwd support - old ver was breaking your functions
// Generated new MailGun API KEY (Ray API Key) (Still using pre-existing sandbox domain)