$( document ).ready(function() {
    $('#upload-icon').on('click', function(event) {
    	console.log('upload clicked')
    })

    $('#remove-icon').on('click', function(event) {
    	console.log('remove clicked')
    })

    $('#next-article').on('click', function(event) {
    	console.log('next article please')
    })

    $('#previous-article').on('click', function(event) {
    	console.log('previous article please')
    })

    $('a[href^="#"]:not([href="#/"])').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing');
	});
});