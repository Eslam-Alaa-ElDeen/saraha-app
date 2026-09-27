import bcrypt from "bcrypt"


export const Hash=async(plainText,salt)=>{
    const cipherText=await bcrypt.hash(plainText,salt)
    return cipherText;
}
export const Compare=async(plainText,cipherText)=>{
    const match=await bcrypt.compare(plainText,cipherText)
    return match;
}

