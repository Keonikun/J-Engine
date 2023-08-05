//////////////////////////////////////////////////////////////
//                        SETUP                             //
//////////////////////////////////////////////////////////////

const params = {
    bootProcess: true
}

const desktop = document.querySelector( '.desktop' )
const icon = document.querySelector( '.icon' )
const folder1 = document.querySelector( '.folder1' )
const txt1 = document.querySelector( '.txt1' )
const network = document.querySelector( '.network' )
const bottomBar = document.querySelector( '.bottomBar' )
const startButton = document.querySelector( '.startButton' )
const startMenu = document.querySelector( '.startMenu' )
const shutDown = document.querySelector( '.shutDown' )
const dateDom = document.querySelector( '.date' )
const timeDom = document.querySelector( '.time' )

let apps = []

let startOpen = false

let draggedElement = null
let draggedOption = null

let iconWidth = icon.clientWidth

//////////////////////////////////////////////////////////////
//                     CREATE APPS                          //
//////////////////////////////////////////////////////////////

/**
 *  FOLDERS APP
 */

let foldersApp = {
    label: "myFolder",
    open: false,
    url: "/Users/User418/Documents/myFolder",
    sidePanelElements: ["User418's PC", "Documents", "Pictures", "Videos", "Downloads"],
    folderItems: 
    [
        "Ouroboros", "gif", "ouroboros.gif",
        "Exit", "picture", "exitIcon.png",
        "PC", "picture", "monitor.png",
        "Static", "gif", "computerNoise.gif",
        "Flower", "picture", "startIcon.png",
    ]
}

const openFolder = () =>
{
    createApp( foldersApp, "folder" )
}

/**
 *  TXT APP
 */

const text1 = 
`
Write something here?
`

let txtApp = {
    label: "isSomeoneThere?.txt",
    open: false,
    text: text1
}

const openTxt = () =>
{
    createApp( txtApp, "txt" )
}

/**
 *  NETWORK APP
 */

let networkApp = {
    label: "NETConnect",
    URL: "netconnect.home",
    open: false,
}

const openNetwork = () =>
{
    createApp( networkApp, "network")
}

/**
 *  APP FUNCTIONS
 */

