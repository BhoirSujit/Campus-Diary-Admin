const express = require('express')
const router = express.Router();

const db = require('../config');
const userRef = db.collection("users");
const postRef = db.collection("posts");
const productsRef = db.collection("products");
const responseRef = db.collection("reports");

var uc = 0;
var pc = 0;
var rc = 0;
var proc = 0;



async function getData(afterLoad) {
  try {
    //getting data
    const userC = await userRef.count().get();
    const postC = await postRef.count().get();
    const responsesC = await responseRef.count().get();
    const productsC = await productsRef.count().get();

    uc = userC.data().count;
    pc = postC.data().count;
    rc = responsesC.data().count;
    proc = productsC.data().count;

    console.log(`Count are  : ${uc} , ${pc}, ${rc}, ${proc}`)
    afterLoad()

    
  }
  catch (error) {
    console.log(error);
  }
}



//dashbord
router.get("/", (req, res) => {
  getData(afterLoad => {
    const locals = {
      userCount: uc,
      postCount: pc,
      responseCount: rc,
      productCount: proc
    }
    console.log("dashbord data gathered");
    res.render("index", locals)
  });
  console.log(" req for dashbord");
  
})

//update data
router.get('/data', (req, res) => {
  // Fetch updated data from your data source (e.g., a database)
  const updatedData = {
    userCount: uc,
    postCount: pc,
    responseCount: rc,
    productCount: proc
  };

  res.json(updatedData); // Send the updated data as JSON
})


module.exports = router