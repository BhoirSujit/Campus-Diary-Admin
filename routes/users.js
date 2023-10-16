const express = require('express')

const router = express.Router();


const db = require('../config')
const admin = require('../config').admin
const Ref = db.collection("users");

router.use(express.static('public'))

//model
// const userSchema = new mongoose.Schema({
//     id: String,
//     name: String,
//     email: String, 
//     username: String,
//     profilePicId: String,
//     campus: String
// }) 





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
    const snapshot = await Ref.where('campus', '==', campus).orderBy('name', (sort == '0') ? 'ASC' : 'DESC').get()
    afterLoad(snapshot)

  }
  catch (error) {
    console.log(error);
  }
}





//show
router.get("/", (req, res) => {
  const locals = {
    UsersData: []
  }
  res.render("users", locals)
})
  .post('/', function (req, res) {

    if (req.body.type == 'q') {
      let campus = req.body.campus;
      let sort = req.body.sort;

      console.log('getting data for users : ' + campus + " " + sort);


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
    else if(req.body.type == "r")
    {
      admin.auth().updateUser(req.body.id, { disabled: true });
      console.log("banned use : "+req.body.id);
    }






  })

// //getUserData();




// // ref.get()
// // .then((querySnapshot) => {
// //   const count = querySnapshot.size; // Get the number of documents in the collection
// //   console.log(`Total documents in the collection: ${count}`);
// //   uc = count;

// // })
// // .catch((error) => {
// //   console.error("Error counting documents:", error);
// // });


// router.get("/getData1", (req, res) => {
//   // Fetch updated data from your data source (e.g., a database)
//   const updatedData = {
//    // UserCount: uc,
//   };

//   res.json(updatedData); // Send the updated data as JSON
// });


module.exports = router