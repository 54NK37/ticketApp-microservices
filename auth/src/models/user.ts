import mongoose from 'mongoose'
import { Password } from './../services/password';

// An interface for user attributes provided by user to check datatype
interface UserAttrs
{
    email:string,
    password:string
}

// document represents entry within collection
// Properties for single user document. To avoid adding of other keys by mongoose,
// and accessing them from backend as user.email
interface UserDoc extends mongoose.Document {
    email : string,
    password:string
}

// model represents collection
// with ts+mongoose we can send any attributes to new User() model.
// To solve this issue we create above interface and
// below custom function build() is registered to model as shown below
// Properties for user model.To avoid adding of other keys by user.
interface UserModel extends mongoose.Model<UserDoc>
{
    build(attrs : UserAttrs) : UserDoc
}

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    toJSON:{        //it is called when JSON.stringify() is called while sending res.
        transform(doc,ret)
        {
            ret.id = ret._id    // to rename _id to id so that we have same name among all diffrent lang services
            delete ret._id
            delete ret.__v
            delete ret.password
        }
    }
})

// async function so that this is current model and not calling function
userSchema.pre('save',async function (done) {
    if(this.isModified('password')) //hash only if password is modified.Incase we are updating User.
    {
        const hashed =await Password.toHash(this.get('password'))
        this.set('password',hashed)
    }
    done()
})

// to check datatype of attrs 
userSchema.statics.build=(attrs : UserAttrs)=>{
    return new User(attrs)
}

// mongoose generic UserDoc and UserModel, with return type as UserModel
const User = mongoose.model<UserDoc,UserModel>('User',userSchema)

export {User}