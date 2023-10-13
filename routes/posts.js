const express = require('express')

const router = express.Router();


const db = require('../config')
const postsRef = db.collection("posts");

router.use(express.static('public'));


//db
async function getPostDataByID(id, afterLoad) {
  try {
    //getting data
    const snapshot = await postsRef.where('id', '==', id).get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

async function getPostDataByQuery(campus, sort, afterLoad) {
  try {
    //getting data //add .where('campus', '==', campus)
    const snapshot = await postsRef.orderBy('creationDate', (sort == '0') ? 'ASC' : 'DESC').get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

//show
router
  .get("/", (req, res) => {
    const locals = {
      UsersData: []
    }
    res.render("posts", locals)
  })
  .post('/', function (req, res) {

    if (req.body.type == 'q') {
      let campus = req.body.campus;
      let sort = req.body.sort;

      console.log('getting data for post : '+campus + " " + sort);


      getPostDataByQuery(campus, sort, (snapshot) => {

        var data = [];

        console.log('snapshote are : ' + snapshot);
        if (snapshot.empty) {
          console.log('No matching documents.');

        }
        else {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            data.push(doc.data());

          });


        }
        res.send({
          postdata: data
        })
      })
    }
    else {
      let pid = req.body.id;

      getPostDataByID(pid, (snapshot) => {

        var data = [];

        console.log('snapshote are : ' + snapshot);
        if (snapshot.empty) {
          console.log('No matching documents.');

        }
        else {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            data.push(doc.data());

          });


        }
        res.send({
          m: pid,
          postdata: data
        })
      })
    }






  })




module.exports = router