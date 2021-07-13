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

## Contribution

Contributions are always welcomed. To contribute, create a new pull request have have the following in the description:
1. Description and explaination for the changes.
2. Screenshots (if possible)

### 3D Modeling
If you would like to contribute to improve the looks of the campus, always remember to export the 3D object as an ```.obj``` file. Other file format would require a change in the loader under ```WorldPhysics.js```.

### Backend
The game physics can always be improved, if you found improvements on things like better tuning for Boilermaker Xtra Special, feel free to create a PR!

## Project Structure
```
Career Campus/
|
|---Build/
|       |---cannon-es.js
|       |---three.module.js
|
|---Images/                                                       *** various images needed for the project ***
|
|---models/                                                       *** All models are exported to .obj format which includes .mtl files for its material ***
|       |---BoilermakerXtraSpecial/
|       |       |---BoilermakerXtraSpecial.mtl
|       |       |---BoilermakerXtraSpecial.obj
|       |
|       |---EngineeringFountain/
|       |       |---EngineeringFountain.mtl
|       |       |---EngineeringFountain.obj
|       |
|       |---PurdueMiniature/
|       |       |---PurdueMiniature.mtl
|       |       |---PurdueMiniature.obj
|       |
|       |---StopSign/
|       |       |---1358_Stop_Sign.jpg
|       |       |---StopSign.mtl
|       |       |---StopSign.obj
|       |
|       |---Train/
|       |       |---11709_train_v1_L3.mtl
|       |       |---11709_train_v1_L3.obj
|       |       |---11709_train_wood_black_diff.jpg
|       |       |---11709_train_wood_blue_diff.jpg
|       |       |---11709_train_wood_diff.jpg
|
|---src/
|       |---modules/
|       |       |---ContentManager.js               *** This file includes all the content needed for the information card that pops up when mouse hovers over a building ***
|       |       |---ThreeHelper.js                  *** Takes care of all the 3D rendering ***
|       |       |---Vehicle.js                      *** Dedicated to the rendering of the BoilermakerXtra Special and the settings of its physical behavior *** 
|       |       |---WorldPhysics.js                 *** The template for spawning physical objects of the world (buildings, platfroms, etc.)
|       |---utils/
|       |       |---BufferGeometryUtils.js          *** Needed to combine two meshes into one ***
|       |       |---OBJLoader.js                    *** Used to load all 3D Objects in this world ***
|       |       |---OrbitControls.js                *** Enable drag orbit controls ***
|       |---Main.js                                 *** Combines all the files above to produce the Career Campus ***
|
|---index.html                                      *** Simple HTML file to render the project ***
|
|---style.css
```
