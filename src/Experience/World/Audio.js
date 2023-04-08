import * as THREE from 'three'

export default class Audio
{
    constructor(experience)
    {
        this.experience = experience
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.params = {
            audioEnabled: true,
            masterVolume: 0.5,
            speakersVisible: true,
            audioHelper: true
        }

        this.setFPListener()
        this.setAudioSources()
        this.setFPAudio()
        this.setDebug()

        document.querySelector('.startGame').addEventListener('click', () =>
        {
            this.playAll()
        })
    }

    // add an audio listener to the camera
    setFPListener()
    {
        this.listener = new THREE.AudioListener()
        this.camera.add( this.listener )
        this.listener.getMasterVolume()
        this.listener.setMasterVolume(this.params.masterVolume)
    }

    setAudioSources()
    {
        this.speakerGeo = new THREE.BoxGeometry( 0.4,0.4,0.4 )
        this.speakerMat = new THREE.MeshBasicMaterial({color:'#ffffff', visible: this.params.speakersVisible})

        this.windowRain = new THREE.PositionalAudio( this.listener )
        this.windowRain.setBuffer( this.resources.items.windowRain )
        this.windowRain.setRefDistance( 1 )
        this.windowRain.setRolloffFactor( 1.5 )
        this.windowRain.setLoop( true )
        this.windowRain.setVolume( 1 )
        this.speaker1 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.speaker1.position.set(20,5.5,5)
        this.speaker1.add( this.windowRain )
        this.scene.add( this.speaker1 )

        this.trainCrossing = new THREE.PositionalAudio( this.listener )
        this.trainCrossing.setBuffer( this.resources.items.trainCrossing )
        this.trainCrossing.setRefDistance( 3 )
        this.trainCrossing.setLoop( true )
        this.trainCrossing.setVolume( 1 )
        this.speaker2 = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.speaker2.position.set(-10,5,15)
        this.speaker2.add( this.trainCrossing )
        this.scene.add( this.speaker2 )

        this.doorOpen = new THREE.PositionalAudio( this.listener )
        this.doorOpen.setBuffer( this.resources.items.doorOpen )
        this.doorOpen.setRefDistance( 1 )
        this.doorOpen.setRolloffFactor( 1.5 )
        this.doorOpen.setLoop( false )
        this.doorOpen.setVolume( 1 )
        this.doorClose = new THREE.PositionalAudio( this.listener )
        this.doorClose.setBuffer( this.resources.items.doorClose )
        this.doorClose.setRefDistance( 1 )
        this.doorClose.setRolloffFactor( 1.5 )
        this.doorClose.setLoop( false )
        this.doorClose.setVolume( 1 )
    }

    setFPAudio()
    {
        this.rain = new THREE.PositionalAudio( this.listener )
        this.rain.setBuffer( this.resources.items.rain )
        this.rain.setRefDistance( 1 )
        this.rain.setRolloffFactor( 1.5 )
        this.rain.setLoop( true )
        this.rain.setVolume( 1 )
        this.camera.add( this.rain, this.doorClose, this.doorOpen )
    }

    play(sound)
    {
        eval("this." + sound + ".play()")
    }

    playAll()
    {
        this.windowRain.play()
        this.trainCrossing.play()
        this.rain.play()
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Audio')
            this.debugFolder.add(this.params, 'masterVolume', 0, 1).onChange(() =>
            {
                this.listener.setMasterVolume(this.params.masterVolume)
            })
            this.debugFolder.close()
        }
    }
}