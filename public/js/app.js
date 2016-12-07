$( document ).ready(function() {
    var counter = 1

    
    function getLatestArticle() {
        $.getJSON('/latest', function(data) {
            console.log(data)
            $('#data-title').text('Article ' + counter)
            $('#data-header').text(data.title)
            $('#data-link').text(data.link)
            counter++  
        }).done(function(response) {
            getNext(response)
            getPrevious(response)
        })
    }

    function getNext(data) {
        $.getJSON('/next/' + data._id, function(data2) {
            console.log('This is getNext data')
            console.log(data2)
            if (data2 !== null) {
                $('#next-article').attr('data-db-id', data2._id)
            } else {
                $('#next-article').addClass('disabled')
            }
        })
    }

    function getPrevious(data) {
        $.getJSON('/previous/' + data._id, function(data2) {
            console.log('This is getPrevious')
            console.log(data2)
            if (data2 !== null) {
                $('#previous-article').attr('data-db-id', data2._id)
                $('#previous-article').removeClass('disabled')
            }
        })
    }

    getLatestArticle()

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