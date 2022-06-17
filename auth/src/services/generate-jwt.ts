import jwt from 'jsonwebtoken'

export const generateJwt = (user:any)=>{
    // generate jwt
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)

    return { jwt: userJwt }
}