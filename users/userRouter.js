const express = require('express');
const userData = require("./userDb");

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => { 
  // do your magic!✅
  userData.get()
    .then(users => {
      res.status(200).json(users)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Retrieving all users data FAILED"})
    })
  
});

router.get('/:id', (req, res) => {
  // do your magic! ✅
  const { id } = req.params;
  userData.getById(id)
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

router.get('/:id/posts', (req, res) => {
  // do your magic!
  const { id } = req.params;

  userData.getById(id)
  .then(user => {
    !user
      ? res.status(404).json({ error: "No user by this id exists"})
      :
      userData.getUserPosts(id)
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
      res.status(500).json({ error: "Server Error 2"})
  })  
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});







//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
