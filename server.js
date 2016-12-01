// Dependencies
var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var logger = require('morgan');
// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');



// Initialize Express
var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'))

// Database configuration
// var databaseUrl = 'scraper';
// var collections = ['scrapedData'];

// Hook mongojs configuration to the db variabl
// var db = mongojs(databaseUrl, collections);
// db.on('error', function(error) {
//   console.log('Database Error:', error);
// });


// Main route (simple Hello World Message)
app.get('/', function(req, res) {
	res.send('Hello world');
});

// First, tell the console what server.js is doing
console.log('\n***********************************\n' +
	'Grabbing every article name and link\n' +
	'from 9to5mac:' +
	'\n***********************************\n');


// Making a request call for reddit's 'webdev' board. The page's HTML is saved as the callback's third argument
request('https://www.9to5mac.com', function(error, response, html) {

	// Load the HTML into cheerio and save it to a variable
	// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
	var $ = cheerio.load(html);

	// An empty array to save the data that we'll scrape
	var result = [];
	var test = []
	var testvar

	$('article.post-content').each(function(i, element) {
		testvar = $(element).children().children('.elastic-container')

		// var link = title["0"].children[1].children["0"].attribs.href
		console.log('this is the individual title\n', testvar)
		test.push(testvar)
	})

	// With cheerio, find each p-tag with the 'title' class
	// (i: iterator. element: the current element)
	$('h1.post-title').each(function(i, element) {

		// Save the text of the element (this) in a 'title' variable
		var title = $(element).children().text();
		console.log(title)

		// In the currently selected element, look at its child elements (i.e., its a-tags),
		// then save the values for any 'href' attributes that the child elements may have
		var link = $(element).children().attr('href');

		// Save these results in an object that we'll push into the result array we defined earlier
		result.push({
			title: title,
			link: link
		});

	});

	// Log the result once cheerio analyzes each of its selected elements
	// console.log(result);
	// console.log(test)
	// console.log(test[2]["0"].children[1].children["0"].attribs.href)
});

app.listen(3000, function() {
	console.log('App running on port 3000!');
});
