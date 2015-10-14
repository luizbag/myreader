var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/fetch', function(req, res, next) {
    var itens = [];
    var url = req.body.url;
    var outRequest = request(url);
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
    });

    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;

        while (item = stream.read()) {
            itens.push(item);
        }

        res.render('fetch', {title: itens[0].title, description: itens[0].description});
    });
});

module.exports = router;
