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
            colorProfile: 'grey',
            OSOnOpen: false,
            portfolioMode: true,
        }

        this.fullscreenEnabled = false

        // To do: Color profiles

        // Load new game
        this.experience.world.on('ready', () =>
        { 
            console.log("experience loaded")
            this.firstPerson = this.experience.world.firstPerson
            document.querySelector('.loadingText').classList.add('hidden')
            document.querySelector('.startGame').classList.remove('hidden')

            document.querySelector('.startGame').addEventListener('click', () =>
            {
                document.querySelector('.titleScreen').classList.add('hidden')
                this.experience.params.appStart = true
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

        if(this.params.OSOnOpen)
        {
            this.openOS()
        }
    }

    setDomElements()
    {
        this.experienceContainer = document.querySelector('.experienceContainer')
        this.navBox = document.querySelector('.navBox')
        this.textBox = document.querySelector('.textBox')
        this.arrowControls = document.querySelector('.arrowControls')
        this.folderTabs = document.querySelector('.folderTabs')
        this.fullscreen = document.querySelector('.fullscreen')
        this.visuals = document.querySelector('.visuals')
        this.visuals.style.visibility = 'hidden'

        this.folderTabs.addEventListener('click', () =>
        {
            if(this.params.navBoxSetting === 'hidden')
            {
                this.setNavBox('default')
            }
        })

        this.fullscreen.addEventListener('click', () =>
        {
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

        this.focusedTab = 'tab1'

        this.textBoxButton = document.querySelector('.tab1')    
        this.settingsButton = document.querySelector('.tab2')       
        this.settingsButton.addEventListener('click', () =>
        {
            if(this.focusedTab === 'tab1')
            {
                this.textBoxButton.classList.remove('selected')
                this.settingsButton.classList.add('selected')
                this.focusedTab = 'tab2'
                this.experience.params.appStart = false
                this.textBox.classList.add('settings')

                this.settingsContainer = document.createElement('div')
                this.settingsContainer.classList.add('settingsContainer')
                this.navBox.appendChild(this.settingsContainer)

                this.graphicsSettingContainer = document.createElement('div')
                this.settingsContainer.appendChild(this.graphicsSettingContainer)
                this.graphicsSetting = document.createElement('select')
                this.graphicsSetting.innerHTML = 'Graphics Setting'

                this.lowGraphics = document.createElement('option')
                this.lowGraphics.innerHTML = 'Low'
                this.medGraphics = document.createElement('option')
                this.medGraphics.innerHTML = 'Medium'
                this.highGraphics = document.createElement('option')
                this.highGraphics.innerHTML = 'High'

                this.graphicsSetting.appendChild(this.highGraphics)
                this.graphicsSetting.appendChild(this.medGraphics)
                this.graphicsSetting.appendChild(this.lowGraphics)
            }
        })

        this.textBoxButton.addEventListener('click', () =>
        {
            if(this.focusedTab === 'tab2')
            {
                this.settingsButton.classList.remove('selected')
                this.textBoxButton.classList.add('selected')
                this.focusedTab = 'tab1'
                this.experience.params.appStart = true
                this.textBox.classList.remove('settings')
                this.settingsContainer.remove()
            }
        })
        
    }

    openOS()
    {
        this.OSIframe = document.createElement('iframe')
        this.OSIframe.src = './iframe/OS/OS.html'
        this.OSIframe.style.transform = 'translate(-50%,-50%)'
        this.OSIframe.style.left = '50%'
        this.OSIframe.style.top = '50%'
        this.OSIframe.style.position = 'absolute'
        this.OSIframe.style.height = '73vh'
        this.OSIframe.style.width = '73vh'
        this.OSIframe.style.border = 'none'
        this.OSIframe.style.border = '20px solid #676764'


        this.monitorOverlay = document.createElement('img')
        this.monitorOverlay.src = './textures/static/monitor.png'
        this.monitorOverlay.style.height = '100%'
        this.monitorOverlay.style.zIndex = 21
        this.monitorOverlay.style.position = 'absolute'
        this.monitorOverlay.style.left = '50%'
        this.monitorOverlay.style.transform = 'translate(-50%)'
        this.monitorOverlay.style.pointerEvents = 'none'


        this.visuals.style.zIndex = "20"
        this.visuals.appendChild(this.OSIframe)
        this.visuals.appendChild(this.monitorOverlay)

        gsap.delayedCall(0.1, () =>
        {
            this.visuals.style.visibility = 'visible'

        })
    }

    closeOS()
    {
        this.visuals.style.zIndex = "-1"
        this.OSIframe.remove()
    }

    setArrowKeys()
    {
        // this.forwardArrow = false
        // this.backwardArrow = false
        // this.leftArrow = false
        // this.rightArrow = false

        // arrow control elements
        // this.forwardButton = document.querySelector( '.forwardControl' )
        // this.backwardButton = document.querySelector( '.backwardControl' )
        // this.leftButton = document.querySelector( '.leftControl' )
        // this.rightButton = document.querySelector( '.rightControl' )
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
                        if(this.firstPerson.pointerLockControls.isLocked === false && this.firstPerson.disengaged === false)
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

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

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