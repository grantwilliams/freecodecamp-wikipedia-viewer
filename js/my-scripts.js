function fetchSearchResults(){
    var searchQuery = $("#search").val();
    var resultsToShow = $("#number-results").val();
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
            gsrlimit: resultsToShow,
            prop: 'pageimages|extracts|images',
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 600,
            exintro: 1,
            explaintext: 1,
            exsentences: 3,
            exlimit: 'max'
        },
        success: function (response) {
            if(!response.hasOwnProperty('query')) {
                $("#results").html(''); // clears results after new search
                $("#search-error").html("No results found, please check your spelling and try again")
            } else {
                displayResults(response);
            }
        }
    });
    return false;
}

function addImageHtml(imageHtml, resultNumber) {
    var currentDiv = '#result-' + resultNumber;
    $(currentDiv).append(imageHtml);
}

function displayResults(data) {
    $("#results").html(''); // clears results after new search
    $("#search-error").html('<p></p>'); //clears error message after successful search
    // var imageAPI = "https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&titles=File:";

    var html = '';
    var pageUrl = "http://en.wikipedia.org/?curid=";
    
    $("#main").addClass("after-search", 1000).removeClass("start", 1000);

    // console.log(data.query.pages);
    var sortable = [];
    for (var item in data.query.pages) {
        sortable.push([item, data.query.pages[item].index]);
    }
    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    var sortedObject = [];
    for (var i = 0; i < sortable.length; i++) {
        sortedObject.push(data.query.pages[sortable[i][0]])
    }
    console.log(sortedObject);
    console.log(data);
    var result = 1;
    for(var j = 0; j < sortedObject.length; j++) {
        // console.log(data.query.pages[key]);
        var extract;
        if (sortedObject[j].extract === undefined) {
            extract = "No summary available, please click to view article.";
        } else {
            extract = sortedObject[j].extract;
        }
        html = '<a href="' + pageUrl + sortedObject[j].pageid + '" target="_blank"><div class="search-result container-fluid"><div class="col-md-10"><h3>' + sortedObject[j].title + '</h3><p>' + extract + '</p></div>' +
            '<div class="col-md-2" id="result-' + result + '"></div></div></a>';
        $("#results").append(html);
        if (sortedObject[j].hasOwnProperty('thumbnail')) {
            var image = sortedObject[j]['thumbnail']['source'];
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