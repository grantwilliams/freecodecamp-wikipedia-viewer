function fetchSearchResults(){
    var searchQuery = $("#search").val();
    console.log(searchQuery);
    $.ajax({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        type: "get",
        dataType: "jsonp",
        url: "https://en.wikipedia.org/w/api.php",
        // url: "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch="+searchQuery+"&gsrlimit=10&prop=pageimages|extracts&pilimit=max" +
        // "&exintro&explaintext&exsentences=1&exlimit=max",
        data: {
            format: 'json',
            action: 'query',
            generator: 'search',
            gsrnamespace: 0,
            gsrsearch: searchQuery,
            gsrlimit: 10,
            prop: 'pageimages|extracts|title',
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 300,
            iiprop: 'url',
            exintro: 1,
            explaintext: 1,
            exsentences: 2,
            exlimit: 'max'
        },
        success: function (response) {
            // console.log(response.query.pages);
            displayResults(response);
        }
    });
    return false;
}

function addImageHtml(imageHtml, resultNumber) {
    var currentDiv = '#result-' + resultNumber;
    console.log(imageHtml + resultNumber);
    $(currentDiv).append(imageHtml);
}

function displayResults(data) {
    var imageAPI = "https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&titles=File:";

    var html = '';
    var pageUrl = "http://en.wikipedia.org/?curid=";
    
    $("#main").addClass("after-search").removeClass("start");

    var result = 1;
    for(var key in data.query.pages) {
        console.log(data.query.pages[key]);
        html = '<a href="' + pageUrl + data.query.pages[key].pageid + '" target="_blank"><div class="search-result container-fluid"><div class="col-md-10"><h4>' + data.query.pages[key].title + '</h4><p>' + data.query.pages[key].extract + '</p></div>' +
            '<div class="col-md-2" id="result-' + result + '"></div></div></a>';
        $("#results").append(html);
        if (data.query.pages[key].hasOwnProperty('thumbnail')) {
            var image = data.query.pages[key]['thumbnail']['source'];
            var imageHtml = '<img class="img-responsive" src="' + image + '">';
            addImageHtml(imageHtml, result);
            // var imageHtml = '';
            // (function(result) {
            //     // console.log(result);
            //     $.ajax({
            //         headers: {
            //             "Content-Type": "application/x-www-form-urlencoded",
            //             "Accept": "application/json"
            //         },
            //         type: "get",
            //         dataType: "jsonp",
            //         data: {format: 'json'},
            //         url: imageAPI + data.query.pages[key].pageimage
            //         ,
            //         success: function (data) {
            //             console.log(data.query.pages);
            //             var image = data.query.pages['-1'].imageinfo['0'].url;
            //             var imageHtml = '<img class="img-responsive" src="' + image + '">';
            //             // console.log(data.query.pages['-1'].imageinfo['0'].url);
            //             // console.log(result);
            //             addImageHtml(imageHtml, result)
            //         }
            //     })
            // })(result);
            // .done(console.log("imagehtml"));
            // var currentDiv = '#result-' + result;
            // $(currentDiv).append(imageHtml);
        }
        result++;
    }

    // $("#results").html(html);

}