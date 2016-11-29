
var express = require('express');
var http = require('http');
var morgan = require ('morgan');
var bodyParser = require('body-parser');
var Verify = require('./verify');

var promotionRouter = express.Router();
var promotions = require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
				/*.all(function(req, resp, next){
					resp.writeHead(200, {'Content-Type' : 'text/plain'});
					next();
				})*/
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){
					promotions.find({}, function(err, promotion){
						if (err) throw err;
						resp.json(promotion);
					});
					/*resp.end('Returned All Promotions!');*/
				})
				.post(Verify.verifyAdmin, function(req, resp, next){					
					promotions.create(req.body, function(err, promotion){
						if (err) throw err;
						console.log('promotion created!');
						var id = promotion._id;
						resp.writeHead(200, {'Content-Type' : 'text/plain'});
						resp.end(' Added the promotion with id :' + id);	
					});

					/*resp.write('Will add the Promotions -> ');
					resp.end(' Promotion Name:  ' + req.body.name + ' And details : ' + req.body.description);		*/			
				})
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					promotions.remove({}, function(err, res){
						if (err) throw err;
						console.log('All promotions deleted!');				
						resp.json(res);
						
					});
					/*resp.end(' Deleting All Promotions');	*/		
				});			

				/* Route for Specific Promotions ID */

promotionRouter.route('/:promotionId')
				/*.all(function(req, resp, next){
					resp.writeHead(200, {'Content-Type' : 'text/plain'});
					next();
				})*/
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){			

					promotions.findById(req.params.promotionId, function(err, promotion){
						if (err) throw err;
						resp.json(promotion);
					});
				/*	resp.end(' Return the data for Promotion Id : ' + req.params.id);	*/		
				})				
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					promotions.remove({'_id': req.params.promotionId}, function(err, res){
						if (err) throw err;
						resp.json(res);
					});
					/*resp.end(' Delete the data for Promotion Id : ' + req.params.id);*/			
				})
				.put(Verify.verifyAdmin, function(req, resp, next){			
					promotions.findByIdAndUpdate(req.params.promotionId, {
						$set: req.body
					},{
						new: true
					},function(err, promotion){
						if (err) throw err;
						resp.json(promotion);
					});
					/*resp.write(' Updates the data for Promotion Id : ' + req.params.id);	
					resp.end(' Promotion Name:  ' + req.body.name + ' And details : ' + req.body.description);*/				
				});


module.exports = promotionRouter;

 