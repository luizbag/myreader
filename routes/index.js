var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Feedr' });
});

router.get('/test', function(req, res, next) {
    res.render('index', { title: 'Feedr' });
});

router.post('/fetch', function(req, res, next) {
    var itens = [];
    var meta = {};
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
        console.log(error);
        res.render('fetch', {error: error});
    });

    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this;
        meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;

        while (item = stream.read()) {
            itens.push(item);
        }
    });

    feedparser.on('end', function() {
        var max = itens.length;
        if (itens.length > 10) {
            max = 10;
        }
        console.log(itens.length);
        res.render('fetch', {title: meta.title, meta: meta, itens: itens});
    });
});

module.exports = router;
