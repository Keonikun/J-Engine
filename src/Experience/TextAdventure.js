import gsap from "gsap"
import Typewriter from "typewriter-effect/dist/core";

export default class TextAdventure
{
    constructor( experience )
    {
        this.experience = experience;
        this.debug = this.experience.debug;

        // PROGRESSION VALUES:
        // 0 = EVENTSTATE
        // 1 = Score
        this.progressionState = [ 0, 0 ];
        this.choiceResult = null;
        this.typewriterWorking = false;
        this.dialogueFocused = false;
        
        this.experience.world.on( 'ready', () =>
        {
            this.interactiveObjects = this.experience.world.interactiveObjects;
        });
        
        // currently, cursor does not work as intended. Leave as "" for now
        this.params = {
            textCursor: "",
            typeSpeed: 20,
            textDelay: 1000,
            textBoxInput: false,
            arrowControls: false
        };

        this.setDebug();
        this.createTypewriter();
    };

    event( eventNumber, choiceResult )
    {
        // Each event must have a unique value
        if( eventNumber === 1 )
        {
            if( this.debug.active )
            {
                
                this.typewriter.typeString( "<a class='choice1' href='#home' style='color:crimson'>Exit Dev Mode</a>" );
                this.typeEvent( 'singleChoice',2 );
            }
            else
            {
                // Create typing sequence in the order you would like the text to appear.

                
                this.typewriter.typeString( "<a class='choice1' href='#debug' style='color:green'>Dev Mode</a>" );
                // Begin the typing sequence with this.typeEvent() 
                // First value is the event type: choice, singleChoice, progressToNext, or none
                // Second value is the event you would like to move to.
                this.typeEvent( 'singleChoice', 2 );
            }    
        }

        if( eventNumber === 2 )
        {
            // If event is a choice, seperate into two if statements like so:
            if( choiceResult === 1 )
            {

                gsap.delayedCall( 0.1, () =>
                {
                    window.location.reload();
                });
                this.typewriter.typeString( "<p>You chose the first choice!</p>" );
                this.typewriter.typeString( "<a class='choice1' style='color:cornsilk'>Repeat Text</a>" );
                this.typeEvent( 'singleChoice', 1 );

            };
            if( choiceResult === 2 )
            {
                this.typewriter.typeString( "<p>You chose the second choice!</p>" );
                this.typewriter.typeString( "<a class='choice1' style='color:cornsilk'>Repeat Text</a>" );
                this.typeEvent( 'singleChoice', 1 );
            };
        }
    };

    printString( string )
    {
        this.typewriter.typeString( string );
        this.typeEvent();
    };

    choice(eventNumber)
    {
        document.querySelector('.choice1').addEventListener('click', () =>
        {
            this.choiceResult = 1;
            this.progressToNextEvent(eventNumber);
            document.querySelector('.choice1').removeEventListener('click',() => {});
            document.querySelector('.choice1').remove();
            document.querySelector('.choice2').removeEventListener('click',() => {});
            document.querySelector('.choice2').remove();
            if(document.querySelector('.release'))
            {
                document.querySelector('.release').removeEventListener('click', ()=>{});
                document.querySelector('.release').remove();
            };
        })
        document.querySelector('.choice2').addEventListener('click', () =>
        {
            this.choiceResult = 2;
            this.progressToNextEvent(eventNumber);
            document.querySelector('.choice1').removeEventListener('click',() => {});
            document.querySelector('.choice1').remove();
            document.querySelector('.choice2').removeEventListener('click',() => {});
            document.querySelector('.choice2').remove();
            if(document.querySelector('.release'))
            {
                document.querySelector('.release').removeEventListener('click', ()=>{});
                document.querySelector('.release').remove();
            };
        })
        if(document.querySelector('.release'))
        {
            this.release();
        };
    }

    singleChoice(eventNumber)
    {
        document.querySelector('.choice1').addEventListener('click', () =>
        {
            this.choiceResult = 1;
            this.progressToNextEvent(eventNumber);
            document.querySelector('.choice1').removeEventListener('click',() => {});
            document.querySelector('.choice1').remove();
        });
    };

    progressToNextEvent(eventNumber)
    {
        gsap.delayedCall(0.4, () =>
        {
            this.progressionState[0] = eventNumber;
            this.event(this.progressionState[0],this.choiceResult);
        });
    }

