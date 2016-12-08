$( document ).ready(function() {
    var counter = 1

    
    function getLatestArticle() {
        $.getJSON('/latest', function(data) {
            console.log(data)
            $('#data-title').text('Article ' + counter)
            $('#data-header').text(data.title)
            $('#data-header').attr('data-db-id', data._id)
            $('#data-link').text(data.link)
            if (data.note !== undefined) {
                $('#display-saved-note').text(data.note.body)
                $('#display-saved-note').attr('data-note-id', data.note._id)
            } else {
                $('#display-saved-note').text('This is where a note would be')
                $('#display-saved-note').attr('data-note-id', '')
            }
        }).done(function(response) {
            getNext(response)
            getPrevious(response)
        })
    }

    function displayUpdate(id) {
        $.getJSON('/latest/' + id, function(data) {
            console.log(data)
            $('#data-title').text('Article ' + counter)
            $('#data-header').text(data.title)
            $('#data-header').attr('data-db-id', data._id)
            $('#data-link').text(data.link)
            if (data.note !== undefined) {
                $('#display-saved-note').text(data.note.body)
                $('#display-saved-note').attr('data-note-id', data.note._id)
            } else {
                $('#display-saved-note').text('This is where a note would be')
                $('#display-saved-note').attr('data-note-id', '')
            } 
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
                $('#next-article').removeClass('disabled')
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
            } else {
                $('#previous-article').addClass('disabled')
            }
        })
    }

    getLatestArticle()

    $('#upload-icon').on('click', function(event) {
    	console.log('upload clicked')
        var dbID = $('#data-header').attr('data-db-id')
        console.log(dbID)
        console.log($('#note-area').val())
        $.post('/addNote/' + dbID, {body: $('#note-area').val()})
        .done(function(data) {
            console.log(data)
            console.log('post complete')
            $('#note-area').val('')
            var id = $('#data-header').attr('data-db-id')
            console.log(id)
            $.getJSON('/latest/' + id)
            .done(function(data2) {
                console.log(data2)
                $('#display-saved-note').text(data2.note.body)
                $('#display-saved-note').attr('data-note-id', data2.note._id)
            })
            .fail(function(err) {
                console.log(err)
            })
        })
        .fail(function(err) {
            console.log(err)
        })
    })

// Experimental Code Block; error appears to be with the server side deletion script
    // $('#upload-icon').on('click', function(event) {
    //     console.log('upload clicked')
    //     var dbID = $('#data-header').attr('data-db-id')
    //     console.log(dbID)
    //     console.log($('#note-area').val())
    //     $.post('/addNote/' + dbID, {body: $('#note-area').val()})
    //     .done(function(data) {
    //         console.log(data)
    //         console.log('post complete')
    //         $('#note-area').val('')
    //         var id = $('#data-header').attr('data-db-id')
    //         console.log(id)
    //         return(data)
    //     })
    //     .fail(function(err) {
    //         console.log(err)
    //     }).then(
    //     $.getJSON('/latest/' + $('#data-header').attr('data-db-id'))
    //         .done(function(data2) {
    //             console.log(data2)
    //             $('#display-saved-note').text(data2.note.body)
    //             $('#display-saved-note').attr('data-note-id', data2.note._id)
    //         })
    //         .fail(function(err) {
    //             console.log(err)
    //     }))
    // })

    $('#remove-icon').on('click', function(event) {
    	console.log('remove clicked')
        var noteID = $('#display-saved-note').attr('data-note-id') 
        $.post('/deleteNote/' + noteID)
        .done(function(data) {
            $('#display-saved-note').text('This is where a note would be')
            $('#display-saved-note').attr('data-note-id', '')
            console.log(data)
            console.log('Deletion Complete')
        })       
    })

    $('#next-article').on('click', function(event) {
    	console.log('next article please')
        counter++
        dbID = $('#next-article').attr('data-db-id')
        console.log('data-db-id:', dbID)
        displayUpdate(dbID)
    })

    $('#previous-article').on('click', function(event) {
    	console.log('previous article please')
        counter--
        dbID = $('#previous-article').attr('data-db-id')
        console.log('data-db-id:', dbID)
        displayUpdate(dbID)
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