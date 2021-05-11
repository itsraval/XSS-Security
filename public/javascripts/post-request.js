var arrayUrl;
var loaderCount = 0;

// submit button
function submit(){
    function readFile(x){
        var reader = new FileReader();
        reader.onload = function(){
            var text = reader.result.trim();
            arrayUrl = makeArray(text);
            loadRequest();
        };
        if(typeof fileUrl != "undefined"){
            if(isDropped){
                reader.readAsText(fileUrl, "UTF-8");
            }else {
                reader.readAsText(fileUrl.files[0]);
            }
        }
    }

    // read input
    if(document.getElementById("input-checkbox").checked){
        var url = document.getElementById("input-url");

        if (window.getComputedStyle(url).display==="none"){
            //FILE
            readFile();
        }else{
            //URL
            arrayUrl = makeArray(url.value);
            loadRequest()
        }
    }else{
        // SHOW GRAPHIC ERROR
        document.getElementById("container-checkbox").classList.add("checkbox-notChecked");
    }
}

// make array from text
function makeArray(text){
    if(typeof text != "undefined"){
        var array = new Array();
        array = text.split(/\s+/);
        for (var i=0; i<array.length; i++){
            array[i] = array[i].trim();
        }
        return array;
    }  
}

// load the post request
function loadRequest(){
    document.getElementsByTagName("main")[0].innerHTML = "";
    loadPageDefault();

    for(var i=0; i<arrayUrl.length; i++){
        if(checkUrl(arrayUrl[i])){
            postRequest(arrayUrl[i]);
        }else{
            divNotUrl(arrayUrl[i]);
        }
    }
}

// check if the input is an url
function checkUrl(url){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

// make the XMLHttpRequest
function postRequest(url){
    var xhttp = new XMLHttpRequest();
    loaderCount++;

    // what do i do whene i get a response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status == 304){
                var response = JSON.parse(xhttp.responseText);
                // Make response page
                createElement(response);
                loaderCount--;
                if (loaderCount<=0){
                    document.getElementById("loader").style.display = "none";   
                }     
            }
        }
    };

    // page i request
    xhttp.open("POST", "/attack", true);
    // Sending fake form
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Send the data in the body
    xhttp.send("url=" + url);
}