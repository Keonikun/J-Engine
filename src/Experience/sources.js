export default [

    /**
     * ------MODELS-------
     */
    {
        name: 'gltfScene',
        type: 'gltfModel',
        path: '/models/scene.gltf'
    },
    /**
     * ---------TEXTURES---------
     */
    // simple textures
    {
        name: 'rainTexture',
        type: 'texture',
        path: '/textures/static/rain.png'
    },
    // texture animations
    {
        name: 'waterAnim',
        type: 'texture',
        path: '/textures/animated/waterAnim.png'
    },
    {
        name: 'rainAnim',
        type: 'texture',
        path: '/textures/animated/rainAnim.png'
    },
    {
        name: 'staticAnim',
        type: 'texture',
        path: '/textures/animated/static.png'
    },
    {
        name: 'rippleAnim',
        type: 'texture',
        path: '/textures/animated/ripple.png'
    },
    {
        name: 'fanAnim',
        type: 'texture',
        path: '/textures/animated/fan.png'
    },
    /**
     * ---------AUDIO-----------
     */
    {
        name: 'footstep1',
        type: 'audio',
        path: '/audio/footstep1.mp3'
    },
    {
        name: 'footstep2',
        type: 'audio',
        path: '/audio/footstep2.mp3'
    },
    {
        name: 'footstep3',
        type: 'audio',
        path: '/audio/footstep3.mp3'
    },
    {
        name: 'footstep4',
        type: 'audio',
        path: '/audio/footstep4.mp3'
    },
    {
        name: 'windowRain',
        type: 'audio',
        path: '/audio/windowRain.mp3'
    },
    {
        name: 'rain',
        type: 'audio',
        path: '/audio/rain.mp3'
    },
    {
        name: 'doorOpen1',
        type: 'audio',
        path: '/audio/doorOpen1.mp3'
    },
    {
        name: 'doorOpen2',
        type: 'audio',
        path: '/audio/doorOpen2.mp3'
    },
    {
        name: 'doorOpen3',
        type: 'audio',
        path: '/audio/doorOpen3.mp3'
    },
    {
        name: 'doorOpen4',
        type: 'audio',
        path: '/audio/doorOpen4.mp3'
    },
    {
        name: 'doorClose1',
        type: 'audio',
        path: '/audio/doorClose1.mp3'
    },
    {
        name: 'doorClose2',
        type: 'audio',
        path: '/audio/doorClose2.mp3'
    },
    {
        name: 'doorClose3',
        type: 'audio',
        path: '/audio/doorClose3.mp3'
    },
    {
        name: 'water',
        type: 'audio',
        path: '/audio/water.mp3'
    },
    {
        name: 'wind',
        type: 'audio',
        path: '/audio/wind.mp3'
    },
    {
        name: 'bootUp',
        type: 'audio',
        path: '/audio/bootUp.mp3'
    },
    {
        name: 'wood',
        type: 'audio',
        path: '/audio/wood.mp3'
    },
    {
        name: 'clock',
        type: 'audio',
        path: '/audio/clock.mp3'
    },
    {
        name: 'drip',
        type: 'audio',
        path: '/audio/drip.mp3'
    },
    {
        name: 'static',
        type: 'audio',
        path: '/audio/static.mp3'
    },
    {
        name: 'elevatorMoving',
        type: 'audio',
        path: '/audio/elevatorMoving.mp3'
    },
    {
        name: 'elevatorOpen',
        type: 'audio',
        path: '/audio/elevatorOpen.mp3'
    },
    {
        name: 'elevatorClose',
        type: 'audio',
        path: '/audio/elevatorClose.mp3'
    },
    /**
     * ---------HDR-----------
     */
    {
        name: 'studioHDR',
        type: 'HDR',
        path: '/textures/static/studio.hdr'
    },
    /**
     * --------Cube Map---------
     */
    {
        name: 'dayMap',
        type: 'cubeTexture',
        path: 
       [
            '/textures/static/cubeMap/px.jpg',
            '/textures/static/cubeMap/nx.jpg',
            '/textures/static/cubeMap/py.jpg',
            '/textures/static/cubeMap/ny.jpg',
            '/textures/static/cubeMap/pz.jpg',
            '/textures/static/cubeMap/nz.jpg'

        ]
    },
]