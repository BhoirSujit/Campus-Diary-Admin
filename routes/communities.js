const express = require('express')

const router = express.Router();

const db = require('../config')
const Ref = db.collection("community");
const pRef = db.collection("posts");

router.use(express.static('public'));


//db
async function getDataByID(id, afterLoad) {
  try {
    //getting data
    const snapshot = await Ref.where('id', '==', id).get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

async function removeById(id, afterLoad) {
  try {
    //getting data
    const snapshot = await Ref.doc(id).delete();
    var jobskill_query = pRef.where('communityId', '==', id);
jobskill_query.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    doc.ref.delete();
    afterLoad(snapshot)
  });
});
  
    

  }
  catch (error) {
    console.log(error);
  }
}

async function getDataByQuery(campus, afterLoad) {
  try {
    //getting data //add .where('campus', '==', campus)
    const snapshot = await Ref.where('campus', '==', campus).get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

var data = []

router
  .get("/", (req, res) => {
    const locals = {
      UsersData: []
    }
    res.render("communities", locals)
  })
  .post('/', function (req, res) {

    if (req.body.type == 'q') {
      let campus = req.body.campus;
      //let sort = req.body.sort;

      console.log('getting data for community : ' + campus + " ");


      getDataByQuery(campus, (snapshot) => {

        data = [];

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
    else if (req.body.type == 'i') {
      let pid = req.body.id;

      getDataByID(pid, (snapshot) => {

        data = [];

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
    else if (req.body.type == "r") {
      //
      removeById(req.body.id, (snapshot) => {
      })
      

    }






  })


module.exports = router
