var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');

var mongoose = require('mongoose');
var Feed = require('../models/Feed.js');

router.get('/', function(req, res, next) {
	Feed.find({'user': req.user._id}, function(err, feeds) {
		if(err) return next(err);
		res.json(feeds);
	});
});

router.get(':/id', function(req, res, next) {
	Feed.find({'user': req.user._id, 'id': req.params.id}, function(err, feed) {
		if(err) return next(err);
		res.json(feed);
	});
});

router.post('/', function(req, res, next) {
	var feed = new Feed(req.body);
	feed.user = req.user._id;
	Feed.create(feed, function(err, caderno) {
		if(err) return next(err);
		res.json(feed);
	});
});

router.put('/:id', function(req, res, next) {
	Feed.findByIdAndUpdate(req.params.id, req.body, function(err, feed) {
		if(err) return next(err);
		res.json(feed);
	});
});

router.delete('/:id', function(req, res, next) {
	Feed.findByIdAndRemove(req.params.id, req.body, function(err, feed) {
		if(err) return next(err);
		res.json(caderno);
	});
});

router.post('/add_feed', function(req, res, next) {
	var feed_url = req.body.feed_url;
	Feed.find({"feed_url": feed_url}, function(err, feeds) {
		if(feeds.length === 0) {
			var feed = Feed();
			var itens = [];
			var meta = {};
			var outRequest = request(feed_url);
			var feedparser = new FeedParser();

			outRequest.on('error', function (error) {
		        // handle any request errors
		    });

		    outRequest.on('response', function (res) {
		        var stream = this;

		        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

		        stream.pipe(feedparser);
		    });

		    feedparser.on('error', function(error) {
		        // always handle errors
		        console.log(error);
		        res.render('fetch', {error: error});
		    });

		    feedparser.on('readable', function() {
		        // This is where the action is!
		        var stream = this;
		        feed.title = this.meta.title;
		        feed.feed_url = feed_url;
		        feed.site_url = this.meta.link;
		        feed.user = req.user._id;
		        var item;

		        while (item = stream.read()) {
		            var entry = {}
		            entry.title = item.title;
		            entry.content = item.description;
		            entry.is_read = false;
		            entry.entry_url = item.link;
		            feed.entries.push(entry);
		        }
		    });

		    feedparser.on('end', function() {
		    	Feed.create(feed, function(err, caderno) {
					if(err) return next(err);
					res.json(feed);
				});
		    });
		} else {
			res.json(feeds);
		}
	});
	
});

module.exports = router;