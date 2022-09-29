const urlModel = require('../models/urlModel')
const shortId = require('shortid')
const validUrl = require('valid-url');

const isValid = function (value) {
    if (typeof value !== "string" || typeof (value) === 'undefined' || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}
const createShortUrl = async function(req, res){
    try {
         const data = req.body
        
        if (Object.keys(data).length == 0) 
            return res.status(400).send({ status: false, message: "Please provide data in request body" })

        const longUrl = data.longUrl
        if(!longUrl) return res.status(400).send({ status: false, message: "longURL is Mandatory" })

        if (! isValid(longUrl) || !validUrl.isUri(longUrl)){    // validUrl.isUri returns (String) = undefine / longUrl
            return res.status(400).send({ status: false, message: "Not A Valid URL , Plz Provide valid long URL" })
        }

        const urlPresent = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
        if (urlPresent){
            return res.status(200).send({ status: true, message: "URL Already Present", data: urlPresent })
        }
        const urlCode = shortId.generate()
        const shortUrl = "http://localhost:3000/"+urlCode
        
        data.urlCode = urlCode
        data.shortUrl = shortUrl
                
        const savedData = await urlModel.create(data)

        const responsedata = { 
            longUrl: savedData.longUrl,
             shortUrl: savedData.shortUrl, 
             urlCode: savedData.urlCode 
        }
        return res.status(201).send({ status: true, message: "Data Created", data: responsedata })
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

const getFullUrl = async function(req,res){
    try{
        let urlCode = req.params.urlCode
        let findData = await urlModel.findOne({urlCode:urlCode})
        if(findData){
            let longUrl = findData.longUrl
            return res.status(302).redirect(longUrl)
        }
        return res.status(404).send({status: false,message: "Url not found"})
    }
    catch(err){
        res.status(500).send({status:false , message:err.message})
    }
}

module.exports = {createShortUrl , getFullUrl}