const createApp = ( appObject, appType ) =>
{
    if( appObject.open === false )
    {
        appObject.open = true
        appObject.appMaximized = false
        appObject.appMinimized = false
        appObject.appFocused = false
        appObject.appType = appType
        const dragType = "window"

        // Create the main window
        appObject.window = document.createElement( 'div' )
        appObject.window.classList.add( 'windowApp' )
        appObject.window.setAttribute( 'draggable', false )

        // Focus the window if clicked
        appObject.window.addEventListener( 'click', () =>
        {
            if( appObject.appFocused === false )
            {
                focusApp( appObject )
            }
        } )

        const topBar = document.createElement( 'div' )
        topBar.classList.add( 'windowTopBar' )
        topBar.setAttribute( 'draggable', true )
        // Enabled drag on top bar
        topBar.addEventListener( "dragstart", () =>
        {
            dragStart( dragType, appObject )
            appObject.window.style.width = String( appObject.savedWidth ) + "px"
            appObject.window.style.height = String( appObject.savedHeight ) + "px"
            appObject.appMaximized = false
            resize()
        } )
        appObject.window.appendChild( topBar )

        // Set topbar elements
        const topBarLabel = document.createElement( 'p' )
        topBarLabel.innerHTML = appObject.label
        topBarLabel.classList.add( 'windowTopBarLabel' )
        const topBarButtons = document.createElement( 'div' )
        topBarButtons.classList.add( 'windowTopBarButtons' )
        const exit = document.createElement( 'img' )
        exit.src = '/textures/static/exitIcon.png'
        const maximize = document.createElement( 'img' )
        maximize.src = '/textures/static/maximizeIcon.png'
        const minimize = document.createElement( 'img' )
        minimize.src = '/textures/static/minimizeIcon.png'

        ////////////////////////////////////////////////
        //                  EXIT APPS                 //
        ////////////////////////////////////////////////
        exit.addEventListener( 'click', () =>
        {
            topBar.removeEventListener( "dragStart", () => {} )
            exit.removeEventListener( "click", () => {} )
            maximize.removeEventListener( "click", () => {} )
            minimize.removeEventListener( "click", () => {} )

            if( appObject.appType === "folder" )
            {
                folderItemsArray.forEach( element => {
                    element.removeEventListener( 'click', () => {} )
                } )
            }

            if( appObject.appType === "network" )
            {
                appObject.netHome.removeEventListener('click', () => {})
                appObject.netQuickLink1.removeEventListener('click', () => {})
            }

            exitApp( appObject )
        } )

        maximize.addEventListener( 'click', () =>
        {
            if( appObject.appMaximized === false )
            {
                appObject.appMaximized = true
                maximizeWindow( appObject.window )
            }
            else if( appObject.appMaximized === true )
            {
                appObject.appMaximized = false
                unmaximizeWindow( appObject.window, appObject.savedWidth, appObject.savedHeight )
            }
        } )

        minimize.addEventListener( 'click', () =>
        {
            minimizeWindow( appObject )
        } )

        // Add elements to topbar
        topBarButtons.appendChild( exit )
        topBarButtons.appendChild( maximize )
        topBarButtons.appendChild( minimize )
        topBar.appendChild( topBarLabel )
        topBar.appendChild( topBarButtons )

        // set minimize element on the os bottom bar
        appObject.minimizedElement = document.createElement( 'div' )
        appObject.minimizedElement.classList.add( 'minimizedElement' )
        const minimizedElementText = document.createElement( 'p' )
        minimizedElementText.innerHTML = appObject.label
        appObject.minimizedElement.appendChild( minimizedElementText )
        bottomBar.appendChild( appObject.minimizedElement )

        appObject.minimizedElement.addEventListener( 'click', () =>
        {
            minimizeWindow( appObject )
        } )

        // ADD FINISHED APP TO DOCUMENT
        desktop.appendChild( appObject.window )

        // Update variables
        appObject.height = appObject.window.clientHeight
        appObject.width = appObject.window.clientWidth
        appObject.savedWidth = appObject.window.clientWidth
        appObject.savedHeight = appObject.window.clientHeight

        apps.push( appObject )

        ////////////////////////////////////////////////
        //                    FOLDERS                 //
        ////////////////////////////////////////////////

        let folderItemsArray = []

        if( appType === "folder" )
        {
            // FOLDER ADDRESS BAR
            const folderAddressBar = document.createElement( 'div' )
            folderAddressBar.classList.add( 'folderAddressBar' )
            const folderAddress = document.createElement( 'div' )
            folderAddress.classList.add( 'folderAddress' )
            folderAddressBar.appendChild( folderAddress )
            folderAddress.innerHTML = appObject.url

            // FOLDER SIDE PANEL
            const folderSidePanel = document.createElement( 'div' )
            folderSidePanel.classList.add( 'folderSidePanel' )
            const folderSidePanelElements = document.createElement( 'div' )
            folderSidePanelElements.classList.add( 'folderSidePanelElements' )
            folderSidePanel.appendChild( folderSidePanelElements )

            let sidePanelArray = []
            let sidePaneli = 0
            appObject.sidePanelElements.forEach( element => {
                sidePanelArray[ sidePaneli ] = document.createElement('p')
                sidePanelArray[ sidePaneli ].innerHTML = element
                folderSidePanelElements.appendChild( sidePanelArray[ sidePaneli ] )
                sidePaneli++
            } )

            // FOLDER ITEM LIST
            const folderList = document.createElement( 'div' )
            folderList.classList.add( 'folderList' )
            const folderListElements = document.createElement( 'div' )
            folderListElements.classList.add( 'folderListElements' )
            folderList.appendChild( folderListElements )

            for( let i = 0; i < appObject.folderItems.length / 3; i++ )
            {
                folderItemsArray[ i ] = document.createElement( 'p' )
                folderItemsArray[ i ].innerHTML = appObject.folderItems[ ( i * 3 ) ]
                folderItemsArray[ i ].addEventListener( 'click', () =>
                {
                    if(appObject.folderItems[ ( i * 3 ) + 1 ] === "picture")
                    {
                        folderPreviewElement.src = "/textures/static/" + appObject.folderItems[ ( i * 3 ) + 2 ]
                    }
                    else if(appObject.folderItems[ ( i * 3 ) + 1 ] === "gif")
                    {
                        folderPreviewElement.src = "/textures/animated/" + appObject.folderItems[ ( i * 3 ) + 2 ]
                    }
                } )
                folderListElements.appendChild(folderItemsArray[ i ])
            }

            // FOLDER PREVIEW
            const folderPreview = document.createElement( 'div' )
            folderPreview.classList.add( 'folderPreview' )
            const folderPreviewElement = document.createElement( 'img' )
            folderPreviewElement.classList.add( 'folderPreviewElement' )
            folderPreview.appendChild( folderPreviewElement )

            // ADD DOM ELEMENTS TO MAIN APP WINDOW
            appObject.window.appendChild( folderAddressBar )
            appObject.window.appendChild( folderSidePanel )
            appObject.window.appendChild( folderList )
            appObject.window.appendChild( folderPreview )
        }

        ////////////////////////////////////////////////
        //                    TXT                     //
        ////////////////////////////////////////////////

        if( appType === "txt" )
        {
            appObject.txtEditableArea = document.createElement( 'div' )
            appObject.txtEditableArea.classList.add( 'txtEditableArea' )
            appObject.window.appendChild( appObject.txtEditableArea )
            appObject.txtInput = document.createElement( 'textarea' )
            appObject.txtInput.innerHTML = appObject.text
            appObject.txtInput.classList.add( 'txtInput' )
            appObject.txtEditableArea.appendChild( appObject.txtInput )
        }

        ////////////////////////////////////////////////
        //                    NETWORK                 //
        ////////////////////////////////////////////////
        
        if( appType === "network" )
        {
            const netSearchBar = document.createElement( 'div' )
            netSearchBar.classList.add( 'netSearchBar' )
            appObject.window.appendChild( netSearchBar )

            appObject.netBackward = document.createElement('img')
            appObject.netBackward.src = "/textures/static/navArrowIcon.png"
            appObject.netBackward.classList.add("netBarButton")  
            appObject.netBackward.classList.add("netBackButton") 
            appObject.netBackward.setAttribute('draggable', false) 
            netSearchBar.appendChild(appObject.netBackward)

            appObject.netForward = document.createElement('img')
            appObject.netForward.src = "/textures/static/navArrowIcon.png"
            appObject.netForward.classList.add("netBarButton")  
            appObject.netForward.setAttribute('draggable', false) 
            netSearchBar.appendChild(appObject.netForward)

            appObject.netHome = document.createElement('img')
            appObject.netHome.src = "/textures/static/homeIcon.png"
            appObject.netHome.classList.add("netBarButton")  
            appObject.netHome.setAttribute('draggable', false) 
            netSearchBar.appendChild(appObject.netHome)  

            appObject.netHome.addEventListener('click', () =>
            {
                netEnvironments.classList.add("hidden")
                netQuickLinks.classList.remove("hidden")
                netURL.innerHTML = "netconnect.home"
            })

            const netURL = document.createElement( 'div' )
            netURL.classList.add( 'netURL' )
            netURL.innerHTML = appObject.URL
            netSearchBar.appendChild( netURL )

            const netViewport = document.createElement( 'div' )
            netViewport.classList.add( 'netViewport' )
            appObject.window.appendChild( netViewport )

            /**
             *  WEBSITES
             *          TO DO: GET RID OF EVENT LISTENERS ON EXIT
             */
            // QUICK LINKS WEBSITE
            const netQuickLinks = document.createElement( 'div' )
            netQuickLinks.classList.add( 'netQuickLinks' )
            netViewport.appendChild( netQuickLinks )

            const netQuickLinksHeader = document.createElement( 'div' )
            netQuickLinksHeader.classList.add("netQuickLinksHeader")
            netQuickLinksHeader.innerHTML = "Bookmarks"
            netQuickLinks.appendChild( netQuickLinksHeader )

            appObject.netQuickLink1 = document.createElement( 'a' )
            appObject.netQuickLink1.classList.add("netQuickLink")
            appObject.netQuickLink1.innerHTML = "• Environments"
            netQuickLinks.appendChild(appObject.netQuickLink1)

            // QUICK LINKS EVENT LISTENERS
            appObject.netQuickLink1.addEventListener('click', () =>
            {
                netQuickLinks.classList.add("hidden")
                netEnvironments.classList.remove("hidden")
                netURL.innerHTML = "netconnect.environments"
            })

            // ENVIRONMENTS WEBSITES
            const netEnvironments = document.createElement( 'div' )
            netEnvironments.classList.add( 'netEnvironments' )
            netEnvironments.classList.add( 'hidden' )
            netViewport.appendChild( netEnvironments )

            const netEnvironmentsHeader = document.createElement( 'div' )
            netEnvironmentsHeader.classList.add("netEnvironmentsHeader")
            netEnvironmentsHeader.innerHTML = "Environments"
            netEnvironments.appendChild( netEnvironmentsHeader )

            const netEnvironmentsHR = document.createElement( 'hr' )
            netEnvironmentsHR.classList.add("netEnvironmentsHR")
            netEnvironments.appendChild( netEnvironmentsHR )

            const netEnvironmentsPara1 = document.createElement( 'p' )
            netEnvironmentsPara1.classList.add("netEnvironmentsPara1")
            netEnvironmentsPara1.innerHTML = 
            `
            Web Pages In progress...
            `
            netEnvironments.appendChild( netEnvironmentsPara1 )
        }
    }
}

