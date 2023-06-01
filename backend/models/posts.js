import { Schema, model } from 'mongoose';

import users from './users.js'

const options = {
    virtuals: {
        timestamp: {
            get() {
                return this._id.getTimestamp()
            }
        },
        slug: {
            get() {
                return this.title.split(' ').join('-')
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

const postschema = Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: [{
        content: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: users,
            required: true
        },
        approved: {
            type: Boolean,
            default: false
        },
        votes: Number
    }],
    meta: {
        category: {
            type: String,
            default: "uncategorized",
            enum: ["uncategorized","sports","lifestyles","fashion"],
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: users,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        },
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        }
    }
}, options);

const posts = model('post', postschema);
export default posts;