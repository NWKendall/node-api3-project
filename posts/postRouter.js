const express = require('express');
const postData = require("./postDb")

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postData  
    .get()
      .then(posts => {
        !posts ?
        res.status(400).json({ error: "THERE ARE NO POSTS!" }) :
        res.status(200).json(posts)
      })
      .catch(err => {console.log(err)
      res.status(500).json({ error: "Retrieving all users' posts FAILED"})
      })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  postData
    .getById(id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Server Error"})
    })

});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  postData
    .remove(id)
    .then(post => {
      !post ?
        res.status(400).json({ error: "post doesn;t exist, can't delete!"})
        : res.status(200).json(post)
    })
    .catch(err => {
      console.log(`Delete error:`, err)
      res.status(500).json({ error: "server issues"})
    })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params

  postData
    .update(id, req.body)
    .then(edit => {
      res.status(202).json(edit)
    })
    .catch(err => {
      console.log(err)
    res.status(500).json({ error: "The post information could not be modified." })
  })

  
    
});

// custom middleware
function validatePostId(req, res, next) {
  // do your magic!

  const { id } = req.params;
  
  !id || isNaN(parseInt(id)) ?
    res.status(400).json({ message: "invalid post id" }) : next()
}

module.exports = router;
