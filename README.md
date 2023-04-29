# J-Engine

### A Webgl Game-Engine

This game engine is programmed in THREE.js. It attempts to add the most basic features
of a standard game engine, while also keeping backwards compatability in mind. My goal
is to make this engine work on devices that are 10 years old. The engine is currently
in heavy development, however you are more than welcome to install it and use it to make
your own games.

### Preview the engine [here](https://juliendarling-funk.com/Engine/).

## Current Features

- First-Person Controls
- Simple Collisions (very flawed at the moment)
- Performant level management
- Weather system (Rain)
- Day/night cycle
- Interactive objects (Doors, NPC's, Computers)
- in-game OS (In early development)
- Spacial Audio
- Dialogue System
- Dev Mode
- Custom Shaders (Water)

## Installation
1. Download [Node.js](https://nodejs.org/en/download/).
2. Install an IDE of your choice. I use [VSC](https://code.visualstudio.com/).
3. Download this packaged by clicking the green 'code' button at the top of this page and choosing 'Download ZIP'.
4. Unzip the file and open the folder in your IDE.
5. Open your IDE terminal (in VSC, the shortcut is ' control + \` ' for windows and ' command + \` ' for mac) and run these commands:

``` bash
# Install dependencies (FIRST TIME ONLY)
npm install

# Run the local server
npm run dev
```
To build the website, use the following command:

``` bash
# Build for production in the dist/ directory
npm run build
```

## How to load your own map!

You will need a 3D editor. I use [Blender](https://www.blender.org/).

Your exported model will be divided into two components: StaticMesh and PhysMesh. This is to make the scene more performant.

PhysMesh consists of every object that can collide with the player.
StaticMesh consists of every object the player does not interact with. More complex models should be placed here. 

### Simple Method (Bad Performance):

If you do not care about good performance, parent all objects in your 3D scene to an empty object and title it 'PhysMesh'. Export the scene as 'scene.gltf' replace the existing scene.gltf in /static/models/.

### Performant Method:

Select all the items you want the player to collide with and parent it to an empty object. Title this empty 'PhysMesh'.
Select everything else and merge them into one mesh. Title this mesh 'StaticMesh'.
While exporting the scene, consider using DRACO compression (When exporting in blender, it is under the 'data' tab). This will reduce file size and improve performance even more.
Export the scene as 'scene.gltf' replace the existing scene.gltf in /static/models/.

### Things to keep in mind

Webgl limits the performance of your GPU. Try to simplify your scene as much as possible
and keep an eye out for the triangle count of your scene. The scene should not exceed 100,000 triangles or you will notice a dip in performance, especially on older devices.

If you are interested in using the engine and have questions, contact me [here](juliendf@me.com) and I would be happy to give you a quick tutorial!

## In development/Coming-soon

- Skybox implimentation
- Debug options for day/night cycle and weather system
- Snow weather
- More performant weather system
- 'Master control file' for easy access to all parameters
- Blender 'J-Engine' template
- Audio Adjustment UI
- In-game graphical settings UI to adjust render quality
- UI notification improvements
- Mesh instancing to improve performance
- NPC AI
- Prevent rain indoors
- environmentally dynamic footsteps

## Ownership

The 3d model used within this project is my own. You are free to use everything else within this tool for your own projects.

## Sources

MeshBVH by gkjohnson
https://github.com/gkjohnson/three-mesh-bvh

three-plain-animator by MaciejWWojcik

https://github.com/MaciejWWojcik/three-plain-animator

typewriterjs by tameemsafi

https://github.com/tameemsafi/typewriterjs

Footstep audio:
https://freesound.org/people/monte32/sounds/353799/

Train audio:
https://freesound.org/people/180241virtualwindow.co.za/sounds/445769/

Door audio:
https://freesound.org/people/rivernile7/sounds/234244/

Rain audio:
https://freesound.org/people/idomusics/sounds/518863/
