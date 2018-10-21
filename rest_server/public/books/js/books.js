$.ajax({
    url: 'http://date.jsontest.com',
    data: {},
    type: 'GET',
    dataType: 'json'
})
    .done(function(result) {
        let dupa = $('#dupa');
        console.log(result.date);
        dupa.text(`FIRST STRING: ${result.date.toString()}`);
    })
    .fail(function(xhr, status, err) {})
    .always(function(xhr, status) {});


$.ajax({
    url: 'https://swapi.co/api/people/4/',
    data: {},
    type: 'GET',
    dataType: 'json'
})
    .done(function(result) {
        let dupa = $('#dupa');
        console.log(result);
        dupa.text(`SECOND STRING: ${result.toString()}`);
    })
    .fail(function(xhr, status, err) {})
    .always(function(xhr, status) {});