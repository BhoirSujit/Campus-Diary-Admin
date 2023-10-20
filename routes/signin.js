const express = require('express')

const router = express.Router();


const db = require('../config')
const admin = require('../config').admin
const Ref = db.collection("users");

router.use(express.static('public'))

router
  .get("/", (req, res) => {
    const locals = {
      UsersData: []
    }
    res.render("signin", locals)
  })



module.exports = router