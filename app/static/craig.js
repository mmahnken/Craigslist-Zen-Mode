document.getElementById('url-form').addEventListener('submit', submitLink, false);

function submitLink(e){
    e.preventDefault();
    //get link
    var link = document.getElementById('link-input').value;
    //ajax 
    $.ajax({
        url: '/soup',
        method: 'POST',
        data: {'link': link},
        datatype: 'json',
        success: function(data){
            var data = JSON.parse(data);
            loadListings(data);
        }
    });
}

function loadListings(data){
    var count = 0;
    // Start a count for the tint class
    for (link in data.list_of_links){
        var href = data.base_url+data.list_of_links[link];
        $.ajax({
            data: {'link': href},
            method: 'POST',
            datatype: 'json',
            url: '/listing',
            success: function(images){
                count ++;
                if (count > 4){
                    count = 0;
                }
                var images = JSON.parse(images)
                putImages(images.images, images.postingUrl, count);

            }
        });
    }
}

function wrapElem( innerElem, wrapType, wrapperAttrType, wrapperAttr ){
    var wrapper = document.createElement( wrapType );
    wrapper.appendChild( innerElem);
    if (wrapType == 'a' && wrapperAttrType == 'href'){
        wrapper.href = wrapperAttr;
    } else if (wrapperAttrType == 'class'){
        wrapper.className = wrapperAttr;
    }
    return wrapper;

}

function putImages(imagesList, urlToPosting, tintCount){
    for (idx in imagesList){
        var newImg = document.createElement("img");
        newImg.setAttribute("src", imagesList[idx]);

        var linkedImg = wrapElem( newImg, "a", "href", urlToPosting);
        var tintClass = "tint t" + tintCount;
        var wrappedImg = wrapElem( linkedImg, "figure", "class", tintClass);

        document.body.appendChild(wrappedImg);
    }
}

