$(document).ready(function() {

    let body = $('body');
    let addingForm = $('#add-form');

    $.ajax({
        url: 'http://127.0.0.1:8000/book/',
        data: '',
        type: 'GET',
        dataType: 'json',
    }).done(function(result) {
        for (let elem of result) {
            let p = $('<p>', {id: elem.id, class: "main-p", title: elem.title});
            let div = $('<div>', {class: "main-div"});

            p.text(`${elem.id}) ${elem.title}`);
            p.append(div);
            body.append(p);
            p.on('click', unfoldDiv)
        }
    }).fail(function(xhr, status, err) {

    });

    addingForm.on('submit', addBook);


    function unfoldDiv() {
        let mainDiv = $(this).children('div');
        let book_id = $(this).attr('id');

        mainDiv.toggle();

        if (mainDiv.children().length === 0) {
            $.ajax({
            url: `http://127.0.0.1:8000/book/${$(this).attr('id')}`,
            data: '',
            type: 'GET',
            dataType: 'json'
            }).done(function(result) {
                for (let key in result) {
                    let div = $(`<div>${key}: ${result[key]}</div>`);
                    mainDiv.append(div);
                }
            });
        }

    }


    function addBook(event){
        event.preventDefault();

        $.ajax({
            url: 'http://127.0.0.1:8000/book/',
            data: $(this).serialize(),
            type: 'POST',
            dataType: 'json'
        }).done(function(response){
            let message = $('#message');
            message.text('Book has been successfully added to database.');
            setTimeout(function() {
                message.fadeOut(4000);
            }, 500);
        }).fail(function(xhr, status, err){
            alert('At least one of input data is invalid.');
        });
    }

});
