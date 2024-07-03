import mongoose from "mongoose"
import { app } from "../../app"
import request from "supertest"
import { Order, OrderStatus } from "../../models/order"

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