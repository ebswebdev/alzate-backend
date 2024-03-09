import { Schema, model } from "mongoose";

export interface User{
    nombre: string;
    cedula: string;
    correo: string;
    contrasena:string;
    telefono: string;
    direccion: string;
    abogado: string;
    rol: string;
    isAdmin: boolean;
}

export const UserSchema = new Schema<User>({
    nombre:{type : String, required : true},
    cedula:{ type:String , unique :true ,required : true },
    correo:{ type:String  ,unique :true ,lowercase: true ,required : true},
    contrasena:{ type:String, required : true},
    telefono: {type: String},
    direccion: {type: String},
    abogado: {type: String, ref:'Abogado'}, //referencia a un documento de la colección Abogados
    rol: { type: String, enum: ['Cliente', 'Abogado', 'usuario'] },
    isAdmin: {type: Boolean, default: false}
},{toJSON:{ virtuals:true },
toObject:{ virtuals:true },
timestamps:true},

);

export const UserModel = model<User>("user", UserSchema);