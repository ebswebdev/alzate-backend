import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { usuarios, sample_tags, sample_users } from "./data";
const bodyParser = require("body-parser");
import jwt from "jsonwebtoken";
import userRouter from "./router/user.router";
import { dbConnect } from './configs/database.config';
import radicadoRouter from './router/radicado.router';

dbConnect();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use('/api/users/',userRouter)
app.use('/api/radicados/',radicadoRouter)

const port = 5000;
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
