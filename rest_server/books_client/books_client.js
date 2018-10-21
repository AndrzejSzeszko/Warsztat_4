$(document).ready(function() {
    $.ajax({
        url: 'http://127.0.0.1:8000/book/',
        data: '',
        type: 'GET',
        dataType: 'json',
    }).done(function(result) {
        console.log(result);
        let body = $('body');
        for (let elem of result) {
            body.append(`<p><div>${elem.id}) ${elem.title}`, {id: elem.id, title: elem.title}, '<div>');
            let ps = $('p');
            // ps.text(`${this}) ${}`);
            // .on('click', unfoldDiv);
        }
    }).fail(function(xhr, status, err) {

    }).always(function(xhr, status) {

    })
});


function unfoldDiv() {
    this.next().toggle();
}
