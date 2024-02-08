import 'dotenv/config.js';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import morgan from 'morgan';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import multer from 'multer';

// Create an Express app
const app = express();

// Middleware
//app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
}));
app.use(cookieparser());

// Models
import posts from './models/posts.js';
import users from './models/users.js';

//Constants
const JWT_SECRET = "Afriscope Dev Blog";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/media/uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage, limits:{fieldSize: 25 * 1024 * 1024} });


// Define routes
app.get('/posts', async (req, res) => {
  const {sort} = req.query
  await posts.find({}).select('-body').sort(`${sort}`).populate('meta.author').populate('comments.user')
  .then((posts) => {
    res.send(posts);
  })
  .catch(() => {
    res.send();
  })
})

app.get('/posts/published', async (req, res) => {
  await posts.find({isApproved:true}).select('-body').sort('-created').populate('meta.author').populate('comments.user')
  .then((posts) => {
    res.send(posts);
  })
  .catch(() => {
    res.send();
  })
})

//Filter post using param(category) and by approval status
app.get('/posts/:slug', async (req, res) => {
await posts.find({isApproved: true, 'meta.category': req.params.slug})
.select("-_id -__v")
.populate('meta.author', 'name')
.then(posts => {
  res.send(posts)
})
.catch(() => res.send())
})

app.get('/post/:slug', async (req, res) => {
  const post = await posts.findOne({'title': req.params.slug.split('-').join(' ')}, {__v: 0 })
  .collation({locale: 'en', strength: 2})
  .populate('meta.author', 'name isActive')
  .populate('comments.user', 'name isActive')
  .then((post) => {
    res.send(post)
  })
  .catch((error) => {
    res.send(error)
  })
})

//Create new post
app.post('/post/newpost', upload.single('image'), async (req, res, next) => {
  const post = new posts({
    image: {
      data: fs.readFileSync(path.join(__dirname) + "/public/media/uploads/" + req.file.filename),
      contentType: 'image/jpeg'
    },
    title: req.body.title,
    intro: req.body.intro,
    body: req.body.body.toString(),
    meta: {
      category: req.body.category,
      author: req.body.author,
      featured: req.body.featured,
      tags: req.body.tags
    },
    isApproved: req.body.approved
  })

  await post.save()
  .then(()=>{
    res.send();
  })
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

app.patch('/post/togglestatus', async (req, res) => {
  const {id, property, status} = req.body
  let post = await posts.findByIdAndUpdate(id,
    {$set:
      {[property]: status}
    })
  if(!post) return res.status(404).send('Error updating post');
  res.send('Post updated successfully')
})

app.patch('/post/comment', async (req, res) => {
  try{
    const token = req.headers.cookie.split('; ').find(row => row.startsWith('authorization_token='))?.split('=')[1]
    const verifyToken = jwt.verify(token, JWT_SECRET)
    const user = await users.findById(verifyToken.user.id)
    if(user && (user.type === "Administrator"||user.type === "Editor"||user.type === "Author"||user.type === "Contributor")){
      let comment = await posts.findByIdAndUpdate(req.body.id,
        {$push:
          {comments:
            {content: req.body.comment, user: req.body.user}
          }
        })
      if(!comment) return res.status(404).send('Error Posting Comment');
      res.send('Comment successfully posted')
    }
  }catch(error){
    res.status(401).send('Failed to post comment - unauthorized')
    }
})


app.patch('/post/comment/togglestatus', async (req, res) => {
  const {postId, commentId, status} = req.body
  await posts.findOneAndUpdate({
    _id:postId, 'comments._id':commentId
  },{
    $set: {
      'comments.$.approved': status
    }
  })
  .then((data) => {
    res.send(data)
  })
  .catch((error) => {
    console.log(error.message)
  })
})

app.delete('/post/:postId', async(req, res) => {
  const postId = req.params.postId
  await posts.findByIdAndDelete(postId)
  .then(() => {
    res.send()
  })
  .catch((error)=>{
    console.log(error)
    res.send()
  })
})


app.delete('/post/:postId/:commentId', async(req, res) => {
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
  .catch((error)=>{
    console.log(error)
    res.send()
  })
})


app.get('/users', async(req, res) => {
  await users.find().select(['-pswdhash', '-__v'])
  .then((users)=>{
    res.send(users)
  })
})

app.post('/user/login', async (req, res) => {
  let user = await users.findOne({email: req.body.email});
  if (!user) return res.status(404).send("Email address doesn't exist! Sign up?")
  if (!user.isActive) return res.status(404).send('Account not activated! Contact Administrator.')

  const validPassword = await bcrypt.compare(req.body.password, user.pswdhash);
  if (!validPassword) return res.status(403).send('Invalid Password! Please Try Again.')

  const data = {
    user: {
      id: user._id
    }
  }

  const authtoken = jwt.sign(data, JWT_SECRET)
  res.cookie('authorization_token', authtoken, {expires: req.body.remember_me?new Date(Date.now()+7*24*3600000):"", sameSite: "None", secure: true}).send({id: user._id, name: user.name, type: user.type, isAdmin: user.isAdmin});
})

app.post("/user/newuser", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const securepass = await bcrypt.hash(req.body.password, salt);
  const user = new users ({
      name: req.body.name,
      email: req.body.email,
      pswdhash: securepass,
      type: req.body.type,
      isActive: req.body.isActive
  })

  await user.save()
  .then(() => {
    res.send();
  })
  .catch((error) => {
    if(error.code === 11000) {
      res.status(409).send(`User already exist with supplied email. Sign in?`)
    }else{
      res.status(500).send(`Failure signing up. Please try again.`)
    }
  })
})

app.patch('/user', async (req, res) => {
  await users.findByIdAndUpdate(req.body.id, {'isActive': req.body.status})
  .then(()=>{
    res.send()
  });
})


app.delete('/user/:userId', async(req, res) => {
  const userId = req.params.userId
  await users.findByIdAndDelete(userId)
  .then(() => {
    res.send()
  })
  .catch((error)=>{
    console.log(error)
    res.send()
  })
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
const port = process.env.MONITOR_PORT || 3001;
try{
  app.listen(port, () => {
    console.debug(`Server is running on port ${port}`);
  })
}catch (error) {
  console.log(error)
}
