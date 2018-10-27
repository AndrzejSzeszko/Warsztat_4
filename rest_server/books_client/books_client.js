$(document).ready(function() {

    let addingForm = $('#add-form');
    let contentDiv = $('#content');

    function genericAjax(bookId, data, type, doneFunc, failFunc){
        $.ajax({
        url: `http://127.0.0.1:8000/book/${bookId}`,
        data: `${data}`,
        type: `${type}`,
        dataType: 'json',
        }).done(doneFunc)
          .fail(failFunc);
    }


    function displayBooks(arrayOfBooks) {
        for (let book of arrayOfBooks) {
            let p = $('<p>', {class: "main-p", 'data-book-id': book.id, 'data-method': 'GET'});
            let a = $('<a>', {class: "delete-a", 'data-book-id': book.id, 'data-method': 'DELETE'});
            let div = $('<div>', {class: "main-div"});

            p.html(`<strong>${book.id}) ${book.title}</strong>`);
            a.text(' delete');
            p.append(a).append(div);
            contentDiv.append(p);
            p.find('strong').on('click', unfoldDiv);
            a.on('click', deleteBook);
        }
    }


    function genericFail() {
        alert('Something went wrong.');
    }


    function unfoldDiv() {
        let mainDiv = $(this).siblings('div');
        let bookId = $(this).parent().data('book-id');

        mainDiv.toggle();

        if (mainDiv.children().length === 0) {
            $.ajax({
            url: `http://127.0.0.1:8000/book/${bookId}`,
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
        let confirmation = confirm(`Do you really want to delete this book (ID: ${deleteLink.data('book-id')}) from database?`);

        if (confirmation) {
           $.ajax({
            url: `http://127.0.0.1:8000/book/${deleteLink.data('book-id')}`,
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

    genericAjax('', '', 'GET', displayBooks, genericFail);
    addingForm.on('submit', addBook);

});
