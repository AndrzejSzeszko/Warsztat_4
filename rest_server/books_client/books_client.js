$(document).ready(function() {

    let addingForm = $('#add-form');
    let contentDiv = $('#content');
    // let genres = ();

    function genericAjax(bookId, data, methodType, doneFunc, failFunc){
        $.ajax({
        url: `http://127.0.0.1:8000/book/${bookId}`,
        data: `${data}`,
        type: `${methodType}`,
        dataType: 'json',
        }).done(doneFunc)
          .fail(failFunc);
    }


    function displayBooks(arrayOfBooks) {
        for (let book of arrayOfBooks) {
            let p = $('<p>');
            let strong = $('<strong>', {class: "main-strong", 'data-book-id': book.id, 'data-method': 'GET'});
            let a = $('<a>', {class: "delete-a", 'data-book-id': book.id, 'data-method': 'DELETE'});
            let div = $('<div>', {class: "main-div"});

            strong.text(`${book.id}) ${book.title}`);
            a.text(' delete');
            p.append(strong).append(a).append(div);
            contentDiv.append(p);
            p.find('strong').on('click', unfoldDiv);
            a.on('click', deleteBook);
        }
    }


    function genericFail() {
        alert('Something went wrong.');
    }


    function addBook(event){
        event.preventDefault();

        let currentElem  = $(this);
        let methodType = currentElem.data('method');

        function doneFunc(result) {
            alert('Book has been successfully added to database.');
            displayBooks([result]);
        }

        function failFunc() {
            alert('At least one of input data is invalid.');
        }

        genericAjax('', currentElem.serialize(), methodType, doneFunc, failFunc);
    }


    function unfoldDiv() {
        let currentElem  = $(this);
        let mainDiv = currentElem.siblings('div');
        let bookId = currentElem.data('book-id');
        let methodType = currentElem.data('method');

        function doneFunc (result) {
            for (let key in result) {
                if (key !== 'id') {
                    let div = $(`<div>`, {class: 'main-div-non-form-elem'});
                    let key_span = $(`<span class="key-span" id=${bookId}>${key}: </span>`);
                    let value_span = $(`<span class="value-span" id=${bookId}>${result[key]}</span>`);
                    div.append(key_span, value_span);
                    mainDiv.append(div);
                }
            }

            let modifySpan = $('<span>', {class: "main-div-non-form-elem, modify-span", id: bookId, 'data-method': 'PUT'});
            modifySpan.text('modify');
            modifySpan.on('click', modifyBook);
            mainDiv.append(modifySpan);

            let currentForm = addingForm.clone(true)
                .attr('data-method', 'PUT').addClass('modify-form');
            let submitButton = currentForm.find('button')
                .attr('id', `${bookId}`)
                .text('Save');
            let currentFormInputs = currentForm.find('.book-data');
            let detailsValuesSpans = modifySpan
                .siblings()
                .find('.value-span');

            currentFormInputs.each(function(index) {
                $(this).val(detailsValuesSpans.get(index).innerText);
            });

            submitButton.on('click', saveModifications);

            modifySpan.before(currentForm);
        }

        mainDiv.toggle();

        if (mainDiv.children().length === 0) {
            genericAjax(bookId, '', methodType, doneFunc);
        }
    }


    function deleteBook(event) {
        event.stopPropagation();

        let currentElem = $(this);
        let bookId = currentElem.data('book-id');
        let methodType = currentElem.data('method');
        let confirmation = confirm(`Do you really want to delete this book (ID: ${currentElem.data('book-id')}) from database?`);

        function doneFunc() {
            currentElem.parent()
                .remove();
            alert('Book has been successfully removed from database.');
        }

        function failFunc () {
            alert('At least one of input data is invalid.');
        }

        if (confirmation) {
           genericAjax(bookId, '', methodType, doneFunc, failFunc)
        }
    }


    function modifyBook(event) {
        let currentElem = $(this);
        let mainDivNonFormElem = $('.main-div-non-form-elem');
        let currentForm = currentElem.siblings().filter('form');

        mainDivNonFormElem.toggle();
        currentElem.text(`${currentElem.text() === 'modify' ? 'cancel' : 'modify'}`);
        currentForm.toggle();
    }


    function saveModifications(event) {
        event.preventDefault();
        let currentElem = $(this);
        let currentForm = currentElem.parent();
        let methodType = currentForm.data('method');
        let bookId = currentElem.attr('id');

        function doneFunc(result) {
            alert('Book has been successfully modified.');
            // displayBooks([result]);
        }

        function failFunc() {
            alert('At least one of input data is invalid in modifyed book.');
        }

        genericAjax(bookId, currentForm.serialize(), methodType, doneFunc, failFunc)

    }


    genericAjax('', '', 'GET', displayBooks, genericFail);
    addingForm.on('submit', addBook);

});
