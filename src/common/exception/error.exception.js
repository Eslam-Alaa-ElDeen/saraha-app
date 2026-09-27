export const ApplicationException=({
    message="app error",
    options={
        cause:{
            status:400
        }
    }
}={})=>{
    throw new Error(message,options)
}

export const ConflictException=({
    message="conflict on data",
    options={
        cause:{
            status:409
        }
    }
}={})=>{
    throw new Error(message,options)
}

export const NotFoundException=({
    message="not found",
    options={
        cause:{
            status:404
        }
    }
}={})=>{
    throw new Error(message,options)
}

export const UnAuthorizedException=({
    message="un authorized",
    options={
        cause:{
            status:401
        }
    }
}={})=>{
    throw new Error(message,options)
}

export const ForbiddenException=({
    message="forbidden",
    options={
        cause:{
            status:403
        }
    }
}={})=>{
    throw new Error(message,options)
}