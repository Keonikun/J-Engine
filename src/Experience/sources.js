export default [
    /**
     * ------MODELS-------
     */
    {
        name: 'physMesh',
        type: 'gltfModel',
        path: 'models/physMesh.gltf'
    },
    {
        name: 'staticMesh',
        type: 'gltfModel',
        path: 'models/staticMesh.gltf'
    },
    /**
     * ---------TEXTURES---------
     */
    // simple textures
    {
        name: 'rainTexture',
        type: 'texture',
        path: 'textures/static/rain.png'
    },
    // texture animations
    {
        name: 'waterAnim',
        type: 'texture',
        path: 'textures/animated/waterAnim.png'
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
        name: 'trainCrossing',
        type: 'audio',
        path: 'audio/trainCrossing.ogg'
    },
    {
        name: 'windowRain',
        type: 'audio',
        path: 'audio/windowRain.ogg'
    },
    {
        name: 'rain',
        type: 'audio',
        path: 'audio/rain.ogg'
    },
    {
        name: 'doorOpen',
        type: 'audio',
        path: 'audio/doorOpen.ogg'
    },
    {
        name: 'doorClose',
        type: 'audio',
        path: 'audio/doorClose.ogg'
    },
]