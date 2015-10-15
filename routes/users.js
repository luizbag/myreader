var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var mongoose = require('mongoose');
var User = require('../models/User.js');

router.post('/sign_in', function(req, res, next) {
  User.findOne({"email": req.body.email}, function(err, user) {
    if(err) return next(err);
    if(user) {
      user.comparePassword(req.body.password, function(match) {
        if(match) {
          var token = jwt.sign(user, config.secret);
          res.json(token);
        } else {
          console.log("Attempt failed to login with " + user.email);
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  });
});

router.post('/sign_up', function(req, res, next) {
  User.create(req.body, function(err, user) {
    if(err) return next(err);
    res.json(user);
  });
});

module.exports = router;
