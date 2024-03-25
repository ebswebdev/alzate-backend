import { Schema, model } from "mongoose";

export interface ProcesoR{
    fecha:string,
    observaciones:string,
    radicado:string;
    usuario:string
}

export const ProcesoRSchema = new Schema<ProcesoR>({
    fecha:{ type:String , unique :true ,required : true },
    observaciones:{type:String, required:true},
    radicado:{type:String, required:true},
    usuario: {type:String, required:true}
},{toJSON:{ virtuals:true },
toObject:{ virtuals:true },
timestamps:true},

);

export const ProcesoRModel = model<ProcesoR>("ProcesoRadicado", ProcesoRSchema);