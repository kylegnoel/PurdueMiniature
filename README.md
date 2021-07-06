# CareerCampus
 
 This tool is designed to allow students of Purdue University to navigate through the 3-Dimension miniature version of Purdue campus to discover the resources offered by the Center of Career Opportunity that can assist to the success of their career.
 
 Besides the 3D campus, user can also control the Boilermake Xtra Special and literally navigate through the campus using the arrow/wasd keys. 
 
 It is made possible by Three.js and Cannon.js for 3D rendering and game physics.
 
 ## Definitions
 
 There are a total of 6 platforms as shown below.
 
 <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/PlatformLabeling.png" width="500">
 
 ### 5 Types of building:
 1. Big Academic Building <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/BigAcademicBuilding.PNG" height="100">
 2. Small Academic Building <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/SmallAcademicBuilding.PNG" height="100">
 3. Purdue Memorial Union <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/PMU.PNG" width="100">
 4. Bell Tower <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/BellTower.PNG" height="100">
 5. Gateway to the future <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/GatewayToTheFuture.PNG" height="100">


### 3 Moveable Entities:
1. Boilermaker Xtra Special <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/BoilermakerXtraSpecial.PNG" height="100">
2. Engineering Fountain <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/EngineeringFountain.PNG" height="100">
3. Stop Signs <img src="https://github.com/shenwei0102/PurdueMiniature/blob/master/Images/StopSign.PNG" height="100">

## How to maintain it in CCO's Website?

### Requirement : You must have npm in your machine.

If you do not have npm and have limited admin access, please follow the guide below:
1. Download a zip of the 64-bit Windows binary https://nodejs.org/dist/v14.16.0/node-v14.16.0-win-x64.zip
2. Create folder %USERPROFILE%\bin\nodejs, then extract the zip contents into this folder. (Typically, you may store it in C: or W: drive)
3. Open Command Prompt and set environment variables for your account.
4. ``` setx NODEJS_HOME "%USERPROFILE%\bin\nodejs\node-v14.16.0-win-x64"```
5. ``` setx PATH "%NODEJS_HOME%;%PATH%"```
6. Restart Command Prompt.
7. Confirm installation: ```npm --version```

Because this project is written in ES6 and ITaP's servers are dinosaurs, it is not possible to run this project wihtout transpiling the code to ES5. Therefore, I had to install Webpack and Babel to do the job.

Once changes have been made to the ES6 code, we must first transpile them into an ES5 bundle, here are the steps.
1. Open CMD and cd to the project's root. (It looks something like this: C:\Users\[username]\cco_website\CCO\cco_website>)
2. Enter the following commands:
3.  ```npm install``` 
4.  ```npm run build```

Afther this, you should be able to run the cco_website project and go to /Miniature to try out the tool.
