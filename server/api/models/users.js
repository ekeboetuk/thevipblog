import {Schema, model} from 'mongoose';

const options = {
    virtuals: {
        timestamp: {
            get() {
                return this._id.getTimestamp()
            }
        },
        isAdmin: {
            get() {
                return this.type === "Administrator"
            }
        }
    },
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
}

const userschema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: [/afriscope\.ng$/, "Invalid e-mail address"],
        required: true,
        unique: true,
        lowercase: true
    },
    pswdhash: {
        type: String,
        required: true,
    },
    about: {
        type: String
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
    posts: {
        type: Schema.Types.ObjectId,
        ref: "posts"
    }
}, options);

const users = model('user', userschema);
export default users;