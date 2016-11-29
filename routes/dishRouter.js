
var express = require('express');
var http = require('http');
var morgan = require ('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var Verify = require('./verify');

var dishes = require('../models/dishes');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
				.all(Verify.verifyOrdinaryUser)
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){
					/*resp.end('Returned All Dishses!');*/

					dishes.find({})
						.populate('comments.postedBy')
						.exec(function(err, dish){
						if (err) throw err;
						resp.json(dish);
					});
				})
				.post(Verify.verifyAdmin, function(req, resp, next){
					dishes.create(req.body, function(err, dish){
						if (err) throw err;
						console.log('dish created!');
						var id = dish._id;
						resp.writeHead(200, {'Content-Type' : 'text/plain'});
						resp.end(' Added the dish with id :' + id);	
					});

					/*resp.write('Will add the Dish -> ');
					resp.end(' Dish Name:  ' + req.body.name + ' And details : ' + req.body.description);*/
				})
				.delete(Verify.verifyAdmin, function(req, resp, next){			
					dishes.remove({}, function(err, res){
						if (err) throw err;
						console.log('All dishes deleted!');				
						resp.json(res);
						
					});
					/*resp.end(' Deleting All dishses');		*/	
				});			

/* Route for Specific Dish ID */
dishRouter.route('/:dishId')
				.all(Verify.verifyOrdinaryUser)
				.get(Verify.verifyOrdinaryUser, function(req, resp, next){			
					
					dishes.findById(req.params.dishId)
						.populate('comments.postedBy')
						.exec(function(err, dish){
							if (err) throw err;
							resp.json(dish);
					});
				})
				.delete(Verify.verifyAdmin, function(req,resp,next){
					dishes.remove({'_id': req.params.dishId}, function(err, res){
						if (err) throw err;
						resp.json(res);
					});
				})
				
					/*resp.end(' Delete the data for Dish Id : ' + req.params.id );			*/
				

				.put(Verify.verifyAdmin, function(req, resp, next){			
					dishes.findByIdAndUpdate(req.params.dishId, {
						$set: req.body
					},{
						new: true
					},function(err, dish){
						if (err) throw err;
						resp.json(dish);
					});
					/*resp.write(' Updates the data for Dish Id : ' + req.params.id );	
					resp.end(' Dish Name:  ' + req.body.name + ' And details : ' + req.body.description);*/		
				});

/* Route for Specific Dish ID */
dishRouter.route('/:dishId/comments')
	.all(Verify.verifyOrdinaryUser)
	.get(Verify.verifyOrdinaryUser, function(req, resp, next){
		dishes.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish){
				if (err) throw err;
				resp.json(dish.comments);
		});
	})
	.delete(Verify.verifyAdmin, function(req, resp, next){
		dishes.findById(req.params.dishId, function(err, dish){

			for (var i = dish.comments.length - 1; i >= 0; i--) {
				dish.comments.id(dish.comments[i].id).remove();					
			}
			dish.save(function(err,result){
				if (err) throw err;
				console.log("result after save : " + result);
				resp.writeHead(200, {"Content-Type" : "text/plain" });
				resp.end("deleted all comments!");
			});
		});
	})
	.post(Verify.verifyOrdinaryUser, function (req, resp, next) {

		dishes.findById(req.params.dishId, function(err, dish){
			if (err) throw err;

			req.body.postedBy = req.decoded._doc._id;

			dish.comments.push(req.body);
			dish.save(function(err, dish){
				if (err) throw err;
				console.log("save dish comments, dish Is: ");
				console.log(dish);
				resp.json(dish);
			});
		});
	});
	
dishRouter.route('/:dishId/comments/:commmentId')
.get(Verify.verifyOrdinaryUser, function(req,resp,next){
	dishes.findById(req.params.dishId)
		.populate('comments.postedBy')
		.exec(function(err, dish){
			if (err) throw err;
			resp.json(dish.comments.id(req.params.commmentId));
	});
})
.put(Verify.verifyAdmin, function(req, resp, next) {
	dishes.findById(req.params.dishId, function(err, dish){
		if (err) throw err;
		dish.comments.id(req.params.commmentId).remove();
		req.body.postedBy = req.decoded._doc._id;

		dish.comments.push(req.body);

		dish.save(function(err, dish){
			if (err) throw err;
			console.log("save dish comments, dish Is: ");
			console.log(dish);
			resp.json(dish);
		});
	});
})
.delete(Verify.verifyAdmin, function(req, resp, next){
	dishes.findById(req.params.dishId, function(err, dish){
		if (dish.comments.id(req.params.commentId).postedBy 
			!= req.decoded._doc._id){
			var err = new Error('You are not authorized to perform this operation!');
             err.status = 403;
             return next(err);
		}

		dish.comments.id(req.params.commmentId).remove();
		console.log("removed comments : " + req.params.commmentId);
		dish.save(function(err, dish){
			if (err) throw err;
			resp.json(dish);
		});
		
	});
});

module.exports = dishRouter;

 