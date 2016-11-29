
var express = require('express');
var http = require('http');
var morgan = require ('morgan');
var bodyParser = require('body-parser')
var Verify = require('./verify');
var favoriteRouter = express.Router();
var favorites = require('../models/favorites');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
			.get(Verify.verifyOrdinaryUser, function(req, resp, next){
			
					favorites.find({'postedBy': req.decoded._doc._id})
		            .populate('postedBy')
		            .populate('dishes')
		            .exec(function (err, favorite) {
		                if (err) return err;
		                resp.json(favorite);
		            });

					/*favorites.find({})
						.populate('fdishes')						
						.populate('postedBy')						
						.exec(function(err, favorites){
						if (err) throw err;
						resp.json(favorites);
					});*/
				})
			 .post(function (req, res, next) {

        favorites.find({'postedBy': req.decoded._doc._id})
            .exec(function (err, favorite) {
                if (err) throw err;
                req.body.postedBy = req.decoded._doc._id;
                

                if (favorite.length) {
                    var favoriteAlreadyExist = false;
                    if (favorite[0].dishes.length) {
                        for (var i = (favorite[0].dishes.length - 1); i >= 0; i--) {
                            favoriteAlreadyExist = favorite[0].dishes[i] == req.body._id;
                            if (favoriteAlreadyExist) break;
                        }
                    }
                    if (!favoriteAlreadyExist) {
                        favorite[0].dishes.push(req.body._id);
                        favorite[0].save(function (err, favorite) {
                            if (err) throw err;
                            console.log('Um somethings up!');
                            resp.json(favorite);
                        });
                    } else {
                        console.log('Setup!');
                        resp.json(favorite);
                    }

                } else {

                    favorites.create({postedBy: req.body.postedBy}, function (err, favorite) {
                        if (err) throw err;
                        favorite.dishes.push(req.body._id);
                        favorite.save(function (err, favorite) {
                            if (err) throw err;
                            console.log('Something is up!');
                            resp.json(favorite);
                        });
                    })
                }
            });
    })

				/*.post(Verify.verifyAdmin, function(req, resp, next){
					
						var obj = req.body;
						favorites.findById(obj._id, function(err, favorite){
						    if (!favorite){
						        var favorite = new favorites(obj)

						        var favoriteId  = favorite._id;
						        req.body.postedBy = req.decoded._doc._id;
								favorite.postedBy = req.body.postedBy;

								favorite._id = favoriteId;
								favorite.fdishes.push(req.body);	
						        favorite.save(function(err, favorite){
						            if (err) throw err;
									console.log("save favorite dish, favorite Is: ");
									console.log(favorite);
									resp.json(favorite);

						        });
						    } else {
						       /* favorites.findByIdAndUpdate(obj._id, obj, function(){
						           if (err) throw err;
									console.log("save favorite dish, favorite Is: ");
									console.log(favorite);
									favorite._id = favoriteId;
									req.body.postedBy = req.decoded._doc._id;
									favorite.postedBy = req.body.postedBy;*/

									/*favorite.fdishes.push(req.body);	*/
							       /* favorite.save(function(err, favorite){
							            if (err) throw err;
										console.log("save favorite dish, favorite Is: ");
										console.log(favorite);
										resp.json(favorite);
							        });*/
						       /* favorite.update({_id: obj._id}, {$push: {"fdishes": {obj}}}, function(err, numAffected, favorite) {
      								if (err) throw err;
      
							         
										console.log("save favorite dish, favorite Is: ");
										console.log(favorite);
										resp.json(favorite);

							        });
									
						        })*/
						    /*}*/
												
					

					/*favorites.create(req.body, function(err, favorite){
						if (err) throw err;
						console.log('favorite created!');
						var favoriteId  = favorite._id;
						
						favorites.findById(favoriteId, function(err, favorite){
						if (err) throw err;

						req.body.postedBy = req.decoded._doc._id;
						favorite.postedBy = req.body.postedBy;

						favorite._id = favoriteId;
						favorite.fdishes.push(req.body);												
						favorite.save(function(err, favorite){
							if (err) throw err;
							console.log("save favorite dish, favorite Is: ");
							console.log(favorite);
							resp.json(favorite);
						});


					});*/

					/*});

					
								
				})*/
				.delete(Verify.verifyOrdinaryUser, function(req, resp, next){			
					/*resp.end(' Deleting All leadership');		*/	
					/*favorites.remove({}, function(err, res){
						if (err) throw err;
						console.log('All favorites deleted!');				
						resp.json(res);
						
					});*/

					favorites.remove({'postedBy': req.decoded._doc._id}, function (err, res) {
			            if (err) throw err;
			            resp.json(res);
			        })
				});


favoriteRouter.route('/:dishId')
				/*.all(function(req, resp, next){
					resp.writeHead(200, {'Content-Type' : 'text/plain'});
					next();
				})*/
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){			
					
					favorites.findById(req.params.dishId, function(err, favorite){
						if (err) throw err;
						resp.json(favorite);
					});
				})				
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					
					favorites.remove({'_id': req.params.dishId}, function(err, res){
						if (err) throw err;
						resp.json(res);
					});
				});
				


module.exports = favoriteRouter;