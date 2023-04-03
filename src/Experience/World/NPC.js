export default class NPC
{
    constructor(experience)
    {
        this.experience = experience
        this.resources = this.experience.resources
        this.debug = this.experience.debug
    }
}