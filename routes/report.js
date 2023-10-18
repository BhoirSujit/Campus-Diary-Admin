const express = require('express')

const router = express.Router();

const db = require('../config')
const Ref = db.collection("reports");

router.use(express.static('public'));

async function getDataByQuery(afterLoad) {
  try {
    //getting data //add .where('campus', '==', campus)
    const snapshot = await Ref.orderBy('submitDate', 'DESC').get()
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
    res.render("report", locals)
  })
  .post('/', function (req, res) {

    if (req.body.type == 'q') {

      console.log('getting data for reports');


      getDataByQuery((snapshot) => {

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
  })

module.exports = router