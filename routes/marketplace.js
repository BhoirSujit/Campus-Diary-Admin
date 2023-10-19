const express = require('express')

const router = express.Router();

const db = require('../config')
const Ref = db.collection("products");

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

async function getDataByQuery(campus, sort, afterLoad) {
  try {
    //getting data //add 
    const snapshot = await Ref.where('campus', '==', campus).orderBy('uploadDate', (sort == '0') ? 'ASC' : 'DESC').get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

async function removeById(id, afterLoad)
{
  try {
    //getting data
    const snapshot = await Ref.doc(id).delete()  
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}

router
.get("/", (req, res) => {
    const locals = {
      UsersData  : []
    }
    res.render("marketplace", locals)
  })
  .post('/', function (req, res) {

    if (req.body.type == 'q') {
      let campus = req.body.campus;
      let sort = req.body.sort;

      console.log('getting data for post : '+campus + " " + sort);


      getDataByQuery(campus, sort, (snapshot) => {

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
    else if (req.body.type == 'i') {
      let pid = req.body.id;

      getDataByID(pid, (snapshot) => {

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
    else if (req.body.type == 'r')
    {
      removeById(req.body.id, (snapshot) => {
          res.send();
      })
    }






  })

  

module.exports = router