    release()
    {
        document.querySelector('.release').addEventListener('click', () =>
        {
            document.querySelector('.release').removeEventListener('click', ()=>{});
            document.querySelector('.release').remove();
            this.dialogueFocused = false;
            this.experience.world.firstPerson.lockPointer();
            document.querySelector('.experienceContainer').classList.add('navBoxHidden');
            document.querySelector('.experienceContainer').classList.remove('navBoxDefault');
        })
    }

    triggerEvent(eventNumber)
    {
        if(document.querySelector('.choice1'))
        {
            document.querySelector('.choice1').removeEventListener('click',() => {})
            document.querySelector('.choice1').remove()
        }
        if(document.querySelector('.choice2'))
        {
            document.querySelector('.choice2').removeEventListener('click',() => {})
            document.querySelector('.choice2').remove()
        }
        
        this.progressToNextEvent(eventNumber)
    }

    changeScore(amountToAdd,clear)
    {
        this.scoreDom = document.querySelector('.score')
        if(clear === true)
        {
            this.progressionState[1] = 0
            this.scoreDom.innerHTML = "Score" + String(this.progressionState[7])
            localStorage.setItem("score", this.progressionState[7])
        }
        else
        {
            this.progressionState[1] += amountToAdd
            this.scoreDom.innerHTML = "Score:" + String(this.progressionState[7])
            localStorage.setItem("score", this.progressionState[7])
        }
    }

    // IN DEVELOPMENT
    allowSubmitText()
    {
        this.textInput = document.querySelector('.textInput')
        this.submitInput = document.querySelector('.submitInput')
        this.submitInput.addEventListener('click', () =>
        {
            if(this.textWorking === false && this.textInput.value.length > 0)
            {
                this.readUserInput(this.textInput.value)
            }
        })
        //Submit text using enter key
        this.textInput.addEventListener('keyup', (e) =>
        {
            if(e.keyCode === 13 && this.textWorking === false && this.textInput.value.length > 0)
            {
                this.readUserInput(this.textInput.value)
            }
        })
    }

    createTypewriter()
    {
        this.textBox = document.querySelector('.textBox')
        this.typewriter = new Typewriter(this.textBox, {loop: false, delay: this.params.typeSpeed, cursor: this.params.textCursor})
    }

    textDelay()
    {
        this.typewriter.pauseFor(this.params.textDelay)
    }

    textBreak()
    {
        this.typewriter.typeString('<br class=textLineBreak>')
    }

    typeEvent(eventType, event)
    {
        this.typewriterWorking = true
        this.experience.layoutControl.openNavIfClose()
        this.typewriter.typeString("<div class=stringCompleted style='width:0;height:0;position:absolute'></div>")
        this.typewriter.start()
        this.stringInterval = setInterval(() =>
        {
            this.stringCompleted = document.querySelector('.stringCompleted')
            if(this.stringCompleted)
            {
                // console.log("string ended")
                if(eventType === 'choice')
                {
                    this.choice(event)
                }
                if(eventType === 'singleChoice')
                {
                    this.singleChoice(event)
                }
                if(eventType === 'progressToNext')
                {
                    this.progressToNextEvent(event)
                }
                if(eventType === 'release')
                {
                    this.release()
                }
                clearInterval(this.stringInterval)
                this.typewriterWorking = false
                this.stringCompleted.remove()
                this.stringCompleted = null
            }
        }, 500)
        
    }

    /**------------------------------------------------------------------
     *--------------------------------DEBUG------------------------------
     *-------------------------------------------------------------------
    */

    setDebug()
    {
        if(this.debug.active)
        {
            // this.debugFolder = this.debug.gui.addFolder( 'Textbox' )
            // this.debugFolder.add(this.params, 'textCursor', { none: "", simple: "|", slanted: "/", upArrow: "^" }).onChange((cursor) =>
            // {
            //     this.typewriter.changeCursor(cursor)
            // })
            // this.debugFolder.add(this.params, 'typeSpeed', 1, 100).onChange(() =>
            // {
            //     this.typewriter.changeDelay(this.params.typeSpeed)
            // })
            // this.debugFolder.add(this.params, 'textDelay', 1, 3000)
            // this.debugFolder.close()
        }
    }
}