WasteNot Developer Guide

CSULB WasteNot
==============

Developer Guide
===============

![wastenot-logo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/wastenot_new_logo.png)

What is it?
-----------

WasteNot is a web-based application for quick and acessible recycling information and protocol, developed for the California State University, Long Beach campus.

Features
--------

*   Searchable database for numerous recyclable and non-recyclable items that can be found inside and outside of campus. Quick and convenient to use, contained in a simple search bar function.
*   List of all recyclable and non-recyclable items in the database, viewable as a complete whole or organized by categories.
*   News and information page presenting information regarding recycling protocol or campus updates from the CSULB Sustainability Office.
*   Quiz game to test your knowledge on the ins-and-outs of recycling. Fun and helpful in teaching a thing or two about recycling.

Components and Dependencies
---------------------------

The WasteNot system is developed through the MEAN software stack:

*   MongoDB: NoSQL database
![](https://webassets.mongodb.com/_com_assets/cms/MongoDB-Logo-5c3a7405a85675366beb3a5ec4c032348c390b3f142f5e6dddf1d78e2df5cb5c.png)  
  
*   Express.js: Web framework for backend application development
![](https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/express.png)  
  
*   Angular: Front-end web design framework for desktop applications
![](https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/angular-card.png)  
  
*   Node.js: Server framework for backend application development
![](https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/node%20.png)  
  

*   Ionic: Front-end web design development for mobile applications
![](https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/Ionic_Logo.svg_.png)

Documentation
-------------

For latest documentation, please visit the WasteNot Github [project page](https://github.com/WasteNotCSULB) where you can find documentation information.

Contribute
----------

[https://github.com/WasteNotCSULB/WebApp](https://github.com/WasteNotCSULB/WebApp)

Active Maintenance
------------------

WasteNot is currently maintained by Group 9 from CESC491A Section 01:

*   [Greg Paolo Violan](https://github.com/violangreg)
*   [Patrick Ly](https://github.com/patrickly)
*   [Brian To](https://github.com/bto96)
*   [Bryson Sherman](https://github.com/brysonsherman)

License
-------

This project uses open-source programs and software licensed under the MIT License. More information regarding licensing can be found at the WasteNot Github [project page](https://github.com/WasteNotCSULB) .

Contact
-------

If you have any questions, inqueries, or found any bugs. Please let us know by contacting us on CSULBWasteNot.support@gmail.com. Thank you.

# WebApp

    nodemon is recommended:

    npm install nodemon -g

## Server:

Terminal 1:

    git --version  

    node -v

    git clone https://github.com/WasteNotCSULB/WebApp.git

    cd WebApp/

    cd server/
        
    npm install 
    
    node server.js 
    
    ctrl + C
    
    nodemon
  
## Client

Terminal 2:

    cd client/
    cd WasteNotCSULB/

    npm install
    
    ng serve --open
