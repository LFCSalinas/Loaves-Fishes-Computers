// EXPRESS SERVER APP
import express from 'express'
import cookieParser from 'cookie-parser'
import { init_routes } from './server/routes/index.js'
import cors from 'cors';

const app = express();

// Use CORS middleware to allow requests from your frontend's origin
app.use(cors({ origin: 'http://localhost:3000' }));

// PUBLIC FOLDER
app.use(express.static("public"));

// PARSE HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// VIEW ENGINE
// app.set("view engine", "ejs");

// ROUTES
init_routes(app);

// PORT NUMBER
const PORT = 3001;

// RUN SERVER
app.listen(PORT, () => {
  console.log(`Server started on port${PORT}`);
});