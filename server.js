// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// Requiring our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');
// Mongoose mpromise deprecated - use bluebird promises
var Promise = require('bluebird');

mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'))


// Database configuration with mongoose
if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI)
} else {
	mongoose.connect('mongodb://localhost/homework')
}

var db = mongoose.connection

// Show any mongoose errors
db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// Main route (simple Hello World Message)
app.get('/', function(req, res) {
	res.send('Hello World');
});

app.get('/scrape' , function(req, res) {
	scrapeMultiplePages()
	res.redirect('/')
})

app.get('/latest/:id?', function(req, res) {
	if (!req.params.id) {
		// finds the latest document added to the database, IE the top document
		Article.findOne({}, {}, {sort:{websitePublishedDate:-1}}) // previously {sort:{$natural:1}}
		.populate('note')
		.exec(function(err, doc) {
			if (err) {
				console.log(err)
			} else {
				res.json(doc)
			}
		})
	}else {
		Article.findOne({'_id': req.params.id})
		.populate('note')
		.exec(function(err, doc) {
			if (err) {
				console.log(err)
			} else {
				res.json(doc)
			}
		})
	}
		
})

app.get('/next/:date', function(req,res) { // previously :id
	// Article.findOne({_id: {$gt: req.params.id}}, {}, {sort: {_id:1}})
	Article.findOne({websitePublishedDate: {$lt: req.params.date}}, {}, {sort: {websitePublishedDate: -1}})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err)
		} else {
			res.json(doc)
		}
	})
})

app.get('/previous/:date', function(req, res) { // previously id
	// Article.findOne({_id: {$lt: req.params.id}}, {}, {sort: {_id: -1}})
	Article.findOne({websitePublishedDate: {$gt: req.params.date}}, {}, {sort: {websitePublishedDate: 1}})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err)
		} else {
			res.json(doc)
		}
	})
})

app.post('/addNote/:id', function(req, res) {
	// Create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);
	newNote.save(function(error, doc) {
		if (error) {
			console.log(error);
		} else {
			Article.findOneAndUpdate({ '_id': req.params.id }, { 'note': doc._id })
				.exec(function(err, doc) {
					if (err) {
						console.log(err)
					} else {
						res.send(doc)
					}
				})
		}
	})
})

app.post('/deleteNote/:id', function(req, res) {
	Note.findOne({_id: req.params.id}, function(err, note) {
		if(err) {
			console.log(err)
		} else {
			note.remove()
			res.send(note)
		}
	})
})



// First, tell the console what server.js is doing
console.log('\n***********************************\n' +
	'Grabbing every article name and link\n' +
	'from 9to5mac:' +
	'\n***********************************\n');


function scrapeMultiplePages() {
	var arr = ['/', '/page/2', '/page/3', '/page/4', '/page/5']
	// Making a request call for reddit's 'webdev' board. The page's HTML is saved as the callback's third argument
	for (link in arr) {
		var url = 'https://www.9to5mac.com' + arr[link]
		request(url, function(error, response, html) {

			// Load the HTML into cheerio and save it to a variable
			// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
			var $ = cheerio.load(html);			

			// With cheerio, find each p-tag with the 'title' class
			// (i: iterator. element: the current element)
			$('h1.post-title').each(function(i, element) {

				var result = {}

				// Save the text of the element (this) in a 'title' variable
				result.title = $(element).children().text();
				console.log(result.title)

				// In the currently selected element, look at its child elements (i.e., its a-tags),
				// then save the values for any 'href' attributes that the child elements may have
				result.link = $(element).children().attr('href');

				result.websitePublishedDate = $(element).next().children('meta').first().attr('content')
				// [0].nextElementSibling.children[7].content
				console.log(result.websitePublishedDate)

				Article.update({ link: result.link }, { $setOnInsert: result }, { upsert: true },
					function(err, numAffected) {
						if (err) {
							throw err
						}
					}
				);
			});
			
		});
	}
}

app.listen(3000, function() {
	console.log('App running on port 3000!');
});
