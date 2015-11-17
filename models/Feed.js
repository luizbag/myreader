var mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
    title: { type: String, require: true },
    content: { type: String, require: true },
    is_read: { type: Boolean, default: false },
    entry_url: { type: String, require: true }
});

var FeedSchema = new mongoose.Schema({
    title: { type: String, require: true },
    entries: [EntrySchema],
    feed_url: { type: String, require: true},
    site_url: { type: String, require: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Feed', FeedSchema);