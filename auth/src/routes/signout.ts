import express from 'express';

const router = express.Router()

router.post('/api/users/signout',(req,res)=>{
    res.send({
        'name' : 'sanket'
    })
})

export {router as signoutRouter}