const express = require('express')

const router = express.Router();

const db = require('../config')
const postsRef = db.collection("posts");

router.use(express.static('public'));

router
.get("/", (req, res) => {
    const locals = {
      UsersData  : []
    }
    res.render("marketplace", locals)
  })
  

module.exports = router
