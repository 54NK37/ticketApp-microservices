import express from 'express';

const router = express.Router()

router.post('/api/users/signin',(req,res)=>{
    res.send({
        'name' : 'sanket'
    })
})

export {router as signinRouter}