const exitApp = ( appObject ) =>
{
    appObject.window.remove()
    appObject.open = false
    appObject.minimizedElement.removeEventListener( "click", () => {} )
    appObject.minimizedElement.remove()
}

// TO DO : combine these functions into one
const maximizeWindow = ( window, type ) =>
{
    window.style.left = "50%"
    window.style.top = "50%"
    window.style.width = "100%"
    window.style.height = "100%"
    resize()
}

const unmaximizeWindow = ( window, width, height ) =>
{
    window.style.left = "50%"
    window.style.top = "50%"
    window.style.width = String( width ) + "px"
    window.style.height = String( height ) + "px"
}

const minimizeWindow = ( appObject ) =>
{
    // MINIMIZE WINDOW
    if( appObject.appMinimized === false )
    {
        appObject.appMinimized = true
        appObject.window.style.height = "0"
        appObject.window.style.width = "0"
        appObject.window.style.top = "100%"
        appObject.window.style.left = "50%"

    }
    // UNMAXIMIZE WINDOW
    else if( appObject.appMinimized === true )
    {
        focusApp( appObject )
        appObject.appMinimized = false
        if( appObject.appMaximized === true )
        {
            appObject.window.style.height = "100%"
            appObject.window.style.width = "100%"
        } else {
            appObject.window.style.height = String( appObject.savedHeight) + "px"
            appObject.window.style.width = String( appObject.savedWidth ) + "px"
        }
        appObject.window.style.top = "50%"
        appObject.window.style.left = "50%"
    }
}

