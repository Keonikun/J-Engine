export default [
    /**
     * ------MODELS-------
     */
    {
        name: 'physMesh',
        type: 'gltfModel',
        path: 'models/physMesh.gltf'
    },
    /**
     * ---------TEXTURES---------
     */
    // texture animations
    {
        name: 'winterAnimation',
        type: 'texture',
        path: 'textures/animations/winterAnimation.png'
    },
    // skybox
    {
        name: 'stormydaysEnvMap',
        type: 'cubeTexture',
        path: 
        [
            'textures/skybox/stormydays/px.png',
            'textures/skybox/stormydays/nx.png',
            'textures/skybox/stormydays/py.png',
            'textures/skybox/stormydays/ny.png',
            'textures/skybox/stormydays/pz.png',
            'textures/skybox/stormydays/nz.png'
        ]
    },
    /**
     * ---------AUDIO-----------
     */
    {
        name: 'footsteps',
        type: 'audio',
        path: 'audio/footsteps.mp3'
    }
]