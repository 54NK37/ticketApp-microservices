import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from 'ticket-app-microservices-common'

export { OrderStatus }

interface OrderAttrs {
    id: string
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})


// Optimistic concurrency control
OrderSchema.set('versionKey', 'version')

OrderSchema.plugin(updateIfCurrentPlugin)
OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        status: attrs.status,
        userId: attrs.userId
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order }