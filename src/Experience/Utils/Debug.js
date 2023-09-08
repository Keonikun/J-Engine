import GUI from 'lil-gui'
import Stats from 'stats.js'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        this.params = {
            fpsMonitor: true
        }

        // Create Debug Menu
        if(this.active)
        {
            this.stats = new Stats()
            if(this.params.fpsMonitor === true)
            {
                this.stats.setMode(0)
            }
            else
            {
                this.stats.setMode()
            }
            document.body.appendChild(this.stats.dom)
            this.gui = new GUI()
            // this.gui.close()
            this.renderDebugFolder = this.gui.addFolder( 'Render Settings' ).close()  
            this.environmentDebugFolder = this.gui.addFolder( 'Environment Settings' ).close()    
            this.playerDebugFolder = this.gui.addFolder( 'Player Settings' ).close()
            this.debugFolder = this.gui.addFolder('Misc')
            this.debugFolder.add(this.params, 'fpsMonitor').onChange(() =>
            {
                if(this.params.fpsMonitor === true)
                {
                    this.stats.setMode(0)

                }
            })
            this.debugFolder.close()
            // this.locationsFolder = this.gui.addFolder( 'Locations' )
        }
    }

    update()
    {
        if(this.active)
        {
            this.stats.begin()

            this.stats.end()
        } 
    }
}