import express, { Router } from "express";
import cors from "cors";
const bodyParser = require("body-parser");
import jwt from "jsonwebtoken";
import { radicados, sample_users, usuarios } from "../data";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import { Radicado, RadicadoModel } from "../models/radicado.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await RadicadoModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }
    await RadicadoModel.create(radicados);
    res.send("Seed Is Done!");
  })
);

router.use(bodyParser.json());

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await RadicadoModel.find();
    res.send(users);
  })
);

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.userId);
    const radicado = await RadicadoModel.find({ usuario: { $regex: searchRegex } });
    res.send(radicado);
  })
);

router.get(
  "/id/:numero",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.numero);
    const radicado = await RadicadoModel.findOne({ numero: { $regex: searchRegex } });
    res.send(radicado);
  })
);



router.post(
  "/agregar",
  asyncHandler(async (req, res) => {
    const { numero,demanda,demandado,usuario, estado} = req.body;
    const radicado = await RadicadoModel.findOne({ numero });
    if (radicado) {
      res.status(400).send("Radicado is already exist");
      return;
    }
    const newRadicado: Radicado = {
      numero:numero,
      demanda:demanda,
      demandado:demandado,
      estado:estado,
      usuario:usuario
    };

    const dbRadicado = await RadicadoModel.create(newRadicado);
    res.send(dbRadicado.numero);
  })
);


export default router;
