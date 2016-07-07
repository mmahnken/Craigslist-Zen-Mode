var map;
var myLatLng = {};

document.getElementById('url-form').addEventListener('submit', submitLink, false);

function updateMap(evt){
    var newLatLng = {
      lat: Number(evt.currentTarget.dataset.lat),
      lng: Number(evt.currentTarget.dataset.lng)
    };

    if ( myLatLng.lat !== newLatLng.lat && myLatLng.lng !== newLatLng.lng){

        myLatLng = newLatLng;

        $('#map').empty();

        map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 12
        });

        // map.div.style.position = 'fixed';
        // map.div.style.overflow = 'hidden';


        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'This listing.'
        });

        var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"hue":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#222222"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#c5c5c5"},{"weight":"0.7"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#222222"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#e0e0e0"},{"weight":"0.7"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#222222"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#579ab5"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#010608"},{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#222222"}]}];

        map.setOptions({styles:styles});
    }

}

function submitLink(e){
    e.preventDefault();
    // remove old images
    $('#images-container').empty();
    //get link
    var link = document.getElementById('link-input').value;
    //ajax 
    $.ajax({
        url: '/soup',
        method: 'POST',
        data: {'link': link},
        datatype: 'json',
        success: function(data){
            $('#resultsCount').text("0");
            $('#resultsCountText').text("Results: ");
            var data = JSON.parse(data);
            loadListings(data);

        }
    });
}

function loadListings(data){
    var count = 0;
    // Start a count for the tint class
    for (var link in data.list_of_links){
        var href = data.base_url+data.list_of_links[link];
        console.log('loadlisting');
        $.ajax({
            data: {'link': href},
            method: 'POST',
            datatype: 'json',
            url: '/listing',
            success: function(dataU){
                var data = JSON.parse(dataU);
                if (data.images.length > 0){
                    count ++;
                    if (count > 4){
                        count = 0;
                    }
                    
                    putImages(data.images, data.postingUrl, count, data.latlng);
                } else {
                    console.log('not a link');
                }

            },
            error: function(e){
                console.log('nope');
            }
        });
    }
}

function wrapElem( innerElem, wrapType, wrapperAttrType, wrapperAttr, wrapperDataset ){
    var wrapper = document.createElement( wrapType );
    wrapper.appendChild( innerElem);
    if (wrapType == 'a' && wrapperAttrType == 'href'){
        wrapper.href = wrapperAttr;
        wrapper.target = '_blank';
    } else if (wrapperAttrType == 'class'){
        wrapper.className = wrapperAttr;
    }

    if (wrapperDataset.lat){
        wrapper.dataset.lat = wrapperDataset.lat;
        wrapper.dataset.lng = wrapperDataset.lng;
        $(wrapper).on('mouseover', updateMap);
    }
    return wrapper;

}

function putImages(imagesList, urlToPosting, tintCount, dataLatLng){
    var current = $('#resultsCount').text();
    for (var idx in imagesList){
        var newImg = document.createElement("img");
        newImg.setAttribute("src", imagesList[idx]);

        var linkedImg = wrapElem(newImg, "a", "href", urlToPosting, {});
        var tintClass = "tint t" + tintCount;
        var wrappedImg = wrapElem(linkedImg, "figure", "class", tintClass, dataLatLng);

        $('#images-container').append(wrappedImg);
    }
    $('#resultsCount').html(Number(current)+ 1);

}





