var express = require('express');
var router = express.Router();
var models  = require('../models/index');

// SESSION HANDLER
router.get('/*', function(req, res, next) {
  var sess = req.session;

  if (sess.sid == null) {
      sess.sid = -1;
  } else {
    console.log("SID: " + sess.sid);
  }

  var pathExceptionArray = new Array("/api/parcours");

  if (sess.connected == undefined || sess.connected == false) {

    var freeToGo = false;
    for(var i=0; i < pathExceptionArray.length; i++){
        if(pathExceptionArray[i] == req.path ){
            freeToGo = true;
        }
    }

    if (freeToGo) {
        sess.connected = false;
        next();
    } else {
        sess.connected = false;
        res.render('login');
    }

  } else {

    console.log('login ok');
    next();
  }
});

// LOGIN
// -----------------------------------------------------
// login
router.post('/login', function(req, res) {

  var sess = req.session;

  models.User.findOne({
    where: {
        username: req.body.username,
        password: req.body.password
     }
  }).then(
    function(user) {

        if (user != null) {
            sess.connected = true;

            if (user.admin == true) {
                req.session.admin = true;
            } else {
                req.session.admin = false;
            }
            req.session.sid = user.id;

            res.render('index', {
                menu: "accueil"
            });

        } else {
            sess.connected = false;
            res.render('login', {
              msg: 'Le login ou le mot de passe n\'est pas correct'
            });

        }

  });

});

// logout
router.get('/logout', function(req, res) {
  var sess = req.session;
  sess.connected = false;
  res.render('login');
});


module.exports = router;
