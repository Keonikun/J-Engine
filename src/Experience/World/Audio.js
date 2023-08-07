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
        this.footstep1.setVolume(0.5)

        this.footstep2 = new THREE.PositionalAudio( this.listener )
        this.footstep2.setBuffer(this.resources.items.footstep2)
        this.footstep2.setRefDistance(1)
        this.footstep2.setRolloffFactor(1)
        this.footstep2.setLoop(false)
        this.footstep2.setVolume(0.7)

        this.footstep3 = new THREE.PositionalAudio( this.listener )
        this.footstep3.setBuffer(this.resources.items.footstep3)
        this.footstep3.setRefDistance(1)
        this.footstep3.setRolloffFactor(1)
        this.footstep3.setLoop(false)
        this.footstep3.setVolume(0.7)

        this.footstep4 = new THREE.PositionalAudio( this.listener )
        this.footstep4.setBuffer(this.resources.items.footstep4)
        this.footstep4.setRefDistance(1)
        this.footstep4.setRolloffFactor(1)
        this.footstep4.setLoop(false)
        this.footstep4.setVolume(0.5)

        this.doorOpen1 = new THREE.PositionalAudio( this.listener )
        this.doorOpen1.setBuffer(this.resources.items.doorOpen1)
        this.doorOpen1.setRefDistance(1)
        this.doorOpen1.setRolloffFactor(1)
        this.doorOpen1.setLoop(false)
        this.doorOpen1.setVolume(1)

        this.doorOpen2 = new THREE.PositionalAudio( this.listener )
        this.doorOpen2.setBuffer(this.resources.items.doorOpen2)
        this.doorOpen2.setRefDistance(1)
        this.doorOpen2.setRolloffFactor(1)
        this.doorOpen2.setLoop(false)
        this.doorOpen2.setVolume(1)

        this.doorOpen3 = new THREE.PositionalAudio( this.listener )
        this.doorOpen3.setBuffer(this.resources.items.doorOpen3)
        this.doorOpen3.setRefDistance(1)
        this.doorOpen3.setRolloffFactor(1)
        this.doorOpen3.setLoop(false)
        this.doorOpen3.setVolume(1)

        this.doorOpen4 = new THREE.PositionalAudio( this.listener )
        this.doorOpen4.setBuffer(this.resources.items.doorOpen4)
        this.doorOpen4.setRefDistance(1)
        this.doorOpen4.setRolloffFactor(1)
        this.doorOpen4.setLoop(false)
        this.doorOpen4.setVolume(1)

        this.doorClose1 = new THREE.PositionalAudio( this.listener )
        this.doorClose1.setBuffer(this.resources.items.doorClose1)
        this.doorClose1.setRefDistance(1)
        this.doorClose1.setRolloffFactor(1)
        this.doorClose1.setLoop(false)
        this.doorClose1.setVolume(1)

        this.doorClose2 = new THREE.PositionalAudio( this.listener )
        this.doorClose2.setBuffer(this.resources.items.doorClose2)
        this.doorClose2.setRefDistance(1)
        this.doorClose2.setRolloffFactor(1)
        this.doorClose2.setLoop(false)
        this.doorClose2.setVolume(0.4)

        this.doorClose3 = new THREE.PositionalAudio( this.listener )
        this.doorClose3.setBuffer(this.resources.items.doorClose3)
        this.doorClose3.setRefDistance(1)
        this.doorClose3.setRolloffFactor(1)
        this.doorClose3.setLoop(false)
        this.doorClose3.setVolume(1)

        this.elevatorOpen = new THREE.PositionalAudio( this.listener )
        this.elevatorOpen.setBuffer(this.resources.items.elevatorOpen)
        this.elevatorOpen.setRefDistance(1)
        this.elevatorOpen.setRolloffFactor(1)
        this.elevatorOpen.setLoop(false)
        this.elevatorOpen.setVolume(1)

        this.elevatorClose = new THREE.PositionalAudio( this.listener )
        this.elevatorClose.setBuffer(this.resources.items.elevatorClose)
        this.elevatorClose.setRefDistance(1)
        this.elevatorClose.setRolloffFactor(1)
        this.elevatorClose.setLoop(false)
        this.elevatorClose.setVolume(1)

        this.elevatorMoving = new THREE.PositionalAudio( this.listener )
        this.elevatorMoving.setBuffer(this.resources.items.elevatorMoving)
        this.elevatorMoving.setRefDistance(1)
        this.elevatorMoving.setRolloffFactor(1)
        this.elevatorMoving.setLoop(false)
        this.elevatorMoving.setVolume(0.5)

        this.doorSpeaker = new THREE.Mesh(this.speakerGeo,this.speakerMat)
        this.scene.add(this.doorSpeaker)
        this.doorSpeaker.add(
            this.doorOpen1, 
            this.doorOpen2, 
            this.doorOpen3, 
            this.doorOpen4, 
            this.doorClose1, 
            this.doorClose2, 
            this.doorClose3,
            this.elevatorClose,
            this.elevatorMoving,
            this.elevatorOpen,
        )

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

        // this.wood = new THREE.PositionalAudio( this.listener )
        // this.wood.setBuffer(this.resources.items.wood)
        // this.wood.setRefDistance(0.3)
        // this.wood.setRolloffFactor(1)
        // this.wood.setLoop(true)
        // this.wood.setVolume(1)

        // this.speaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        // this.scene.add(this.speaker)
        // this.speaker.position.set(this.models.speaker.position.x, this.models.speaker.position.y, this.models.speaker.position.z)
        // this.speaker.add(this.wood)

        // this.water = new THREE.PositionalAudio( this.listener )
        // this.water.setBuffer(this.resources.items.water)
        // this.water.setRefDistance(0.1)
        // this.water.setRolloffFactor(1)
        // this.water.setLoop(true)
        // this.water.setVolume(1)

        // this.fountainSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        // this.scene.add(this.fountainSpeaker)
        // this.fountainSpeaker.position.set(this.models.fountainSpeaker.position.x, this.models.fountainSpeaker.position.y, this.models.fountainSpeaker.position.z)
        // this.fountainSpeaker.add(this.water)

        // this.windowRain = new THREE.PositionalAudio( this.listener )
        // this.windowRain.setBuffer(this.resources.items.windowRain)
        // this.windowRain.setRefDistance(0.5)
        // this.windowRain.setRolloffFactor(2)
        // this.windowRain.setLoop(true)
        // this.windowRain.setVolume(1.2)

        // this.windowSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        // this.scene.add(this.windowSpeaker)
        // this.windowSpeaker.position.set(this.models.windowSpeaker.position.x, this.models.windowSpeaker.position.y, this.models.windowSpeaker.position.z)
        // this.windowSpeaker.add(this.windowRain)

        // this.drip = new THREE.PositionalAudio( this.listener )
        // this.drip.setBuffer(this.resources.items.drip)
        // this.drip.setRefDistance(0.1)
        // this.drip.setRolloffFactor(2)
        // this.drip.setLoop(true)
        // this.drip.setVolume(1.4)

        // this.dripSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        // this.scene.add(this.dripSpeaker)
        // this.dripSpeaker.position.set(this.models.dripSpeaker.position.x, this.models.dripSpeaker.position.y, this.models.dripSpeaker.position.z)
        // this.dripSpeaker.add(this.drip)

        // this.clock = new THREE.PositionalAudio( this.listener )
        // this.clock.setBuffer(this.resources.items.clock)
        // this.clock.setRefDistance(0.2)
        // this.clock.setRolloffFactor(1)
        // this.clock.setLoop(true)
        // this.clock.setVolume(1.2)

        // this.clockSpeaker = new THREE.Mesh( this.speakerGeo, this.speakerMat )
        // this.scene.add(this.clockSpeaker)
        // this.clockSpeaker.position.set(this.models.clockSpeaker.position.x, this.models.clockSpeaker.position.y, this.models.clockSpeaker.position.z)
        // this.clockSpeaker.add(this.clock)

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
            // this.wood.play()
            // this.water.play()
            // this.windowRain.play()
            // this.drip.play()
            // this.clock.play()
        })
    }

    masterVolumeOn()
    {
        gsap.to(this.params, {masterVolume: 0.7, duration:2, onComplete: () => {this.audioChanging = false}}).play()
        this.audioChanging = true
    }

    masterVolumeOff()
    {
        gsap.to(this.params, {masterVolume: 0, duration:2, onComplete: () => {this.audioChanging = false}}).play()
        this.audioChanging = true
    }

    update()
    {
        if(this.audioChanging === true)
        {
            this.listener.setMasterVolume(this.params.masterVolume)
        }
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.debugFolder
            this.debugFolder.add(this.params, 'masterVolume', 0, 1).onChange(() =>
            {
                this.listener.setMasterVolume(this.params.masterVolume)
            })
            this.debugFolder.close()
        }
    }
}