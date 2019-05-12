const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
const mongoose = require('mongoose')
const User = require('../modals/user').model
const hashPassword = require('../modals/user').hashPassword
const compareHash  = require('../modals/user').compareHash
var session = require('express-session');
var path = require('path');

//validation schema
var sessionChecker = (req, res, next) => {
  if (req.session.user) {
      res.redirect('/');
      return;
  } else {
      next();
  }    
};

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  hashedPassword: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('hashedPassword')).required()
})

 router.route('/login')
 .get(sessionChecker,(req,res)=>{
    res.render('partials/login/login',{layout:'loginLayout'})
  })
  .post(async (req,res,next)=>{
  let email  = req.body.email
  let password = req.body.password
  if(email && password){
    if(!await User.findOne({'email':req.body.email},async (err,result)=>{
      if(result){
        if(await compareHash(password,result.hashedPassword)){
          req.session.user = result;
          res.redirect('/dashboard')
          return
        }else{
          req.flash('error',"Password is not correct")
          res.redirect('/users/login')
          return
        }
      }

    })){
        req.flash('error',"There is no such email available with us")
        res.redirect('/users/login')
        return
    }
  }
 })
router.route('/register')
  .get(sessionChecker,(req, res) => {
    res.render('partials/login/register',{layout:'loginLayout'})
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema)
      if (result.error) {
        req.flash('error', 'Data entered is not valid. Please try again. Password should not contain @#$ etc, and should be of length greater than 6 and less than 30')
        res.redirect('/users/register')
        return
      }
      let user = await User.findOne({ 'email': result.value.email })
      if (user) {
        req.flash('error', 'Email is already in use.')
        res.redirect('/users/register')
        return
      }
      user = await User.findOne({ 'username': result.value.username })
      if (user) {
        req.flash('error', 'Username is already in use.')
        res.redirect('/users/register')
        return
      }
 
      const hash = await hashPassword(result.value.hashedPassword)
 
      delete result.value.confirmationPassword
      result.value.hashedPassword = hash
 
      const newUser = await new User(result.value)
      await newUser.save()
      req.session.user = result.value;
      req.flash('success', 'Registration successfully, go ahead and login.')
      res.redirect('/users/login')
 
    } catch(error) {
      next(error)
    }
  })
 router.route('/logout')
      .get((req,res)=>{
        if(req.session.user){
          res.clearCookie('user_sid')
          res.redirect('/users/login')
        }else{
          res.redirect('/users/login')
        }
      })
  module.exports = router