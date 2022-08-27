import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'

it('Returns 404 if ticket is not found',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
            .get(`/api/tickets/${id}`)
            .send({})
            .expect(404)
})

it('Returns 200 if ticket is found',async ()=>{
    const {cookie} = global.signin()
    let title = 'Show',price = 10

    let res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title ,
        price
    })
    .expect(201)

    let ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send({})
    .expect(200)

    expect(ticketRes.body.title).toEqual(title)
    expect(ticketRes.body.price).toEqual(price)
})

