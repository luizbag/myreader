var express = require('express');
var mongoose = require('mongoose');
var FeedParser = require('feedparser');
var request = require('request');
var router = express.Router();