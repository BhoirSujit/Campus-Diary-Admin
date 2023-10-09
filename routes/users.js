const express = require('express')

const router = express.Router();


const db = require('../config')
const userRef = db.collection("users");

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





async function getUserDataByUsername(username, afterLoad) {
  try {
    //getting data

    const snapshot = await userRef.where('username', '==', username).get()
    afterLoad(snapshot) 

  }
  catch (error) {
    console.log(error);
  }
}

async function getUserDataByQuery(campusname,sortby, afterLoad) {
  try {
    //getting data
    

    if (sortby == 0)
    {
      const snapshot = await userRef.where('campus', "==", campusname+"").orderBy("name").get();
      afterLoad(snapshot) 
    }
    else
    {
      const snapshot = await userRef.where('campus', "==", campusname+"").orderBy("name","desc").get();
      afterLoad(snapshot) 
    }

    
   

  }
  catch (error) {
    console.log(error);
  }
}



//show
router.get("/", (req, res) => {
  const locals = {
    UsersData  : []
  }
  res.render("users", locals)
});

router.post('/byusername', (req, res) => {
    console.log(req.body.uname)
    getUserDataByUsername(req.body.uname,afterLoad= (snapshot) =>
        {
            var data = [];

            console.log('snapshote are : '+snapshot);
            if (snapshot.empty) {
                console.log('No matching documents.');
                
              } 
            else
              {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    
                  });
                  data = snapshot;
               
              }
            res.render("users", {
                UsersData : data
            })
        });
    
})

router.post('/byuname', (req, res) => {
  console.log('i was hited' + req.body.uname)
  res.render("users", {m:"hello"})
  
  
})


router.post('/byquery', (req, res) => {
  console.log(req.body.campusName + " " + req.body.sortop);
  getUserDataByQuery(req.body.campusName, req.body.sortop, afterLoad = (snapshot) => {
    var data = [];

            console.log('snapshote are : '+snapshot);
            if (snapshot.empty) {
                console.log('No matching documents.');
                
              } 
            else
              {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    
                  });
                  data = snapshot;
               
              }
            res.render("users", {
                UsersData : data
            })
  })
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