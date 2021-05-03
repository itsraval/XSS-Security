// expand single
function expandTopDown(event){
    var img = event.target;
    img.style.display = "none"
    img.nextElementSibling.style.display = "inherit";
    img.parentNode.parentNode.nextElementSibling.nextElementSibling.style.display = "inherit";
}

// comprime single
function comprimeTopDown(event){
    var img = event.target;
    img.style.display = "none"
    img.previousElementSibling.style.display = "inherit";
    img.parentNode.parentNode.nextElementSibling.nextElementSibling.style.display = "none";
}

// expand All
function expandTopDownAll(){
    var img = document.getElementsByClassName("expand");
    for(var i=0; i<img.length; i++){
        if (img[i].style.display != "none"){
            img[i].click();
        }
    }
}

// comprime All
function comprimeTopDownAll(){
    var img = document.getElementsByClassName("comprime");
    for(var i=0; i<img.length; i++){
        if (img[i].style.display != "none"){
            img[i].click();
        }
    }
}

// download the div report
function download(event){
    var img = event.target;
    requestPDF(getTextFromEvent(img));
}

// download every report
function downloadAll(){
    var text = ``;
    var main = document.querySelector("main");
    var images = main.getElementsByClassName("download");
    
    for(var i=0; i<images.length; i++){
        text += getTextFromEvent(images[i]);
        if(i<images.length-1){
            text += `<hr>`;
        }
    }
    console.log(text);
    requestPDF(text);
}

// get text from a single website report and make a new html to create the pdf
function getTextFromEvent(img){
    var container = img.parentNode.parentNode.parentNode;
    var classesBgColor = img.parentNode.parentNode.classList;

    var secure = false;
    for (var i=0; i<classesBgColor.length; i++){
        if (classesBgColor[i] == "secure"){
            secure = true;
        }
    }   

    var title = container.getElementsByClassName("url")[0].textContent.trim();
    var description = container.getElementsByClassName("container-description")[0].outerHTML.trim();
    var specification = container.getElementsByClassName("container-specification")[0].textContent.trim();
    if(specification != "FORM not found" && specification != "INPUT not found"){
        specification = specification.replace("FORM","<br>FORM");
        specification = specification.replace("action:", "<br><div class='spec-text'>action:"); 
        specification = specification.replace("method:", "<br>method:"); 
        specification = specification.replace(/INPUT/g,"<br></div>INPUT<div class='spec-text'>");
        specification = specification.replace(/id:/g, "</div><div class='spec-text'>id:"); 
        specification = specification.replace(/name:/g, "</div><div class='spec-text'>name:"); 
        specification = specification.replace(/type:/g, "</div><div class='spec-text'>type:");   
        specification = specification.replace(/tests:/g, "</div><div class='spec-text'>tests:");
        specification = specification.replace("All inputs tested together:", "</div><br>All inputs tested together:");    
    }

    var text = `    <h1 class=${secure?'secure':'dangerous'}>${title}</h1>
                    <h2>Summary</h2>
                    <div class='c'>${description}</div>
                    <h2>Specification</h2>
                    <div class='c'>${specification}</div>
                `;
    return text;
}

// request the pdf from the server and download id
function requestPDF(text){
    var xhttp = new XMLHttpRequest();

    // what do i do whene i get a response
    xhttp.responseType  = 'text';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status == 304){
                var response = xhttp.response;
                var position = response.lastIndexOf("\\");
                var location = "\\pdf\\" + response.substring(position + 1).trim();
                var date = new Date();
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var filename = "XSS Security Report " + months[date.getMonth()] + date.getDate() + ".pdf";
                downloadElement(filename, location);
            }
        }
    };

    // page i request
    xhttp.open("POST", "/makePDF", true);
    // Sending fake form
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Send the data in the body
    xhttp.send("html=" + text);
}

// create anchor element and download the pdf
function downloadElement(filename, pdfURL){
    console.log(filename)
    console.log(pdfURL)

    var element = document.createElement('a');
    element.setAttribute('href', pdfURL);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// infoBox mobile
// caricare pagina su github
