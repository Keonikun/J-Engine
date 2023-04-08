import { gsap } from "gsap"

export default class Layout
{
    constructor(experience)
    {
        this.experience = experience
        this.textAdventure = this.experience.textAdventure
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug
        this.waitingToCloseNav = false

        this.params = {
            windowMode: 'fullscreen',
            navBoxSetting: 'fullscreen',
            colorProfile: 'grey'
        }

        this.fullscreenEnabled = false

        // To do: Color profiles

        // Load new game
        this.experience.world.on('ready', () =>
        { 
            this.firstPerson = this.experience.firstPerson
            document.querySelector('.loadingText').classList.add('hidden')
            document.querySelector('.startGame').classList.remove('hidden')

            document.querySelector('.startGame').addEventListener('click', () =>
            {
                document.querySelector('.titleScreen').classList.add('hidden')
                gsap.delayedCall(0.5, () =>
                {
                    this.setNavBox('default')
                    document.querySelector('.titleScreen').remove()
                    this.textAdventure.progressToNextEvent(1)
                })
            })   
        })

        this.setDomElements()
        this.setExperienceContainer()
        this.setNavBox()
        this.pinScrollToBottom()
        this.setDebug()
    }

    setDomElements()
    {
        this.experienceContainer = document.querySelector('.experienceContainer')
        this.navBox = document.querySelector('.navBox')
        this.textBox = document.querySelector('.textBox')
        this.arrowControls = document.querySelector('.arrowControls')
        this.folderTabs = document.querySelector('.folderTabs')
        this.fullscreen = document.querySelector('.fullscreen')

        this.folderTabs.addEventListener('click', () =>
        {
            if(this.params.navBoxSetting === 'hidden')
            {
                this.setNavBox('default')
            }
        })

        this.fullscreen.addEventListener('click', () =>
        {
            console.log(this.fullscreenEnabled)
            if(this.fullscreenEnabled === false)
            {
                this.fullscreenEnabled = true

                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                    document.documentElement.msRequestFullscreen();
                }
            }
            else if(this.fullscreenEnabled === true)
            {
                this.fullscreenEnabled = false

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
        })
    }

    setExperienceContainer(parameter)
    {
        if(parameter)
        {
            this.params.windowMode = parameter
        }
        if(this.params.windowMode === 'fullscreen')
        {
            this.experienceContainer.classList.remove('fullSquare')
            this.experienceContainer.classList.remove('square')
            this.camera.resize()
            this.renderer.resize()
        }
        else if(this.params.windowMode === 'fullSquare')
        {
            this.experienceContainer.classList.add('fullSquare')
            this.experienceContainer.classList.remove('square')
            this.camera.resize()
            this.renderer.resize()
        }
        else if(this.params.windowMode === 'square')
        {
            this.experienceContainer.classList.add('square')
            this.experienceContainer.classList.remove('fullSquare')
            this.camera.resize()
            this.renderer.resize()
        }
    }

    setNavBox(parameter)
    {
        if(parameter)
        {
            this.params.navBoxSetting = parameter
        }
        if(this.params.navBoxSetting === 'default')
        {
            this.experienceContainer.classList.add('navBoxDefault')
            this.experienceContainer.classList.remove('navBoxFull')
        }
        if(this.params.navBoxSetting === 'hidden')
        {
            if(this.textAdventure.typewriterWorking === true)
            {
                this.waitToCloseNav()
            }
            else
            {
                this.experienceContainer.classList.remove('navBoxDefault')
                this.experienceContainer.classList.remove('navBoxFull')
            }
        }
        if(this.params.navBoxSetting === 'fullscreen')
        {
            this.experienceContainer.classList.remove('navBoxDefault')
            this.experienceContainer.classList.add('navBoxFull')
        }
    }

    waitToCloseNav()
    {
        if(this.waitingToCloseNav === false)
        {
            this.waitingToCloseNav = true
            this.params.navBoxSetting = 'hidden'
            this.waitToCloseNavInterval = setInterval(() =>
            {
                if(this.textAdventure.typewriterWorking === false)
                {
                    clearInterval(this.waitToCloseNavInterval)
                    gsap.delayedCall(3,() =>
                    {
                        if(this.firstPerson.pointerLockControls.isLocked === false)
                        {
                            this.waitingToCloseNav = false
                        }
                        else if(this.params.navBoxSetting === 'hidden' && this.textAdventure.typewriterWorking === false)
                        {
                            this.experienceContainer.classList.remove('navBoxDefault')
                            this.experienceContainer.classList.remove('navBoxFull')
                            this.waitingToCloseNav = false
                        }
                        else
                        {
                            this.waitingToCloseNav = false
                            this.waitToCloseNav()
                        }
                    })  
                }
            }, 100)
        }
    }

    openNavIfClose()
    {
        if(this.params.navBoxSetting === 'hidden')
        {
            this.setNavBox('default')
            this.waitToCloseNav()
        }
    }

    pinScrollToBottom()
    {
        this.textBoxHeight = 0
        setInterval(() =>
        {
            if(this.textBoxHeight != this.textBox.scrollHeight)
            {
                this.textBox.scrollTo(0,this.textBox.scrollHeight)
            }
            this.textBoxHeight = this.textBox.scrollHeight
            
        }, 50)
    }

    setDebug()
    {
        if(this.debug.active)
        {
            this.debugFolder = this.debug.gui.addFolder('Layout')
            this.debugFolder.add(this.params, 'windowMode', [ 'fullscreen', 'fullSquare', 'square']).onChange(() =>
            {
                this.setExperienceContainer(this.params.windowMode)
            })
            this.debugFolder.add(this.params, 'navBoxSetting', [ 'default', 'hidden', 'fullscreen']).onChange(() =>
            {
                this.setNavBox(this.params.navBoxSetting)
            })
            this.debugFolder.close()
        }
    }
}