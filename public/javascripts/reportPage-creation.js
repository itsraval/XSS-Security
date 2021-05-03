function loadPageDefault(){
    const body = document.getElementsByTagName("body")[0];
    const main = document.getElementsByTagName("main")[0];
    const footer = document.getElementsByTagName("footer")[0];
    
    divExpandComprimeAll(body, main);
    loader(body, footer);
    downloadButton(body, footer);
}

// div with 2 buttons: Expand All and Comprime All
function divExpandComprimeAll(body, main){
    var s = `   <div class="expandComprime">
                    <a href="#" onclick="expandTopDownAll();">
                        <div>Expand&nbsp;All</div>
                    </a>
                </div>
                <div class="expandComprime">
                    <a href="#" onclick="comprimeTopDownAll();">
                        <div>Comprime&nbsp;All</div>
                    </a>
                </div>
            `;
    var div = document.createElement("div");
    div.id = "container-expandComprime";
    div.innerHTML = s;
    body.insertBefore(div, main);
}

// div LOADING ANIMATION
function loader(body, footer){
    var div = document.createElement("div");
    div.id = "loader";    
    body.insertBefore(div, footer);
}

// div with Download All button
function downloadButton(body, footer){
    var s = `   <a href="#" onclick="downloadAll();">
                    <div>Download&nbsp;Reports</div>
                </a>
            `;
    var div = document.createElement("div");
    div.id = "container-download";
    div.innerHTML = s;
    body.insertBefore(div, footer);
}

// create element that is not reached
function divNotUrl(url){
    const main = document.getElementsByTagName("main")[0];
    var s = `   <div class="container-title divProblem">
                    <img class="title-img" src="images/problem.svg" alt="security simbol">
                    <p class="url">${url}</p>
                </div>
                <div class="container-description">
                    <p>We could not reach the site. This could be caused by invalid input or the webpage may not be online.
                    Please check if it is online and check your input:<br><b>${url}</b><br><br>It must be a URL and it must have its protocol http or https.
                    </p>
                </div>
            `;
    var div = document.createElement("div");
    div.classList.add("container-site");
    div.innerHTML = s;
    main.appendChild(div);
}

// create element that has recaptcha in the webpage
function divRecaptchaOn(url){
    const main = document.getElementsByTagName("main")[0];
    var s = `   <div class="container-title divProblem">
                    <img class="title-img" src="images/problem.svg" alt="security simbol">
                    <p class="url">${url}</p>
                </div>
                <div class="container-description">
                    <p>We could not perform our tests because the webpage has google recaptcha installed.</p>
                </div>
            `;
    var div = document.createElement("div");
    div.classList.add("container-site");
    div.innerHTML = s;
    main.appendChild(div);
}

// create element of single report
function createElement(params){
    if(!params.reached){
        divNotUrl(params.url);
        return;
    }

    if(params.recaptcha){
        divRecaptchaOn(params.url);
        return;
    }

    var containerSite = document.createElement("div");
    containerSite.classList.add("container-site");

    var containerTop = divTitle(params);
    var containerDescription = divDescription(params);
    var containerSpecification =  divSpecification(params);
    
    containerSite.appendChild(containerTop);
    containerSite.appendChild(containerDescription);
    containerSite.appendChild(containerSpecification);

    const main = document.getElementsByTagName("main")[0];
    main.appendChild(containerSite);
}

// div TITLE
function divTitle(params){
    var url = "";
    if(params.url.includes('https://')){
        url = params.url.split('https://')[1];
    }else if (params.url.includes('http://')){
        url = params.url.split('http://')[1];
    }
    
    var s = `   <div>
                    <img class="title-img" src=${params.secure?"images/secure.svg":"images/dangerous.svg"} alt="security simbol">
                    <p class="url">${url}</p>
                </div>
                <div>
                    <img class="img-link expand" src="images/keydown.svg" alt="expand section" onclick="expandTopDown(event);">
                    <img class="img-link comprime" src="images/keyup.svg" alt="comprime section" onclick="comprimeTopDown(event);">
                    <img class="img-link download" src="images/download.svg" alt="download this report" onclick="download(event);">
                </div>
            `;
    var div = document.createElement("div");
    div.classList.add("container-title");
    div.innerHTML = s;
    params.secure?div.classList.add("secure"):div.classList.add("notSecure");
    return div;
}

