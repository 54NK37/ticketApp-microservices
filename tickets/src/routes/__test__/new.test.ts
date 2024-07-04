import request from 'supertest'
import {app} from '../../app'
import { Ticket } from '../../models/tickets'
import { natsWrapper } from '../../nats-wrapper';

it('Has a route handler listening to /api/tickets for posts request',async ()=>{
    const res = await request(app)
    .post('/api/tickets')
    .send({})

    expect(res.status).not.toEqual(404)
})

it('Can only be accessed if the user is signed in',async ()=>{
    const res = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('Returns other than 401 if the user is signed in',async ()=>{
    const {cookie} = global.signin()
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({})

    expect(res.status).not.toEqual(401)
})

it('Return an error if invalid title is provided',async ()=>{
    const {cookie} = global.signin()
    await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title : '',
        price : 19
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        price : 19
    })
    .expect(400)
})
it('Return an error if invalid password is provided',async ()=>{
    const {cookie} = global.signin()
    await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title : 'Show',
        price : -10
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title : 'Show'
    })
    .expect(400)
})
it('Create a ticket with valid inputs',async ()=>{
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const {cookie} = global.signin()
    let title = 'Show'
    const res = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })
    .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(10)
    expect(tickets[0].title).toEqual(title)
})

it('publishes an event', async()=>{

    const title = 'asasdfa'
    const {cookie} = global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title,
        price : 10
    })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})