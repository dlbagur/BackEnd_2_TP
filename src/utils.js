import bcrypt from "bcrypt"

export const generaHash=password=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash)