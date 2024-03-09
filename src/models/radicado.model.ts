import { Schema, model } from "mongoose";

export interface Radicado{
    numero:string;
    demanda:string;
    demandado:string;
    estado:string;
    usuario:string;
}

export const RadicadoSchema = new Schema<Radicado>({
    numero:{ type:String , unique :true ,required : true },
    demanda:{type:String, required:true},
    demandado:{type:String, required:true},
    estado:{type:String, required:true},
    usuario:{type:String, required:true},
},{toJSON:{ virtuals:true },
toObject:{ virtuals:true },
timestamps:true},

);

export const RadicadoModel = model<Radicado>("radicado", RadicadoSchema);