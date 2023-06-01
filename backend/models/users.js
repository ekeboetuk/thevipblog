import {Schema, model} from 'mongoose';

const userschema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pswdhash: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Administrator", "Author", "Editor",  "Contributor","Subscriber"],
        default: "Subscriber",
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: "posts"
    }
});

const users = model('user', userschema);
export default users;