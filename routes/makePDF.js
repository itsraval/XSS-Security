const express = require('express');
const { exec } = require('child_process');
const fs = require('fs')
var countFileName = 0;

var router = express.Router();

router.post('/', async function(req, res, next) {
    var html = req.body.html;
    var location = generatePDF(html);
    setTimeout(() => {
        res.end(location);
    }, 2000);
    console.log("File sent: " + location);

    // delete file after time
    var timer = 300; // seconds
    setTimeout(() => {
        fs.unlink(location, (err) => {
            if (err) {
                if(err != null){
                    console.error(err)
                }
                return
            }
        });
        console.log("File deleted: " + location);
    }, timer * 1000);
});

// generate the report
// execute the wkhtmltopdf command
function generatePDF(html){  
    // format pdfText for batch
    var text = head() + header() + "<body>" + html + "</body>" + footer();  
    var c = countFileName;
    countFileName++;
    var htmlFile = ".\\htmlToPDF\\htmlReport" + c + ".html";
    var fileLocation = '.\\public\\pdf\\XSS Security Report' + c +'.pdf'
    var command = 'wkhtmltopdf.exe ' + htmlFile +  ' "' + fileLocation + '"';

    // make file html
    fs.writeFileSync(htmlFile, text, (err) => {
        if (err) {
            if(err != null){
                console.error(err)
            }
            return;
        }
    });

    // run command
    exec(command, (error) => {
        if (error) {
            console.error(error);
        }
    });

    var timer = 30;//seconds
    setTimeout(() => {
        fs.unlink(htmlFile, (err) => {
            if (err) {
                if(err != null){
                    console.error(err)
                }
                return
            }
        });
        console.log("File deleted: " + htmlFile);
    }, timer * 1000);

    return fileLocation; 
}

// define head of pdf file
function head(){
    return `    <head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap">
                    <style>
                        body {
                            font-family: 'Montserrat';
                        }
                        
                        h2   {
                            margin-left: 30px; margin-bottom: 10px;
                        }
                                                
                        hr   {
                            margin-top: 30px; margin-left: 12.5%; width: 75%; border-top: 3px solid #1a75ff;
                        }
                        
                        footer {
                            margin-top: 35px; font-size: 15px; text-align: center;
                        }

                        .c  {
                            margin-left: 50px; margin-right: 50px; text-align: justify;
                        }
                        
                        .secure {
                            color: green;
                        }
                        
                        .dangerous {
                            color: red;
                        }

                        .spec-text{
                            margin-left: 50px;
                        }

                        .footer-link {
                            color: #1a75ff; text-decoration: none;
                        }
                    </style>
                </head>
            `;
}


// define header of pdf file
function header(){
    return `    <h1 style='font-size: 40px; text-align:center; color: #1a75ff;'>XSS Security Report</h1>
            `;
}

// define footer of pdf file
function footer(){
    return `    <footer>
                    <p>
                        Open source project avaible on <a class="footer-link"><b>GitHub</b></a><br>
                        Made by <a class="footer-link"><b>Alessandro Ravizzotti</b></a> &#169; 2021
                    </p>
                    <p>https://alessandro.ravizzotti.tk/</p>
                </footer>
            `;
}

module.exports = router;




// const express = require('express');
// const { exec } = require('child_process');
// const fs = require('fs')
// var countFileName = 0;

// var router = express.Router();

// router.post('/', async function(req, res, next) {
//     html = req.body.html;

//     console.log(html);
//     var location = generatePDF(html);

//     // wait file exists
//     while(true){
//         if(fs.existsSync(location)){
//             break;
//         }
//     }
//     // add 1 sec (need)
//     setTimeout(() => {
//         res.end(location);
//     }, 1000);
//     console.log("File sent: " + location);

//     // delete file after time
//     var timer = 300; // seconds
//     setTimeout(() => {
//         fs.unlink(location, (err) => {
//             if (err) {
//                 if(err != null){
//                     console.error(err)
//                 }
//                 return
//             }
//         });
//         console.log("File deleted: " + location);
//     }, timer * 1000);
// });

// // generate the report
// // execute the wkhtmltopdf command
// function generatePDF(html){  
//     // format pdfText for batch
//     var text = head() + header() + "<body>" + html + "</body>" + footer();  
//     text = text.replace(/\n/g," ");
//     text = text.replace(/\s\s+/g, " ");
//     text = text.replace(/"/g,"'");

//     var c = countFileName;
//     countFileName++;

//     console.log(text);

//     var inputFile = ".\\htmlToPDF\\htmlReport" + c + ".html";
//     var fileLocation = '.\\public\\pdf\\XSS Security Report' + c +'.pdf'
//     var command = 'wkhtmltopdf.exe ' + inputFile +  ' "' + fileLocation + '"';

//     fs.writeFile(inputFile, text, (err) => {
//         // make file html
//         if (err) {
//             if(err != null){
//                 console.error(err)
//             }
//             return
//         }

//         exec(command, (error) => {
//             // run command
//             if (error) {
//                 console.error(error);
//             }
    
//         });

//     });

//     // // wait until the file is made
//     // while(true){
//     //     if(fs.existsSync(inputFile)){
//     //         setTimeout(() => {
//     //             console.log("Html created:" + inputFile);
//     //         }, 2000);
//     //         break;
//     //     }
//     // }
   
    
//     //var fileLocation = '.\\public\\pdf\\XSS Security Report' + c +'.pdf'
//     // var command = 'wkhtmltopdf.exe ' + inputFile +  ' "' + fileLocation + '"';
//     // // file html -> pdf

//     // console.log("start");
//     // exec(command, (error) => {
//     //     // run command
//     //     if (error) {
//     //         console.error(error);
//     //     }

//     // });

//     // var timer = 20;//seconds
//     // setTimeout(() => {
//     //     fs.unlink(inputFile, (err) => {
//     //         if (err) {
//     //             if(err != null){
//     //                 console.error(err)
//     //             }
//     //             return
//     //         }
//     //     });
//     //     console.log("File deleted: " + inputFile);
//     // }, timer * 1000);

//     return fileLocation;
// }
