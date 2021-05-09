<img src="https://github.com/itsraval/XSS-Security/blob/main/public/images/favicon.png?" width="200" height="200">

# XSS-Security
This project aims to scan a website (or a list of web pages) and search for possible XSS vulnerabilities. Once the tests are finished, a downloadable report is generated with all the specifics on the attacks. If a scanned site is vulnerable to testing, the INFO page specifies methods to try to fix those problems.

# Features
* Search for and scan a website to check if it contains XSS vulnerability
* Support input text or input file (.txt only)
* Drag and Drop input file (.txt only)
* Convert report to PDF
* Download report (.PDF)
* INFO page with specification on terms of service, minimize vulnerability and attack tested 
* Responsive layout
* Mobile friendly
* Automatic dark mode (based on device settings)

# Dependencies/Modules Used (Server-side)
* [Node.js](https://nodejs.org/en/) - Javascript runtime
* [Express](https://expressjs.com/) - Web Framework
* [Puppeteer](https://www.npmjs.com/package/puppeteer) - Provides API to control Chromium over the DevTools Protocol
* [wkhtmltopdf](https://wkhtmltopdf.org/) - Command line tools to render HTML into PDF

# XSS Security Licenses 
* MIT License
* Apache-2.0 License
* GNU LESSER GENERAL PUBLIC LICENSE
