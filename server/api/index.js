import 'dotenv/config.js';
import fs, { readSync } from 'fs';
import path from 'path';
const __dirname = path.resolve();

import express from 'express';
import { ObjectId } from 'mongodb'
import { connect } from 'mongoose';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { json } from 'express';

// Create an Express app
const app = express();

//Constants
app.locals.secret = 'yM3^iJ7?hR2&oA'

// Middleware
//app.use(morgan('tiny'));
app.use(express.urlencoded({limit: '25mb', extended: false }));
app.use(express.json({limit: '25mb'}));
app.use(cors({
  origin: ['http://localhost','https://afriscope.vercel.app'],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  headers: ['Authorization', 'Content-Type']
}));
app.use(cookieparser());

// Models
import posts from './models/posts.js';
import users from './models/users.js';

// Middlewares
const authenticate = async (req, res, next) => {
  const session_token = req.cookies['session_token']
  try{
    const token = jwt.verify(session_token, app.locals.secret)
    res.locals.user = await users.findOne({'_id': token.user.id, isActive: true})
    next()
  }catch(error){
    next(error)
  }
}

const postsCount = async (req, res, next)=> {
  await posts.countDocuments({})
  .then((count)=>{
    res.locals.count = count
    next()
  })
  .catch(next)
}

//User Routes
app.post("/user/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const securepass = await bcrypt.hash(req.body.password, salt);
  const user = new users ({
      name: req.body.name,
      email: req.body.email,
      pswdhash: securepass,
      role: req.body.role,
      isActive: req.body.isActive
  })

  await user.save()
  .then(() => {
    res.sendStatus(200);
  })
  .catch((error) => {
    if(error.code === 11000) {
      res.status(409).send(`User already exist with supplied email.<br /> <i class="fas fa-circle-arrow-left fa-beat"></i> Sign in`)
    }else{
      res.status(500).send(`Failure signing up. Please try again.`)
    }
  })
})

app.post('/user/login', async (req, res) => {
  let user = await users.findOne({email: req.body.email});
  if (!user) return res.status(404).send(`Email address doesn't exist! Sign up <i class="fas fa-circle-arrow-right fa-beat"></i>`)
  if (!user.isActive) return res.status(404).send('Account not activated! Contact Administrator.')

  const validPassword = await bcrypt.compare(req.body.password, user.pswdhash);
  if (!validPassword) return res.status(403).send('Invalid Password! Please Try Again.')

  const payload = {
    user: {
      id: user._id
    }
  }

  const session_token = jwt.sign(payload, app.locals.secret)
  return res.cookie('session_token', session_token, {expires: req.body.remember_me?new Date(Date.now()+7*24*3600000):"", sameSite: "None", secure: true}).send({id: user._id, name: user.name, avatar: user.avatar, role: user.role, isAdmin: user.isAdmin});
})

app.get('/user/auth', authenticate, (req, res, next)=>{
  const user = res.locals.user
  const path = req.query.q
  if(user!==undefined){
    if(path.includes('administrator') && !user.isAdmin){
        throw {status: 403, message: 'Not Authorized'}
      }
      return res.sendStatus(200)
    }
    throw {status: 403, message: 'Not Authorized'}
})

app.get('/users', authenticate, async(req, res, next) => {
  await users.find({}).select(['-pswdhash', '-__v'])
  .then((users)=>{
    return res.send(users)
  })
  .catch(next)
})

app.get('/user/profile', authenticate, (req, res, next) => {
  const user = res.locals.user;
  return res.send({id: user._id, name: user.name, avatar: user.avatar, role: user.role, isAdmin: user.isAdmin});
})

app.get('/user/:userId', authenticate, (req, res, next) => {
  const user = res.locals.user;
  if(req.params.userId && user){
    return res.send({id: user._id, name: user.name, avatar: user.avatar, role: user.role, isAdmin: user.isAdmin});
  }
  throw {status: 403, message: 'Not Authorized'}
})


app.patch('/user', async (req, res, next) => {
  await users.findByIdAndUpdate(req.body.id, {'isActive': req.body.status})
  .then(()=>{
    res.send()
  })
  .catch(next)
})

app.delete('/user/:userId', async(req, res, next) => {
  const userId = req.params.userId
  await users.findByIdAndDelete(userId)
  .then(() => {
    res.send()
  })
  .catch(next)
})

app.post('/user/profile', authenticate, async (req, res, next) => {
  const user = res.locals.user;
  user.avatar = req.body.avatar
  await user.save()
  .then(()=>{
      return res.send({id: user._id, name: user.name, avatar: user.avatar, role: user.role, isAdmin: user.isAdmin})
  })
  .catch(next)
})

// Post routes
//Write new post
app.post('/writepost', authenticate, async (req, res, next) => {
  const user = res.locals.user
  if(user && user.role !== 'Subscriber') {
    const post = new posts({
      image: req.body.image,
      title: req.body.title,
      intro: req.body.intro,
      body: req.body.body.toString(),
      meta: {
        description: req.body.metaDescription,
        category: req.body.category,
        author: req.body.author,
        featured: req.body.featured,
        tags: req.body.tags.split(",").forEach(el => el.trim())
      },
      isApproved: req.body.approved
    })
    await post.save()
    .then(()=>{
      return res.send();
    })
    .catch(next)
  }else{
    throw {status: 403, message: 'Not Authorized'}
  }
})

app.get('/posts', postsCount, async (req, res, next) => {
  const {sort, limit} = req.query
  await posts.find({})
  .select('-body')
  .limit(limit?`${limit}`:0)
  .sort(`${sort}`)
  .populate('meta.author')
  .populate('comments.user')
  .then((posts) => {
    res.send(posts);
  })
  .catch(next)
})

