import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats/nats-wrapper';

it('Returns 404 if provided id doesnt exists',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const {cookie} = global.signin()
    const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',cookie)
    .send({
        title : 'sdasd',
        price : 20
    })

    expect(res.status).toEqual(404)
})

it('401 if user is not authenticated',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title : 'sdasd',
        price : 20
    })
    expect(res.status).toEqual(401)
})

it('401 if user doestnt own the ticket',async ()=>{
    const {cookie} = global.signin()
    let title = 'Show'
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })

    console.log(res.body.id)
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',global.signin().cookie)
    .send({
        title : 'sdasd',
        price : 20
    })
    .expect(401)
})


it('400 if user provides invalid title or price',async ()=>{
    const {cookie} = global.signin()
    let title = 'Show'
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',global.signin().cookie)
    .send({
        title : 'sdasd',
        price : -20
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',global.signin().cookie)
    .send({
        title : '',
        price : 20
    })
    .expect(400)
})

it('Updates tickets with valid inputs',async ()=>{
    const {cookie} = global.signin()
    let title = 'Show'
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title,
        price : 100
    })
    .expect(200)
})

it('publishes an event', async()=>{

    const {cookie} = global.signin()
    let title = 'Show'
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title,
        price : 100
    })
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})