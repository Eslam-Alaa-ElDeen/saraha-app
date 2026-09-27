export const create=async({model,data,options={}}={})=>{
    return await model.create([data],options)
}
export const findOne=async({model,filter,options={}}={})=>{
    return await model.findOne(filter,options)
}
export const findById=async({model,ID,options={}}={})=>{
    return await model.findById(ID,options)
}
export const findByIdAndCreate=async({model,id,update,options={}}={})=>{
    return await model.findByIdAndUpdate(id,update,{new:true,...options})
}