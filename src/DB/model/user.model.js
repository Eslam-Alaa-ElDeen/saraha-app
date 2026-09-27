import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/user.enum.js";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:30
    },
    lastName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:30
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    password:{
        type:String,
        requird:true
    },
    DOB:Date,
    phone:String,
    confirmEmail:Date,
    image:String,
    coverImage:[String],
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default:GenderEnum.Male
    }
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    autoIndex:true
})

userSchema.virtual("userName").set(function(v){
    const [firstName,lastName]=v?.split(" ") || [];
    this.set({firstName,lastName})
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

export const userModel=mongoose.models.User|| mongoose.model("User",userSchema)