//assignment week 4 task 2

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id })
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })

    .post(function (req, res, next) {
        Favorites.findOneAndUpdate({postedBy: req.decoded._doc._id},
            {$addToSet: {dishes: req.body}},
            {upsert: true, new: true},
            function (err, favortie) {
                if (err) throw err;
                res.json(favortie);
            }
            
        );
    })

    .delete(function (req, res, next) {
        Favorites.findOneAndRemove({postedBy: req.decoded._doc._id}, function (err, resp) {
            if (err) {throw err; }
            console.log('Favorites deleted!');
            res.json(resp);
        });
    });

favoriteRouter.route('/:dishObjectId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOneAndUpdate({postedBy: req.decoded._doc._id},
            {$pull: {dishes: req.params.dishObjectId}},
            {new: true}, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
    });


module.exports = favoriteRouter;