// div DESCRIPTION
function divDescription(params){
    var text = "";
    var s = ``;
    // calc numbers of test done
    if(params.input.length==0){
        // case where no inputs or form where found
        s += `<p>This website is 100% secure from our tests.</p>`;  
    }else{
        var numberOfTest = 5 + params.input.length*5;

        // calc numbers of xss attack successful
        var xssSuccessful = 0;
        for(var i=0; i<params.testAll.length; i++){
            if(params.testAll[i]){
                xssSuccessful++;
            }
        }
        for(var i=0; i<params.input.length; i++){
            for(var j=0; j<params.input[i].test.length; j++){
                if(params.input[i].test[j]){
                    xssSuccessful++;
                }
            }
        }

        var percentage = 100 - (((xssSuccessful) * 100) / numberOfTest);
        if(percentage == 100){
            text = "This website is 100% secure from our tests.";
        }else if(percentage >= 75){
            text = "This website is almost secure from our tests. We recommend to check below what went wrong.";
        }else if(percentage >= 50){
            text = "This website is partly secure from our tests. We recommend to check below what went wrong and to increase your webpage security. You can see how in our Info page clicking the tab on the right.";
        }else if(percentage >=25){
            text = "This website is secure from less than half of your tests. We recommend to check below what went wrong and to increase your webpage security. You can see how in our Info page clicking the tab on the right.";
        }else{
            text = "This website is completely insecure from XSS attack! We recommend to check below what went wrong and to look at our Info page, clicking the tab on the right, to understand how to increase your security.";
        }

        s += `  <p> ${text}
                <br>
                <br>Successful XSS attack: ${xssSuccessful}
                <br>Numbers of tests done: ${numberOfTest}
                </p>
            `;
    }
    var div = document.createElement("div");
    div.classList.add("container-description");
    div.innerHTML = s;
    return div;
}

// div SPECIFICATION
function divSpecification(params){
    // FORM or INPUT not found so there is no specification 
    var s = ``;
    if(params.comment != ''){
        s += `  <hr class="separator">
                <p>${params.comment}</p>
            `;
    }else{
        // url page + form
        s += `  <hr class="separator">
                <div class="container-specification-single-line">
                    <div>
                        Url Page Scanned:
                    </div>
                    <div>
                        ${params.urlPageScanned}
                    </div>
                </div>
                
                <div class="container-specification-param">
                    <p>FORM</p>
                    <div class="container-specification-line">
                        <div class="container-specification-left">
                            action:
                        </div>
                        <div>
                            ${params.form.action}
                        </div>
                    </div>
                    <div class="container-specification-line">
                        <div class="container-specification-left">
                            method:
                        </div>
                        <div>
                            ${params.form.method}
                        </div>
                    </div>
                </div>
            `;

        // input
        for(var i=0; i<params.input.length; i++){
            s += `  <div class="container-specification-param">
                    <p>INPUT</p>
                    ${params.input[i].id!=''? inputLine("id", params.input[i].id):""}
                    ${params.input[i].class!=''? inputLine("class", params.input[i].class):""}
                    ${params.input[i].name!=''? inputLine("name", params.input[i].name):""}
                    ${params.input[i].type!=''? inputLine("type", params.input[i].type):""}
                    <div class="container-specification-line">
                        <div class="container-specification-left">
                            tests:
                        </div>
                        <div>
                `;
            for(var j=0; j<params.input[i].test.length; j++){
                s += ` ${params.input[i].test[j]?"Vulnerable":"Secure"} ${j!=params.input[i].test.length-1?" | ":""}`;
            }   
            s += `  </div>
                    </div>
                    </div>

                `;
        }

        // testAll
        s += `  <div class="container-specification-single-line">
                    <div>
                        All inputs tested together: 
                    </div>
                    <div>           
            `;  
        for(var i=0; i<params.testAll.length; i++){
            s += ` ${params.testAll[i]?"Vulnerable":"Secure"} ${i!=params.testAll.length-1?"  |  ":""}`;
        }
        s += `</div></div><br>`;
    }
    var div = document.createElement("div");
    div.classList.add("container-specification");
    div.innerHTML = s;
    return div;
}

function inputLine(p,x){
    var text = `    <div class="container-specification-line">
                        <div class="container-specification-left">
                            ${p}:
                        </div>
                        <div>
                            ${x}
                        </div>
                    </div>
    `;
    return text
}