import express, { Router } from "express";
import cors from "cors";
const bodyParser = require("body-parser");
import jwt from "jsonwebtoken";
import { sample_users, usuarios } from "../data";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import bcrypt from 'bcryptjs';

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(usuarios);
    res.send("Seed Is Done!");
  })
);

router.use(bodyParser.json());

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await UserModel.find({rol: "usuario"});
    res.send(users);
  })
);
router.get(
    "/abogados",
    asyncHandler(async (req, res) => {
      const users = await UserModel.find({rol: "abogado"});
      res.send(users);
    })
  );

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.userId);
    const user = await UserModel.findOne({ cedula: { $regex: searchRegex } });
    res.send(user);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { correo, contrasena } = req.body;
    const user = await UserModel.findOne({ correo, contrasena });
    if (user) {
      if (user.isAdmin) {
        res.send(generateTokenReponse(user));
      } else {
        const UNAUTHORIZED_REQUEST = 401;
        res.status(UNAUTHORIZED_REQUEST).send("401 No tiene permisos de login");
      }
    } else {
      const BAD_REQUEST = 400;
      res.status(BAD_REQUEST).send("400 contraseña o correo incorrecto!");
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { cedula, nombre, correo, contrasena, direccion, telefono, abogado, rol } = req.body;
    const user = await UserModel.findOne({ cedula });
    if (user) {
      res.status(400).send("User is already exist, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(contrasena, 10);

    const newUser: User = {
        cedula: cedula,
        nombre: nombre,
        correo: correo.toLowerCase(),
        contrasena: encryptedPassword,
        direccion,
        isAdmin: false,
        telefono: telefono,
        abogado: abogado,
        rol: rol
    };

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  })
);

const generateTokenReponse = (user: User) => {
  const token = jwt.sign(
    {
      email: user.correo,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  return {
    nombre: user.nombre,
    cedula: user.cedula,
    correo: user.correo,
    contrasena: user.contrasena,
    telefono: user.telefono,
    direccion: user.direccion,
    abogado: user.abogado,
    rol: user.rol,
    token: token,
  };
};

export default router;
