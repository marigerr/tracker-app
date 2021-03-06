const Meal = require('../models/meal.js');
const User = require('../models/user.js');
const logger = require('tracer').console();

exports.getTrack = (req, res) => {
  User.findOne({ _id: req.session.passport.user })
    .populate('foodtypes')
    .exec((err, user) => {
      if (err) {
        logger.log(err);
      } else {
        res.json(user.foodtypes);
      }
    });
};

exports.postTrack = (req, res) => {
  logger.log(req.body);
  User.findOne({ _id: req.session.passport.user })
    .populate('foodtypes')
    .exec((err, user) => {
      if (err) {
        logger.log(err);
      } else {
        logger.log(req.body.timestamp);
        logger.log(new Date(req.body.timestamp));
        const meal = new Meal({
          brand: req.body.brand,
          packageportion: req.body.amount,
          percentDailyValue: req.body.percentDailyValue,
          openednewpackage: req.body.openednewpackage,
          oauthID: user.oauthID,
          timestamp: req.body.timestamp,
        });
        meal.save((error) => {
          if (error) {
            logger.log(error);
            res.status(500).send('Something broke!');
          } else {
            // res.render('track', { isAuthenticated: true, user, title: 'Pet Meal Tracker' });
            res.json({ message: 'Meal added', meal });
          }
        });
      }
    });
};
