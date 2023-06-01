import 'dotenv/config';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieparser from 'cookie-parser';
//import morgan from 'morgan';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import multer from 'multer';

// Create an Express app
const app = express();

// Middleware
//app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin:true, credentials:true }));
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

const upload = multer({ storage: storage });


// Define routes
app.get('/posts', async (req, res) => {
  await posts.find({}).populate('meta.author', 'name')
  .then((posts) => {
    res.send(posts);
  })
  .catch(() => {
    res.send();
  })
})

//Filter post with param(category)
app.get('/posts/:category', async (req, res) => {
await posts.find({'meta.category': req.params.category}).populate('meta.author', 'name')
.then(categoryposts => {
  res.send(categoryposts)
})
.catch(() => res.send())
})

app.get('/post/:id', async (req, res) => {
  await posts.findById(req.params.id).populate('meta.author', 'name').populate('comments.user', 'name')
  .then((post) => res.send(post))
  .catch((error) => res.send(error))
})

//Create new post
app.post('/post/newpost', upload.single('image'), async (req, res, next) => {
  const post = new posts({
    image: {
      data: fs.readFileSync(path.join(__dirname) + "/public/media/uploads/" + req.file.filename),
      contentType: 'image/jpeg'
    },
    title: req.body.title,
    body: req.body.body.toString(),
    meta: {
      category: req.body.category,
      author: req.body.author,
      featured: req.body.featured,
    }
  })

  await post.save()
  .then(()=>{
    res.send();
  })
})

app.patch('/post/updatelikes', async (req, res) => {
  await posts.findByIdAndUpdate(req.body.id, {'meta.likes': req.body.likes})
  .then(res.send());
})

app.patch('/post/updateViews', async (req, res) => {
  let id = req.body.id;
  !req.cookies[id] ?
  await posts.findByIdAndUpdate(id, {$inc: {'meta.views': 1}})
  .then(()=>{
    res.cookie(id, "Viewed").send();
  }):
  res.send();
})

app.patch('/post/newcomment', async (req, res) => {
  await posts.findByIdAndUpdate(req.body.post, {$push: {comments: {content: req.body.comment, user: req.body.user}}})
  .then(res.send());
})

app.post('/login', async (req, res) => {
  let user = await users.findOne({email: req.body.email});
  if (!user || !user.isActive) return res.status(404).send('Invalid email address or account not activated!')

  const validPassword = await bcrypt.compare(req.body.password, user.pswdhash);
  if (!validPassword) return res.status(403).send('Invalid Password!')

  const data = {
    user: {
      id: user._id,
    }
  }

  const authtoken = jwt.sign(data, JWT_SECRET)
  res.send({id: user._id, name: user.name, isAdmin: user.isAdmin, token:authtoken});
})

app.post("/users/newuser", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const securepass = await bcrypt.hash(req.body.password, salt);
  const user = new users ({
      name: req.body.name,
      email: req.body.email,
      pswdhash: securepass
  })

  await user.save()
  .then(() => {
    res.send();
  })
  .catch((error) => {
      res.status(400).send()
  })
})

// Connect to MongoDB database
const db = process.env.CONNECTION_STRING;
connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((error) => {
    console.error('Connection to database unsuccessful\n', error);
  });

// Start the server
const port = process.env.MONITOR_PORT || 3001;
app.listen(port, () => {
  console.debug(`Server is running on port ${port}`);
});
