import { Router } from "express";
const bodyParser = require("body-parser");
import asyncHandler from "express-async-handler";
import { ProcesoR, ProcesoRModel } from "../models/proceso-radicado.model";
import { RadicadoModel } from "../models/radicado.model";
import { usuarios } from "../data";

const router = Router();



router.use(bodyParser.json());

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const procesos = (await ProcesoRModel.find()).reverse();
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

router.get(
  "/usuario/:usuarioId",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.usuarioId);
    const proceso = (await ProcesoRModel.find({ usuario: { $regex: searchRegex } })).reverse();
    res.send(proceso);
  })
);




router.post(
  "/agregar",
  asyncHandler(async (req, res) => {
    const { fecha, observaciones, radicado, usuario} = req.body;

    const newProcesoR: ProcesoR = {
      fecha: fecha,
      observaciones: observaciones,
      radicado: radicado,
      usuario: usuario
    };

    const dbProcesoR = await ProcesoRModel.create(newProcesoR);
    res.send(dbProcesoR.radicado);
  })
);

router.delete(
  "/delete/:usuario/:radicado",
  asyncHandler(async (req, res) => {
    const usuarioRegex = new RegExp(req.params.usuario);
    const radicadoRegex = new RegExp(req.params.radicado);
        
    const proceso = await ProcesoRModel.findOneAndDelete({ usuario: usuarioRegex, radicado: radicadoRegex });
    if (!proceso) {
      res.status(404).send("Proceso no encontrado");
      return;
    }
    res.send("Proceso eliminado correctamente");
  })
);





export default router;
