import * as THREE from 'three'

export default class Particles
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.parameters = {}
        this.parameters.count = 3000
        this.parameters.size = 0.01
        this.parameters.radius = 5
        this.parameters.branches = 3
        this.parameters.spin = 1
        this.parameters.randomness = 0.02
        this.parameters.randomnessPower = 3
        this.parameters.insideColor = '#0000cc'
        this.parameters.outsideColor = '#ff9900'

        this.geometry = null
        this.material = null
        this.points = null

        this.generateGalaxy()
    }

    generateGalaxy()
    {
        this.geometry = new THREE.BufferGeometry()

        this.positions = new Float32Array(this.parameters.count * 3)
        this.colors = new Float32Array(this.parameters.count * 3)

        this.colorInside = new THREE.Color(this.parameters.insideColor)
        this.colorOutside = new THREE.Color(this.parameters.outsideColor)

        for(let i = 0; i < this.parameters.count; i++)
        {
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.parameters.radius
            const spinAngle = radius * this.parameters.spin
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

            this.positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
            this.positions[i3 + 1] = randomY
            this.positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            //Color
            const mixedColor = this.colorInside.clone()
            mixedColor.lerp(this.colorOutside, radius / this.parameters.radius)

            this.colors[i3 + 0] = mixedColor.r
            this.colors[i3 + 1] = mixedColor.g
            this.colors[i3 + 2] = mixedColor.b
        }

        this.geometry.setAttribute(
            'position', 
            new THREE.BufferAttribute(this.positions, 3)
        )

        this.geometry.setAttribute(
            'color', 
            new THREE.BufferAttribute(this.colors, 3)
        )
    
        this.material = new THREE.PointsMaterial({
            size: this.parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })

        this.points = new THREE.Points(this.geometry, this.material)
        this.points.position.set(-13.8,2.8,-1.7)
        this.points.scale.set(0.1,0.1,0.1)
        this.scene.add(this.points)
    }

    update()
    {
        this.points.rotation.y += 0.002
        this.points.rotation.x += 0.0005
        this.points.rotation.z += 0.0005
    }
}