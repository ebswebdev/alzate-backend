import { Router } from "express";
const bodyParser = require("body-parser");
import { radicados } from "../data";
import asyncHandler from "express-async-handler";
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
    const radicado = (await RadicadoModel.find({ usuario: { $regex: searchRegex } })).reverse();
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
      res.status(400).send("el radicado ya existe");
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


router.put(
  "/edit/:numeroR",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.numeroR);
  const { demanda, demandado} = req.body;

    const radicado = await RadicadoModel.findOne({ numero: { $regex: searchRegex } });
    if (!radicado) {
      res.status(404).send("Radicado no encontrado");
      return;
    }

    radicado.demanda = demanda,
    radicado.demandado = demandado,    

    await radicado.save();

    res.send("El radicado se actualizó correctamente");
  })
);


router.put(
  "/estado/:numeroR",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.numeroR);
    const radicado = await RadicadoModel.findOne({ numero: { $regex: searchRegex } });
    if (!radicado) {
      res.status(404).send("Radicado no encontrado");
      return;
    }

    if(radicado.estado==='cerrado'){
      radicado.estado = 'activo';    
    }else{
      radicado.estado= 'cerrado';
    }

    await radicado.save();

    res.send("El radicado se actualizó correctamente");
  })
);

router.delete(
  "/delete/:numeroR",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.numeroR);

    // Buscar el usuario por su ID
    const radicado = await RadicadoModel.findOneAndDelete({ numero: { $regex: searchRegex } });
    if (!radicado) {
      res.status(404).send("radicado no encontrado");
      return;
    }
    res.send("Radicado eliminado correctamente");
  })
);


export default router;
