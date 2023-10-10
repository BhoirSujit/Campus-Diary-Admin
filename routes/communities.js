const express = require('express')

const router = express.Router();

const db = require('../config')
const comRef = db.collection("community");

router.use(express.static('public'));


async function getComDataByID(id, afterLoad) {
    try {
      //getting data
      const snapshot = await postsRef.where('id', '==', id).get()
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
    res.render("communities", locals)
  })
.post('/',function(req, res){

    let cid = req.body.id;

    getComDataByID(cid, (snapshot) =>{
        
        var data = [];

        console.log('snapshote are : '+snapshot);
        if (snapshot.empty) {
            console.log('No matching documents.');
            
          } 
        else
          {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                data.push(doc.data());
              });
              
           
          }
        res.send( {
            m : pid,
            postdata : data
        })
    })


    
        
  })
  
  
  module.exports = router