const focusApp = ( appObject ) =>
{
    appObject.appFocused = true
    appObject.window.style.zIndex = "2"

    apps.forEach( element =>
    {
        if( appObject !== element )
        {
            unfocus( element )
        }
    } )
}

const unfocus = ( appObject ) =>
{
    appObject.appFocused = false
    appObject.window.style.zIndex = "1"
}

//////////////////////////////////////////////////////////////
//                            OS                            //
//////////////////////////////////////////////////////////////

// OPEN START MENU
startButton.addEventListener( 'click', () =>
{
    if( startOpen === false )
    {
        startOpen = true
        startMenu.classList.add( "open" )
    }
    else if( startOpen === true )
    {
        startOpen = false
        startMenu.classList.remove( "open" )
    }
} )

// SHUT DOWN / EXIT OS
shutDown.addEventListener( 'click', () =>
{
    // close apps
    apps.forEach( element =>
    {
        exitApp( element )
    } )
    shutDown.removeEventListener( 'click', () => {} )
    startButton.removeEventListener( 'click', () => {} )
    window.parent.postMessage( "*", "*" )
    bootInterval = 1
    bootNextInterval = bootInterval
    shuttingDown = true
    time = 0
} )

// Handle Resize

const resize = () =>
{
    iconWidth = icon.clientWidth
    // FIX ICON AND WINDOW RESIZING
}

// Handle icon highlight

const unhighlight = () =>
{
    folder1.classList.remove( 'highlighted' )
    txt1.classList.remove( 'highlighted' )
}

folder1.addEventListener( 'click', () =>
{
    unhighlight()
    folder1.classList.add( 'highlighted' )
} )

txt1.addEventListener( 'click', () =>
{
    unhighlight()
    txt1.classList.add( 'highlighted' )
} )

folder1.addEventListener( 'dblclick', () =>
{
    openFolder()
} )

txt1.addEventListener( 'dblclick', () =>
{
    openTxt()
} )

network.addEventListener( 'dblclick', () =>
{
    openNetwork()
} )

desktop.addEventListener( 'click', () =>
{
    unhighlight()
} )

/**
 *  DRAG AND DROP
 */

