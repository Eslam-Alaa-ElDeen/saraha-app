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
export const findByIdAndDelete=async({model,ID,options={}}={})=>{
    return await model.findByIdAndDelete(ID,options)
}

export const find = async ({ model, filter = {}, options = {} } = {}) => {
    if (options?.search) {
        filter.content = {
            $regex: options.search,
            $options: "i"
        };
    }

    let query = model.find(filter);

    const count = await model.countDocuments(filter);
    const totalPages = options?.limit ? Math.ceil(count / options.limit) : 1;

    if (options?.page && options?.limit) {
        const page = Math.max(parseInt(options.page) || 1, 1);
        const limit = Math.max(parseInt(options.limit) || 10, 1);
        const skip = (page - 1) * limit;

        query.skip(skip).limit(limit);
    } else {
        if (options?.limit) query.limit(options.limit);
        if (options?.skip) query.skip(options.skip);
    }

    if (options?.sort) query.sort(options.sort);
    if (options?.populate) {
        query.populate({ path: "senderId", select: "firstName lastName image" });
    }

    const dataInfo={
        count,
        totalPages,
        page: options?.page || 1,
        limit: options?.limit || count
    }

    const docs= await query.exec();
    return {
        dataInfo,
        ...docs
    };
};