const express = require('express');
const userData = require("./userDb");
const postData = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic! ✔
  const { body } = req;
  console.log(`from user post`, body)

  userData
    .insert(body)
    .then(newUser => {          
          res.status(201).json(newUser)
        })
    .catch(err => {
      console.log(`this is error from new user post`, err)
      res.status(500).json({ error: "Creating new user FAILED" })
    })               
})

router.get('/', (req, res) => { 
  // gets all users✅
  userData.get()
    .then(users => {
      res.status(200).json(users)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Retrieving all users data FAILED"})
    })
  
});

router.get('/:id', validateUserId, (req, res) => {
    //gets individual user ✔
    const { id } = req.params;
    userData
      .getById(id)
      .then(user => {
        !user
          ? res.status(404).json({ error: "No user by this id exists"})
          : res.status(200).json(user)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Server Error"})
      })
});

router.delete('/:id', validateUserId, (req, res) => {
  // deletes user! test with middleware ✔
  
  const { id } = req.params;
  console.log(req.params)

  userData
    .remove(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Server Error"})
    })
})

router.get('/:id/posts', (req, res) => {
  // Get all of an individual user's posts
  
  const { id } = req.params;
  const post = { ...req.body, user_id: id };

  userData
    .getUserPosts(post.user_id)
    .then(posts => {
      console.log(`post2`, posts)
      !post ?
        res.status(404).json({ error: "no posts for this user exist"}) :      
        res.status(200).json(posts)      
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "WTF!"})
    })      
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  console.log(`req body 1`,req.body)
  const { id } = req.params;
  userData
    .update(id, req.body)
    .then(edit => {
      console.log(`edit 2`, edit)
      res.status(202).json(edit)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be modified." })
    })
});



// TO DO!
router.post('/:id/posts', validatePost, (req, res) => {
  // user creates a new post
  const { id } = req.params;
  const post = { ...req.body, user_id: id };  
  console.log(`BODY from user post`, post)

  postData
    .insert(post)
    .then(newPost => {          
          res.status(201).json(newPost)
        })
    .catch(err => {
      console.log(`this is error from new user post`, err)
      res.status(500).json({ error: "Creating new POST FAILED" })
    })    
});


//custom middleware

function validateUserId(req, res, next){
  // validates all routes that require an ID  
  const { id } = req.params;

  !id || isNaN(parseInt(id)) ?
    res.status(400).json({ message: "invalid user id" }) : next()  
}

function validateUser(req, res, next) {
  // validates all POST requests for new user (not new user posts)  
  const { body } = req;
  !body? 
    res.status(400).json({ message: "missing user data" }) :
    !body.name ? res.status(400).json({ message: "missing required name field" }) : 
    next();
  
}

function validatePost(req, res, next) {
  // validates all POST requests for new post (not new user)
  const { id } = req.params;
  const post = { ...req.body, user_id: id };  
  console.log(`validate post:`, post)

  !post ? 
    res.status(400).json({ message: "missing user data" }) 
    : !post.text 
    ? res.status(400).json({ message: "missing required text field" })
    : next();
}

module.exports = router;