const drop = ( event ) =>
{
    event.preventDefault()
    if( draggedElement !== null )
    {
        if( draggedOption !== "window" )
        {
            draggedElement.style.left = String( event.clientX - iconWidth / 2 ) + "px"
            draggedElement.style.top = String( event.clientY - iconWidth / 2 ) + "px"
        }
        else if( draggedOption === "window" )
        {
            draggedElement.window.style.left = String( event.clientX ) + "px"
            draggedElement.window.style.top = String( event.clientY + draggedElement.height / 2 ) + "px"
        }
        draggedElement = null
        draggedOption = null
    } 
}

const dragStart = ( event, window ) =>
{
    draggedElement = event.srcElement
    if( event === "window" )
    {
        draggedOption = "window"
        draggedElement = window
    }
    unhighlight()
}

const dragOver = ( event ) =>
{
    event.preventDefault()
}

/**
 *  BOOT PROCESS
 */

const bootScreen = document.querySelector( '.bootScreen' )
const bootLoad = document.querySelector( '.bootLoad' )

let booting = true
let shuttingDown = false
let bootInterval = 1
let bootNextInterval = bootInterval

const bootAnimation = ( interval ) =>
{
    if( params.bootProcess === false )
    {
        bootScreen.remove()
        booting = false
    }
    if( interval === 2 )
    {
        bootLoad.innerHTML = "booting up"
    }
    if( interval === 3 )
    {
        bootLoad.innerHTML = "booting up."
    }
    if( interval === 4 )
    {
        bootLoad.innerHTML = "booting up.."
    }
    if( interval === 5 )
    {
        bootLoad.innerHTML = "booting up..."
    }
    if( interval === 6 )
    {
        bootLoad.innerHTML = "booting up."
    }
    if( interval === 7 )
    {
        bootLoad.innerHTML = "booting up.."
    }
    if( interval === 8 )
    {
        bootLoad.innerHTML = "booting up..."
    }
    if( interval === 9 )
    {
        bootLoad.innerHTML = "booting up...<br>Logged in as user418."
        document.addEventListener( "click", () =>
        {
            document.removeEventListener( "keypress", () => {} )
            bootLoad.remove()
            bootScreen.remove()
        } )
    }
    if( interval === 11 )
    {
        bootLoad.innerHTML = "booting up...<br>Logged in as user418. <br> (Click To Continue)"
        booting = false
    }
}

const shutdownAnim = ( interval ) =>
{
    if( interval === 1 )
    {
        desktop.appendChild(bootScreen)
    }
    if( interval === 2 )
    {
        bootLoad.innerHTML = "Shutting down."
    }
    if( interval === 3 )
    {
        bootLoad.innerHTML = "Shutting down.."
    }
    if( interval === 4 )
    {
        bootLoad.innerHTML = "Shutting down..."
    }
}

//////////////////////////////////////////////////////////////
//                         UPDATE                           //
//////////////////////////////////////////////////////////////

let time = 0

let realTime = new Date()
let hours = null
let minutes = null
let date = null
let month = null
let year = null

let timeUpdate = 60
let nextTimeUpdate = 0

const update = () =>
{
    // Set date, month, year, and time
    if( time === nextTimeUpdate )
    {
        date = realTime.getDate()
        month = realTime.getMonth()
        year = realTime.getFullYear()
        hours = realTime.getHours()
        minutes = realTime.getMinutes()
        nextTimeUpdate += timeUpdate

        let midday = null
        // set dom elements
        if( hours >= 12 )
        {
            midday = " PM"
        } else {
            midday = " AM"
        }
        if( hours > 12 )
        {
            hours -= 12
        }
        timeDom.innerHTML = String( hours ) + ":" + String( minutes ) + midday
        dateDom.innerHTML = String( month + 1 ) + "/" + String( date ) + "/" + String( year )
    }

    // Animation boot process
    if( time === bootNextInterval && booting === true )
    {
        bootNextInterval += bootInterval
        let bootFrame = bootNextInterval / bootInterval
        bootAnimation( bootFrame )
    }

    if( time === bootNextInterval && shuttingDown === true )
    {
        bootNextInterval += bootInterval
        let bootFrame = bootNextInterval / bootInterval
        shutdownAnim( bootFrame )
        console.log("Shuttinf down")
    }

    // Incriment time
    time ++

    // Limit animation frame rate for performance
    setTimeout( () =>
    {
        window.requestAnimationFrame( update )
    }, 500 )
}

update()