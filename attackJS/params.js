// params obj
function Params(url) {
  this.url = url;
  this.reached = false;
  this.recaptcha = false;
  this.secure = false;
  this.urlPageScanned = "";
  this.form = {
    action: "",
    method: ""
  };
  this.input = [];
  this.testAll = [false, false, false, false, false];
  this.comment = "";
  return this;  
}

// set the params after the scraping
async function setAfterScraping(params, data){
  if (data.comment != ""){
    params.comment = data.comment;
  }else{
    params.urlPageScanned = data.pageUrl;
    params.form.action = data.action;
    params.form.method = data.method;
    for(var i=0; i<data.inputPar.length; i++){
      params.input.push(data.inputPar[i]);
    }
    params.comment = data.comment;
  }
}

// check if it can perform an xss attack
function canXSS(params){
  if(params.form.action != "" && params.form.method != "" && params.input.length > 0){
    return true;
  }else{
    params.reached = true;
    params.secure = true;
    return false;
  }
}

//set reached and recaptcha
function setReRe(params, data){
  params.reached = data.reached;
  params.recaptcha = data.recaptcha;
}

// check if the input is secure or not (every input must be false)
function isSecure(params){
  for(var i=0; i<params.testAll.length; i++){
    if(params.testAll[i]){
      params.secure = false;
      return false;
    }
  }

  for(var i=0; i<params.input.length; i++){
    for(var j=0; j<params.input[i].test.length; j++){
      if(params.input[i].test[j]){
        params.secure = false;
        return false;
      }
    }
  }
  params.secure = true;
  return true;
}

module.exports = { Params, setAfterScraping, canXSS, setReRe, isSecure };