$(document).ready(function() {

    let body = $('body');
    let addingForm = $('#add-form');

    $.ajax({
        url: 'http://127.0.0.1:8000/book/',
        data: '',
        type: 'GET',
        dataType: 'json',
    }).done(displayBooks);

    addingForm.on('submit', addBook);


    function displayBooks(listOfBooks) {
        for (let elem of listOfBooks) {
            let p = $('<p>', {id: elem.id, class: "main-p", title: elem.title});
            let a = $('<a>', {id: elem.id, class: "delete-a"});
            let div = $('<div>', {class: "main-div"});

            p.text(`${elem.id}) ${elem.title}`);
            a.text(' delete');
            p.append(a).append(div);
            body.append(p);
            p.on('click', unfoldDiv);
            a.on('click', deleteBook);
        }
    }


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
        }).done(function(result){
            alert('Book has been successfully added to database.');
            displayBooks([result]);
        }).fail(function(xhr, status, err){
            alert('At least one of input data is invalid.');
        });
    }


    function deleteBook(event) {
        event.stopPropagation();
        let deleteLink = $(this);
        let confirmation = confirm(`Do you really want to delete this book (ID: ${deleteLink.attr('id')}) from database?`);

        if (confirmation) {
           $.ajax({
            url: `http://127.0.0.1:8000/book/${deleteLink.attr('id')}`,
            data: '',
            type: 'DELETE',
            dataType: 'json'
            }).done(function() {
                deleteLink.parent().remove();
                alert('Book has been successfully removed from database.');
            }).fail(function(xhr, status, err){
                alert('At least one of input data is invalid.');
            });
        }

    }

});
