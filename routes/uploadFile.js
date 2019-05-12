const express = require('express');
const router = express.Router()
const passport = require('passport')
const mongoose = require('mongoose')
const User = require('../modals/user').model
const Requests = require('../modals/request').model
const hashPassword = require('../modals/user').hashPassword
const compareHash  = require('../modals/user').compareHash
var session = require('express-session');
var path = require('path');

router.route('/')
.post(async (req,res,next)=>{
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;
    
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv('storageDataForTutorResource', function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
      });
})
  module.exports = router