app.get('/posts/author', async (req, res, next) => {
  const {sort, limit, postId, authorId} = req.query
  authorId !== 'undefined' &&
  await posts.find({$and: [{'meta.author':authorId},{'_id': {$ne: postId}},{'isApproved': true}]})
  .select('-body').limit(limit?`${limit}`:0)
  .sort(`${sort}`)
  .populate('meta.author')
  .populate('comments.user')
  .then((posts) => {
    res.send(posts);
  })
  .catch(next)
})

app.get('/posts/search', async (req, res, next) => {
  const {q, author, category} = req.query
  await posts.find({$and: [{ $text : { $search : `${q}` }},{'isApproved': true}]})
  .select("-__v -body")
  .populate('meta.author', 'name')
  .then(posts => {
    return res.send(posts)
  })
  .catch(next)
})

app.get('/posts/:grouping', async (req, res, next) => {
  const {sort, limit, query, postId} = req.query
  if(query === 'undefined'||query === undefined) {
    return next('route')
  }
  await posts.find({$and: [{'meta.tags':{$in: query?.split(',')}},{'_id':{$ne:postId}},{'isApproved': true}]})
  .collation({locale: 'en_US', strength: 2})
  .select('-__v -body')
  .limit(limit?`${limit}`:0)
  .sort(`${sort}`)
  .populate('meta.author')
  .populate('comments.user')
  .then((posts) => {
    return res.send(posts);
  })
  .catch(next)
})

app.get('/posts/:category', async (req, res, next) => {
  const {sort, limit} = req.query
  await posts.find(['sports', 'fashion', 'technology', 'lifestyles','education','general'].includes(req.params.category)?{$and:[{'meta.category': req.params.category},{'isApproved': true}]}:{'isApproved':true})
  .select("-__v -body")
  .limit(limit?limit:0)
  .sort(sort)
  .populate('meta.author', 'name')
  .then(posts => {
    return res.send(posts)
  })
  .catch(next)
})

app.get('/posts/:category/:slug', async (req, res, next) => {
  await posts.findOne({$or:[{'_id': new ObjectId(req.query.id?.length<12?"123456789012":req.query.id)},{'title': req.params.slug.split('-').join(' ')}]}, {__v: 0 })
  .collation({locale: 'en_US', strength: 2})
  .populate('meta.author', 'avatar name isActive')
  .populate('comments.user', 'avatar name isActive')
  .then((post) => {
    if(post === null||!post.isApproved) {
      throw {status: 404, message: 'Not Found'}
    }
    return res.send(post)
  })
  .catch(next)
})

app.patch('/post/likes', async (req, res) => {
  await posts.findByIdAndUpdate(req.body.id, {'meta.likes': req.body.likes})
  .then(()=>{
    res.send()
  });
})

app.patch('/post/views', async (req, res) => {
  let id = req.body.id;
  !req.cookies[id] ?
  await posts.findByIdAndUpdate(id, {$inc: {'meta.views': 1}})
  .then(()=>{
    res.cookie(id, "Viewed", {sameSite: "None", secure: true}).send();
  }):
  res.send();
})

app.patch('/post/comment', authenticate, async (req, res) => {
  const user = res.locals.user
  const {postId, content, commentId} = req.body
  try{
    if(user == null ) {
      return res.status(401).send('Failed to post comment - unauthorized')
    }
    let post
    if(commentId !== null){
      post = await posts.findOneAndUpdate({_id:postId, 'comments._id': commentId},
        {
          $set: {
            'comments.$.content': content
          }
        },{returnDocument: 'after'}
      )
    }else{
      post = await posts.findByIdAndUpdate(postId, {
        $push: {
          comments: {
            content: content,
            user: user
          }
        }
      },{returnDocument: 'after'} )
    }
    if(!post) return res.status(404).send('Error Posting Comment');
    return res.status(200).send('Comment Operation Successful!')
  }catch(error){
    res.status(500).send('Failed to post comment')
    }
})

//Administrator
app.patch('/post/togglestatus', async (req, res) => {
  const {id, property, status} = req.body
  let post = await posts.findByIdAndUpdate(id,
    {$set:
      {[property]: status}
    })
  if(!post) return res.status(404).send('Error updating post');
  res.send('Post updated successfully')
})

app.patch('/post/comment/togglestatus', async (req, res, next) => {
  const {postId, commentId, status} = req.body
  await posts.findOneAndUpdate({
    _id:postId, 'comments._id':commentId
  },{
    $set: {
      'comments.$.approved': status
    }
  })
  .then(() => {
    res.sendStatus(200)
  })
  .catch(next)
})

app.delete('/post/:postId', async(req, res, next) => {
  const postId = req.params.postId
  await posts.findByIdAndDelete(postId)
  .then(() => {
    res.send()
  })
  .catch(next)
})


app.delete('/post/:postId/:commentId', async(req, res, next) => {
  const {postId, commentId} = req.params
  await posts.findByIdAndUpdate(postId, {
    $pull: {
      comments:{
        _id: commentId
      }
    }
  })
  .then(() => {
    res.send()
  })
  .catch(next)
})


app.use((err, req, res, next)=>{
  if(err && err.status){
    return res.status(err.status).send(err.message)
  }else if(err instanceof jwt.JsonWebTokenError) {
    return res.status(401).send('Expired Or Invalid Session Token.')
  }
  console.log(error)
  return res.status(500).send('There was an error.')
})


// Connect to MongoDB database
const db = process.env.CONNECTION_STRING;
connect(db)
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((error) => {
    console.error('Connection to database unsuccessful\n', error);
  });

// Start the server
const port = process.env.MONITOR_PORT;
try{
  const listening = app.listen(port, () => {
    console.debug(`Server is running on port ${port}`);
  })
  listening.keepAlive = true
}catch (error) {
  console.log(error)
}
