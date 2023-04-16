# J-Engine
 A THREE.js engine with a collection of tools to create online 3D/2D experiences.

#### Table of Contents
-[Features](#Features)
-[In Development](#In-Development)
-[Installation](#Installation)
-[Sources](#Sources)

## Features

- First Person Controls with basic collision detection
- Open doors and talk with NPC's!
- Text dialogue with choice-based events
- Dynamic world events
- Footsteps while walking!
- Day/night cycle
- Animated textures (three-plain-animator)
- Basic Weather System (rain)
- 'Editor' mode (debug)

## In Development/ To do

- CSS Renderer (html within 3d scene)
- Skybox implementation
- NPC AI
- Prevent rain indoors
- Mesh-instancing to imrpove performance
- In-game graphical settings UI to adjust render quality
- Audio adjustment bar
- UI notifier improvements
- 

## Preview

https://juliendarling-funk.com/Engine/index.html

## Installation

1. Click 'Code', then download zip or open with Github Desktop.
2. Unzip file and open folder with IDE (code editor): https://code.visualstudio.com/
3. In the IDE terminal
4. ```'npm install'```
5. To run the project locally
6. ```'npm run dev'```

The 3d model used within this project is my own. You are free to use everything else within this tool for your own projects.

If you are interested in using the engine and have questions, contact me at juliendf@me.com and I would be happy to give you a quick tutorial!

## How to load your own map!

You will need to export your 3D map as a gltf file with a specific structure.

The map is divided into two components: StaticMesh and PhysMesh.

PhysMesh consists of every object that can collide with the player.
StaticMesh consists of every object the player does not interact with. More complex models should be placed here.

Simple Method (Bad Performance):

If you do not care about good performance, parent all objects in your 3D scene to an empty object and title it 'PhysMesh'. Export the scene as 'scene.gltf' replace the existing scene.gltf in /static/models/.

Performant Method:

Select all the items you want the player to collide with and parent it to an empty object. Title this empty 'PhysMesh'.
Select everything else and merge them into one mesh. Title this mesh 'StaticMesh'.
While exporting the scene, consider using DRACO compression (When exporting in blender, it is under the 'data' tab). This will reduce file size and improve performance even more.
Export the scene as 'scene.gltf' replace the existing scene.gltf in /static/models/.


## Sources

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


## Liscences

GLTF Models and Textures Copyright Julien Darling-Funk 2023

J-Engine Tool: MIT Liscence
