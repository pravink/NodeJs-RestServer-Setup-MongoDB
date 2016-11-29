
var express = require('express');
var http = require('http');
var morgan = require ('morgan');
var bodyParser = require('body-parser')
var Verify = require('./verify');

var leaderRouter = express.Router();
var leaderships = require('../models/leadership');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
				/*.all(function(req, resp, next){
					resp.writeHead(200, {'Content-Type' : 'text/plain'});
					next();
				})*/
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){
					/*resp.end('Returned All leaderships!');*/
					leaderships.find({}, function(err, leadership){
						if (err) throw err;
						resp.json(leadership);
					});
				})
				.post(Verify.verifyAdmin, function(req, resp, next){
					/*resp.write('Will add the leadership -> ');
					resp.end(' leadership Name:  ' + req.body.name + ' And details : ' + req.body.description);*/

					leaderships.create(req.body, function(err, leadership){
						if (err) throw err;
						console.log('leadership created!');
						var id = leadership._id;
						resp.writeHead(200, {'Content-Type' : 'text/plain'});
						resp.end(' Added the leadership with id :' + id);	
					});
					
				})
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					/*resp.end(' Deleting All leadership');		*/	
					leaderships.remove({}, function(err, res){
						if (err) throw err;
						console.log('All leaderships deleted!');				
						resp.json(res);
						
					});
				});
				

				/* Route for Specific leadership ID */

leaderRouter.route('/:leadershipId')
				/*.all(function(req, resp, next){
					resp.writeHead(200, {'Content-Type' : 'text/plain'});
					next();
				})*/
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){			
					/*resp.end(' Return the data for leadership Id : ' + req.params.leadershipId);	*/		
					leaderships.findById(req.params.leadershipId, function(err, leadership){
						if (err) throw err;
						resp.json(leadership);
					});
				})				
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					/*resp.end(' Delete the data for leadership Id : ' + req.params.leadershipId);*/			
					leaderships.remove({'_id': req.params.leadershipId}, function(err, res){
						if (err) throw err;
						resp.json(res);
					});
				})
				.put(Verify.verifyAdmin, function(req, resp, next){			
					leaderships.findByIdAndUpdate(req.params.leadershipId, {
						$set: req.body
					},{
						new: true
					},function(err, leadership){
						if (err) throw err;
						resp.json(leadership);
					});
					/*resp.write(' Updates the data for leadership Id : ' + req.params.leadershipId);			
					resp.end(' leadership Name:  ' + req.body.name + ' And details : ' + req.body.description);	*/	
				});


module.exports = leaderRouter;


 