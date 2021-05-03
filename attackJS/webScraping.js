const puppeteer = require('puppeteer');

async function getInfo(url){
    var browser = await puppeteer.launch();//{headless: false}
    var page = await browser.newPage();

    var response = await page.goto(url, {waitUntil: 'networkidle2'}).catch((err) =>{
        // page not reached
        browser.close();
        return true;
    });

    // WEBSITE NOT REACHED: EXIT
    if(typeof response === "boolean"){
        return {
            comment: "Page not reached"
        } 
    }

    // get data
    var data = await page.evaluate(() =>{
        // already have input with same name
        function alreadyIn(array, name){
            for(var i=0; i<array.length; i++){
                if(array[i].name == name){
                    return true;
                }
            }
            return false;
        }

        // actualy web page scanned (url may change from input url)
        var pageUrl = window.location.href;

        // find the form
        var form = document.querySelector("form");

        if (form != null){
            // set method and action of the form
            var method = form.method.toLowerCase();            
            var action = form.action;

            // find all the inputs in the form
            var input = form.querySelectorAll("input");
            
            // array input obj
            var inputPar = new Array();

            for(var i=0; i<input.length; i++){
                // add to the array all the inputs with name and are not already in
                if (input[i].name != "" && !alreadyIn(inputPar, input[i].name)){
                    inputPar.push({
                        id: input[i].id,
                        class: input[i].className,
                        name: input[i].name,
                        type: input[i].type,
                        test: [false, false, false, false, false]// numbers of test equal to the numbers of script tested
                    });
                }
            }

            var comment = "";

            if(input.length==0 || inputPar.length==0){
                comment = "INPUT not found";
            }

            return {
                pageUrl,
                method,
                action,
                inputPar,
                comment
            }
        }else{
            // form not found
            return {
                comment: "FORM not found"
            };
        }  
    });
    await browser.close();
    return data;
}

module.exports = { getInfo };