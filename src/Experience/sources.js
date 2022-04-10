export default [
    // GLTF
    {
        // This file will include anything that the player can collide with
        name: 'physMesh',
        type: 'gltfModel',
        path: 'models/physMesh.gltf'
    },
    // Sprite Sheets
    {
        name: 'doorSpriteSheet',
        type: 'texture',
        path: 'textures/spriteSheet/door.jpg'
    },
    // Audio
    {
        name: 'galaxy',
        type: 'audio',
        path: 'audio/galaxy.ogg'
    },
    // Environment Map Texture
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [  
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/nz.jpg',
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/pz.jpg'
        ]
    }
]