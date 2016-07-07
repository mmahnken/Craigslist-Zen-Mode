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

        var styles = [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              {hue: '#2FBF80'},
              // etc...
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              { hue: "#00ffee" },
              { saturation: 50 }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              { hue: "#BF74BE" },
              { saturation: 50 }
            ]
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              { hue: "#B5FF64" },
              { saturation: 50 },
              { lightness: -50}
            ]
          },
          
          ];

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





