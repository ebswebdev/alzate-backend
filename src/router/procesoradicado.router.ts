import { Router } from "express";
const bodyParser = require("body-parser");
import asyncHandler from "express-async-handler";
import { ProcesoR, ProcesoRModel } from "../models/proceso-radicado.model";
import { RadicadoModel } from "../models/radicado.model";

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

/*
router.get(
  "/usuario/:userId",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.userId);
    const radicado = (await RadicadoModel.find({ usuario: { $regex: searchRegex } })).reverse();
    
    try {
      const procesosPromises = radicado.map(async (r) => {
        const searchRe = new RegExp(r.numero);
        console.log(r.numero);
        return await ProcesoRModel.find({ radicado: { $regex: searchRe } });
      });
      console.log(procesosPromises);
      
      const procesos = await Promise.all(procesosPromises);
      const mergedProcesos = procesos.reduce((acc, curr) => acc.concat(curr), []);
      
      console.log("data", mergedProcesos);
      res.send(mergedProcesos);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error interno del servidor");
    }
  })
);
*/




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
