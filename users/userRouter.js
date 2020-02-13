const express = require('express');
const userData = require("./userDb");
const postData = require("../posts/postDb")

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic! ✔
  const { body } = req;
  console.log(body)

  userData.insert(body)
      .then(newUser => {          
            res.status(200).json(newUser)
          })
      .catch(err => {
        console.log(`this is error from new user post`)
        res.status(500).json({ error: "Creating new user FAILED" })
      })  
             
})

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
});

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
    //gets individual user 
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

router.get('/:id/posts', validatePost, (req, res) => {
  // gets all user's posts 
  const { id } = req.params;

  postData.getById(id)
  .then(user => {
    !user
      ? res.status(404).json({ error: "No user by this id exists"})
      : userData.getUserPosts(id)
        .then(post => {
          !post
            ? res.status(404).json({ error: "No post by this id exists"})
            : res.status(200).json(post)
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: "Server Error 1"})
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Server Error getting user's posts" })
    })  
});

router.delete('/:id', validateUserId, (req, res) => {
  // deletes user! test with middleware
  const { id } = req.params;
  userData.remove(id)
  .then(user => {
    !user
    ? res.status(404).json({ error: "No user by this id exists"})
    : res.status(204).json(user)
  })
  .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Server Error Deleting"})
  });
})

router.put('/:id', (req, res) => {
  // do your magic!
});







//custom middleware

function validateUserId(req, res, next){
  // validates all routes that require an ID  
  const { id } = req.params;

  !id || isNaN(parseInt(id)) ?
    res.status(400).json({ message: "invalid user id" }) : next()  
}

function validateUser(req, res, next) {
  // validates all POST requests for new user (not post)  
  const { body } = req
  !body ? res.status(400).json({ message: "missing user data" }) :
  !body.name ? res.status(400).json({ message: "missing required name field" }) : 
  next();
 
}

function validatePost(req, res, next) {
  // validates all POST requests for new post (not user)
  const { body } = req;
  !body ? res.status(400).json({ message: "missing user data" }) :
    !body.text ? res.status(400).json({ message: "missing required name field" })
    : next();




}

module.exports = router;
