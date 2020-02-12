const express = require('express');
const userData = require("./userDb");

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
  !req.body.name
  ? res.status(400).json({ error: "Please include a name"})
  : userData.insert(req.body)
    .then(({id}) => {
        userData.getById(id)
        .then(newUser => {
          res.status(201).json(newUser)
        })
        .catch(err => {
          console.log(`this is error from findById`, err)
          res.status(500).json({ error: "Creating new user FAILED" })
        }) 
      }) 
    .catch(err => {
      console.log(`this is error from findById`, err)
      res.status(500).json({ error: "Creating new user FAILED" })
    })  
})

router.post('/:id/posts', (req, res) => {
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

router.get('/:id',  validateUserId("Nic"), (req, res) => {
  // gets individual user ✅
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

router.get('/:id/posts', validateUserId("Nic"), (req, res) => {
  // gets all user's posts ✅
  const { id } = req.params;

  userData.getById(id)
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

router.delete('/:id', (req, res) => {
  // deletes user! ✅
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

function validateUserId(user){
  // validates all routes that require an ID
  console.log(`this is validateUserId`, user)
  return (req, res, next) => {
    const userId = req.headers.user;

    userId && userId.toLowerCase() === user.toLowerCase()  
      ? res.status(202) & next()
      : res.status(400).json({ message: "invalid user id" });
  }
}

function validateUser(req, res, next) {
  // validates all POST requests for new user (not post)
  const resBody = req.body

  !resBody 
    ? res.status(400).json({ message: "missing user data" })
    : !resBody.name 
      ? res.status(400).json({ message: "missing required text field" })
      : next();
}

function validatePost(req, res, next) {
  // validates all POST requests for new post (not user)
}

module.exports = router;
