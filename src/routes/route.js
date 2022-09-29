const express = require('express')
const router = express.Router();

router.post('/url/shorten',createShortUrl)


router.use(function(req,res){
    res.status(400).send({status:false, message:"rout not found"})
})

module.exports = router