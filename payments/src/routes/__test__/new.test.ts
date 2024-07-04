import mongoose from "mongoose"
import { app } from "../../app"
import request from "supertest"
import { Order, OrderStatus } from "../../models/order"
import { stripe } from '../../stripe';
import { Payment } from "../../models/payment";

// Mocking it will import from __mock__ and not the real one
jest.mock('../../stripe')

it('Should 404 for purchasing order that doesnt exists', async () => {
    const { cookie } = global.signin()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'sdfsdf',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('Should 401 for purchasing order that doesnt belong to user', async () => {
    const { cookie } = global.signin()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'sdfsdf',
            orderId: order.id
        })
        .expect(401)
})

it('Should 400 for purchasing order that is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const { cookie } = global.signin(userId)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'sdfsdf',
            orderId: order.id
        })
        .expect(400)
})

it('Create a charge with 204 with valid data', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const { cookie } = global.signin(userId)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 200,
        status: OrderStatus.Created
    })

    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)

    const chargeOpt = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOpt.source).toEqual('tok_visa')
    expect(chargeOpt.amount).toEqual(200 * 100)
    expect(chargeOpt.currency).toEqual('inr')

    const payment = await Payment.findOne({orderId: order.id})
    expect(payment).not.toBeNull()
})