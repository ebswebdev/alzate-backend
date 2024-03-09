import { Router } from "express";
const bodyParser = require("body-parser");
import asyncHandler from "express-async-handler";
import { ProcesoR, ProcesoRModel } from "../models/proceso-radicado.model";

const router = Router();



router.use(bodyParser.json());

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const procesos = await ProcesoRModel.find();
    res.send(procesos);
  })
);

router.get(
  "/:radicado",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.radicado);
    const proceso = (await ProcesoRModel.find({ radicado: { $regex: searchRegex } })).reverse();
    res.send(proceso);
  })
);



router.post(
  "/agregar",
  asyncHandler(async (req, res) => {
    const { fecha, observaciones, radicado} = req.body;

    const newProcesoR: ProcesoR = {
      fecha: fecha,
      observaciones: observaciones,
      radicado: radicado
    };

    const dbProcesoR = await ProcesoRModel.create(newProcesoR);
    res.send(dbProcesoR.radicado);
  })
);


export default router;
