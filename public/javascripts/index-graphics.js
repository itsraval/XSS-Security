var fileUrl;
var countOver = 0;
var isDropped = false;

// load the webpage cookies
function getCookie(){
    var cookies = document.cookie;
    if (cookies === ""){
        // cookies are not setted
        inputLINK();
        setInfo("show");
    }else{
        // get the cookie and load them
        var focusOn = cookies.split("; ").find(row => row.startsWith('ONfocus=')).split('=')[1];
        if(focusOn==="file"){
            inputFILE();
        }else{
            inputLINK();
        }
        setInfo("show");
        if(cookies.split("; ").length>=3){
            var info = cookies.split('; ').find(row => row.startsWith('info=')).split('=')[1];
            setInfo(info);
        }
    }    
}

// set the info tag attributes
function setInfo(text){
    if(text==="show"){
        document.getElementsByClassName("info-button")[0].removeAttribute("id");
        document.getElementsByClassName("info-button")[1].setAttribute("id", "invisible");
        document.getElementsByClassName("info-button")[0].parentNode.parentNode.removeAttribute("id");
    }else{
        document.getElementsByClassName("info-button")[0].setAttribute("id", "invisible");
        document.getElementsByClassName("info-button")[1].removeAttribute("id");
        document.getElementsByClassName("info-button")[0].parentNode.parentNode.setAttribute("id", "comprimeRight");
    }   
}  

// show the info tag
function expandRightLeft(event){
    var img = event.target;
    img.style.display = "none"
    img.previousElementSibling.style.display = "inherit";
    img.parentNode.parentNode.removeAttribute("id");
    document.cookie = "info=show" + "; secure";
}

// hide the info tag
function comprimeRightLeft(event){
    var img = event.target;
    img.style.display = "none"
    img.nextElementSibling.style.display = "inherit";
    img.parentNode.parentNode.setAttribute("id", "comprimeRight");
    document.cookie = "info=hide" + "; secure";
}

// set the button link or file on focus
function OnFocus(name){
    var n = document.getElementById(name);
    var n = document.getElementById(name);
    n.classList.add("buttonOnFocus");
    n.classList.remove("buttonOffFocus");
    n.parentElement.style.color = "white";
    document.cookie = "ONfocus=" + name + "; secure";
}

// set the button link or file off focus
function OffFocus(name){
    var n = document.getElementById(name);
    n.classList.add("buttonOffFocus");
    n.classList.remove("buttonOnFocus");
    n.parentElement.style.color = "var(--blue)";
    document.cookie = "OFFfocus=" + name + "; secure";
}

// set input method URL
function inputLINK(){
    var url = document.getElementById("input-url");

    if (window.getComputedStyle(url).display==="none"){
        // show to user
        document.getElementById("container-file-upload").style.display = "none";
        document.getElementById("container-tooltip").style.display = "none";
        url.style.display = "initial";
    }  
    OnFocus("link");  
    OffFocus("file");    
}

// set input method FILE
function inputFILE(){
    var file = document.getElementById("container-file-upload");

    if (window.getComputedStyle(file).display==="none"){
        // show to user
        document.getElementById("input-url").style.display = "none";
        file.style.display = "block";
        document.getElementById("container-tooltip").style.display = "initial";
    } 
    OnFocus("file");  
    OffFocus("link"); 
}

// click the input button file-input
function chooseFile(){
    document.getElementById("file-input").click();
}

// remove from checkbox  unchecked error class
function removeBackRed(){
    document.getElementById("container-checkbox").classList.remove("checkbox-notChecked");
}

// activate when a file is dragged in the "drop zone" and show it to the user
function dragIn(event){
    event.preventDefault();
    countOver++;
}

// activate when a file over the "drop zone" and show it to the user
function fileOver(event){
    event.preventDefault();
    if (countOver>0) {
        var containerOut = document.getElementById("container-file-upload");
        var containerIn = document.getElementById("container-file-upload-in");
    
        containerOut.style.backgroundColor = "var(--blueL)";
        containerIn.style.backgroundColor = "var(--blueL)";
        containerIn.style.borderColor = "white";
    }    
}

// activate when a file is not over the "drop zone" and show it to the user
function fileNotOver(){
    countOver--;
    if(countOver===0){
        var containerOut = document.getElementById("container-file-upload");
        var containerIn = document.getElementById("container-file-upload-in");
    
        containerOut.style.backgroundColor = "var(--blue)";
        containerIn.style.backgroundColor = "var(--blue)";
        containerIn.style.borderColor = "white";
    }
}

// activate when a file dropped in the "drop zone" and show it to the user
function fileDropped(event){
    // disable default browser drag and drop function
    event.preventDefault();
    if (event.dataTransfer.items) {
        if (event.dataTransfer.items[0].kind === 'file') {
            if(event.dataTransfer.items[0].getAsFile().name.endsWith(".txt")){
                // check if file input is txt format
                fileUrl = event.dataTransfer.items[0].getAsFile();
                // get file

                // show to user
                isDropped = true;

                var img = document.getElementById("file-input-img");
                var text = document.getElementById("file-text");
            
                text.innerText = fileUrl.name;
                img.src = "images/file.svg";
            }
        }
    } 
}

// load the file and show it to the user
function fileLoad(event){    
    var f = document.getElementById("file-input").value;

    if(f.endsWith(".txt")){
        // check if file input is txt format
        fileUrl = event.target;

        // show to user
        var img = document.getElementById("file-input-img");
        var text = document.getElementById("file-text");

        text.innerText = f.split("\\")[2];
        img.src = "images/file.svg";

        isDropped = false;
    }
}