import express from 'express';
import { currentUser } from 'ticket-app-microservices-common';
import { requireAuth } from 'ticket-app-microservices-common';

const router = express.Router()

router.get('/api/users/currentuser',currentUser,(req,res)=>{

        res.status(200).send({currentUser : req.currentUser || null})
    
})

export {router as currentUserRouter}