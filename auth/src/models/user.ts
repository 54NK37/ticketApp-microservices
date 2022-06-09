import mongoose from 'mongoose'
import { Password } from './../services/password';

// An interface for user attributes provided by user
interface UserAttrs
{
    email:string,
    password:string
}

// with ts+mongoose we can send any attributes to new User() model.
// To solve this issue we create above interface and
//  below custom function build() is registered to model as shown below
// Properties for user model.To avoid adding of other keys by user.
interface UserModel extends mongoose.Model<UserDoc>
{
    build(attrs : UserAttrs) : UserDoc
}

// Properties for single user document. To avoid adding of other keys by mongoose,
// and accessing them from backend as user.email
interface UserDoc extends mongoose.Document {
    email : string,
    password:string
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
})

userSchema.pre('save',async function (done) {
    if(this.isModified('password')) //hash only if password is modified.Incase we are updating User.
    {
        const hashed =await Password.toHash(this.get('password'))
        this.set('password',hashed)
    }
    done()
})

userSchema.statics.build=(attrs : UserAttrs)=>{
    return new User(attrs)
}

// mongoose generic UserDoc and UserModel, with return type as UserModel
const User = mongoose.model<UserDoc,UserModel>('User',userSchema)

export {User}