import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Audio
{
    constructor( experience )
    {
        this.experience = experience
        this.camera = this.experience.camera.instance
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.models = this.experience.world.models

        this.params = {
            audioEnabled: true,
            masterVolume: 0.5,
            speakersVisible: false,
            audioHelper: true,
        }

        this.setup()
        this.setFPAudio()
        this.setDebug()
    }

    setup()
    {
        this.speakerGeo = new THREE.BoxGeometry( 0.4, 0.4, 0.4 )
        this.speakerMat = new THREE.MeshBasicMaterial({color:'#ffffff', visible: this.params.speakersVisible})
        
    }

    // set first person audio
    setFPAudio()
    {
        this.listener = new THREE.AudioListener()
        this.listener.getMasterVolume()
        this.listener.setMasterVolume(this.params.masterVolume)

        this.footstep1 = new THREE.PositionalAudio( this.listener )
        this.footstep1.setBuffer(this.resources.items.footstep1)
        this.footstep1.setRefDistance(1)
        this.footstep1.setRolloffFactor(1)
        this.footstep1.setLoop(false)
        this.footstep1.setVolume(1)

        this.footstep2 = new THREE.PositionalAudio( this.listener )
        this.footstep2.setBuffer(this.resources.items.footstep2)
        this.footstep2.setRefDistance(1)
        this.footstep2.setRolloffFactor(1)
        this.footstep2.setLoop(false)
        this.footstep2.setVolume(1.2)

        this.footstep3 = new THREE.PositionalAudio( this.listener )
        this.footstep3.setBuffer(this.resources.items.footstep3)
        this.footstep3.setRefDistance(1)
        this.footstep3.setRolloffFactor(1)
        this.footstep3.setLoop(false)
        this.footstep3.setVolume(1)

        this.footstep4 = new THREE.PositionalAudio( this.listener )
        this.footstep4.setBuffer(this.resources.items.footstep4)
        this.footstep4.setRefDistance(1)
        this.footstep4.setRolloffFactor(1)
        this.footstep4.setLoop(false)
        this.footstep4.setVolume(1)

        this.bootUp = new THREE.PositionalAudio( this.listener )
        this.bootUp.setBuffer(this.resources.items.bootUp)
        this.bootUp.setRefDistance(1)
        this.bootUp.setRolloffFactor(1)
        this.bootUp.setLoop(false)
        this.bootUp.setVolume(0.2)

        this.rain = new THREE.PositionalAudio( this.listener )
        this.rain.setBuffer(this.resources.items.rain)
        this.rain.setRefDistance(1)
        this.rain.setRolloffFactor(1)
        this.rain.setLoop(true)
        this.rain.setVolume(0.07)

        this.wood = new THREE.PositionalAudio( this.listener )
        this.wood.setBuffer(this.resources.items.wood)
        this.wood.setRefDistance(0.3)
        this.wood.setRolloffFactor(1)
        this.wood.setLoop(true)
        this.wood.setVolume(1)

        this.archSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.scene.add(this.archSpeaker)
        this.archSpeaker.position.set(this.models.archSpeaker.position.x, this.models.archSpeaker.position.y, this.models.archSpeaker.position.z)
        this.archSpeaker.add(this.wood)

        this.water = new THREE.PositionalAudio( this.listener )
        this.water.setBuffer(this.resources.items.water)
        this.water.setRefDistance(0.1)
        this.water.setRolloffFactor(1)
        this.water.setLoop(true)
        this.water.setVolume(1)

        this.fountainSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.scene.add(this.fountainSpeaker)
        this.fountainSpeaker.position.set(this.models.fountainSpeaker.position.x, this.models.fountainSpeaker.position.y, this.models.fountainSpeaker.position.z)
        this.fountainSpeaker.add(this.water)

        this.windowRain = new THREE.PositionalAudio( this.listener )
        this.windowRain.setBuffer(this.resources.items.windowRain)
        this.windowRain.setRefDistance(0.3)
        this.windowRain.setRolloffFactor(0.8)
        this.windowRain.setLoop(true)
        this.windowRain.setVolume(1.2)

        this.windowSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        this.scene.add(this.windowSpeaker)
        this.windowSpeaker.position.set(this.models.windowSpeaker.position.x, this.models.windowSpeaker.position.y, this.models.windowSpeaker.position.z)
        this.windowSpeaker.add(this.windowRain)

        this.camera.add( 
            this.listener, 
            this.rain, 
            this.footstep1, 
            this.footstep2, 
            this.footstep3,
            this.footstep4,
            this.bootUp 
        )
    }

    play(sound)
    {
        eval("this." + sound + ".play()")
    }

    pause(sound)
    {
        eval("this." + sound + ".stop()")
    }

    beginAudio()
    {
        gsap.delayedCall(1, () =>
        {
            this.wood.play()
            this.water.play()
            this.windowRain.play()
        })
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.audioDebugFolder
            this.debugFolder.add(this.params, 'masterVolume', 0, 1).onChange(() =>
            {
                this.listener.setMasterVolume(this.params.masterVolume)
            })
            this.debugFolder.close()
        }
    }
}