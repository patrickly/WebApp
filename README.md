
<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/454412/wastenot_new_logo.png">
</p>

What is it?
-----------

WasteNot is a web-based application for quick and accessible recycling information and protocol, developed for the California State University, Long Beach campus. [Live website](https://csulbwastenot.appspot.com/)

![Alt Text](https://i.imgur.com/O8kGbh7.png)
*Poster made by Greg Violan

Features
--------

*   Searchable database for numerous recyclable and non-recyclable items that can be found inside and outside of campus. Quick and convenient to use, contained in a simple search bar function.
*   List of all recyclable and non-recyclable items in the database, viewable as a complete whole or organized by categories.
*   News and information page presenting information regarding recycling protocol or campus updates from the CSULB Sustainability Office.
*   Quiz game to test your knowledge on the ins-and-outs of recycling. Fun and helpful in teaching a thing or two about recycling.

![Alt Text](https://i.imgur.com/QL7njWH.gif)

Components and Dependencies
---------------------------

The WasteNot system is developed through the MEAN software stack along with the Ionic Framework:

*   MongoDB: NoSQL database
   
*   Express.js: Web framework for backend application development
  
*   Angular: Front-end web design framework for desktop applications
  
*   Node.js: Server framework for backend application development

*   Ionic: Front-end web design framework for mobile applications

Documentation
-------------

For latest documentation, please visit the [Specifications folder in Google Drive](https://drive.google.com/drive/folders/1Tq9V7JjKrlvduev540Utot3w2N6LTzKo?usp=sharing) where you can find documentation information.


Running 
-------

    nodemon is recommended:

    npm install nodemon -g

## Server

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


Contribute
----------

[https://github.com/WasteNotCSULB/WebApp](https://github.com/WasteNotCSULB/WebApp)

Contributors
------------------

WasteNot was built by Group 9 from CESC491A Section 01:

*   [Greg Paolo Violan](https://github.com/violangreg)
*   [Patrick Ly](https://github.com/patrickly)
*   [Brian To](https://github.com/bto96)
*   [Bryson Sherman](https://github.com/brysonsherman)

License
-------

This project uses open-source programs and software licensed under the MIT License. More information regarding licensing can be found at the WasteNot Github [project page](https://github.com/WasteNotCSULB) .

Contact
-------

If you have any questions, inquiries, or found any bugs. Please let us know by contacting us on CSULBWasteNot@gmail.com. Thank you.
