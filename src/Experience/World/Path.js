import * as THREE from 'three'

export default class Path
{
    constructor(experience)
    {
        this.experience = experience
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance

        // Setup
        this.fraction = 0

        this.setWalkingPath()
        this.setWalkingPathLine()
        this.setFollowObject()
    }

    setWalkingPath()
    {
        this.pointsPath = new THREE.CurvePath()

        this.outOfHousePath1 = new THREE.LineCurve3(
            new THREE.Vector3( 165.69, 0, 97.827 ),
            new THREE.Vector3( 162.095, 0, 97.3602 )
        )

        this.outOfHousePath2 = new THREE.LineCurve3(
            new THREE.Vector3( 162.095, 0, 97.3602 ),
            new THREE.Vector3( 159.107, 0, 96.4346 )
        )

        this.outOfHousePath3 = new THREE.LineCurve3(
            new THREE.Vector3( 159.107, 0, 96.4346 ),
            new THREE.Vector3( 154.92, 0, 108.561 ),
        )

        this.outOfHousePath4 = new THREE.LineCurve3(
            new THREE.Vector3( 154.92, 0, 108.561 ),
            new THREE.Vector3( 149.557, 0, 112.909 ),
        )

        this.outOfHousePath5 = new THREE.LineCurve3(
            new THREE.Vector3( 149.557, 0, 112.909 ),
            new THREE.Vector3( 146.64, 0, 124.117 ),
        )

        this.outOfHousePath6 = new THREE.LineCurve3(
            new THREE.Vector3( 146.64, 0, 124.117 ),
            new THREE.Vector3( 148.804, 0, 128.437 )
        )

        this.outOfHousePath7 = new THREE.LineCurve3(
            new THREE.Vector3( 148.804, 0, 128.437 ),
            new THREE.Vector3( 135.147, 0, 134.37 )
        )

        this.outOfHousePath8 = new THREE.LineCurve3(
            new THREE.Vector3( 135.147, 0, 134.37 ),
            new THREE.Vector3( 129.907, 0, 145 )
        )
        this.walkingPathLine1 = new THREE.CubicBezierCurve3(
            new THREE.Vector3( 129.907, 0, 145),
            new THREE.Vector3( 126.13, 0, 143.48 ),
            new THREE.Vector3( 117.213, 0, 143.704 ),
            new THREE.Vector3( 118.862, 0, 138.639 )
        )
        this.walkingPathLine2 = new THREE.LineCurve3(
            new THREE.Vector3( 118.862, 0, 138.639 ),
            new THREE.Vector3( 149.234, 0, 75.8629)
        )
        this.walkingPathLine3 = new THREE.LineCurve3(
            new THREE.Vector3( 149.234, 0, 75.8629),
            new THREE.Vector3( 141.517, 0, 59.0598)
        )
        this.walkingPathLine4 = new THREE.LineCurve3(
            new THREE.Vector3( 141.517, 0, 59.0598),
            new THREE.Vector3( 83.3152, 0, 29.5253)
        )
        this.walkingPathLine5 = new THREE.LineCurve3(
            new THREE.Vector3( 83.3152, 0, 29.5253 ),
            new THREE.Vector3( 75.3681, 0, 31.1522 )
        )

        this.walkingPathLine6 = new THREE.LineCurve3(
            new THREE.Vector3( 75.3681, 0, 31.1522 ),
            new THREE.Vector3( 72.331, 0, 35.7602)
        )
        this.walkingPathLine7 = new THREE.LineCurve3(
            new THREE.Vector3( 72.331, 0, 35.7602),
            new THREE.Vector3( 74.7034, 0, 37.3238 )
        )
        this.walkingPathLine8 = new THREE.LineCurve3(
            new THREE.Vector3( 74.7034, 0, 37.3238 ),
            new THREE.Vector3( 72.7188, 0, 40.335 )
        )
        this.walkingPathLine9 = new THREE.LineCurve3(
            new THREE.Vector3( 72.7188, 0, 40.335 ),
            new THREE.Vector3( 68.1821, 0, 37.3449 )
        )
        this.walkingPathLine10 = new THREE.LineCurve3(
            new THREE.Vector3( 68.1821, 0, 37.3449 ),
            new THREE.Vector3( 70.6287, 0, 33.6328 )
        )
        this.interiorPath1 = new THREE.LineCurve3(
            new THREE.Vector3( 70.6287, 0, 33.6328 ),
            new THREE.Vector3( 65.5347, 0, 30.5183 )
        )
        this.interiorPath2 = new THREE.LineCurve3(      
            new THREE.Vector3( 65.5347, 0, 30.5183 ),
            new THREE.Vector3( 58.3538, 0, 29.6003 )
        )
        this.interiorPath3 = new THREE.LineCurve3(      
            new THREE.Vector3( 58.3538, 0, 29.6003 ),
            new THREE.Vector3( 74.1572, 0, 4.55161 ),
        )
        this.interiorPath4 = new THREE.LineCurve3(      
            new THREE.Vector3( 57.1973, 0, 42.3048 ),
            new THREE.Vector3( 66.0579, 0, 28.7043 )
        )
        this.exteriorPath1 = new THREE.LineCurve3(      
            new THREE.Vector3( 66.0579, 0, 28.7043 ),
            new THREE.Vector3( 63.7596, 0, 25.0153 )
        )
        this.exteriorPath2 = new THREE.LineCurve3(      
            new THREE.Vector3( 63.7596, 0, 25.0153 ),
            new THREE.Vector3( 69.1042, 0, 17.8436 ),
        )
        this.exteriorPath3 = new THREE.LineCurve3(      
            new THREE.Vector3( 69.1042, 0, 17.8436 ),
            new THREE.Vector3( 50.6873, 0, 0.291125 )
        )
        this.exteriorPath4 = new THREE.LineCurve3(      
            new THREE.Vector3( 50.6873, 0, 0.291125 ),
            new THREE.Vector3( 45.4704, 0, -23.3389 )
        )
        this.exteriorPath5 = new THREE.LineCurve3(      
            new THREE.Vector3( 45.4704, 0, -23.3389 ),
            new THREE.Vector3( 24.1731, 0, -55.2926 )
        )
        this.theatrePath1 = new THREE.LineCurve3(      
            new THREE.Vector3( 24.1731, 0, -55.2926 ),
            new THREE.Vector3( 0.85892, 0, -171.154 )
        )

        

        this.pointsPath.add(this.outOfHousePath1)
        this.pointsPath.add(this.outOfHousePath2)
        this.pointsPath.add(this.outOfHousePath3)
        this.pointsPath.add(this.outOfHousePath4)
        this.pointsPath.add(this.outOfHousePath5)
        this.pointsPath.add(this.outOfHousePath6)
        this.pointsPath.add(this.outOfHousePath7)
        this.pointsPath.add(this.outOfHousePath8)
        this.pointsPath.add(this.walkingPathLine1)
        this.pointsPath.add(this.walkingPathLine2)
        this.pointsPath.add(this.walkingPathLine3)
        this.pointsPath.add(this.walkingPathLine4)
        this.pointsPath.add(this.walkingPathLine5)
        this.pointsPath.add(this.walkingPathLine6)
        this.pointsPath.add(this.walkingPathLine7)
        this.pointsPath.add(this.walkingPathLine8)
        this.pointsPath.add(this.walkingPathLine9)
        this.pointsPath.add(this.walkingPathLine10)
        this.pointsPath.add(this.interiorPath1)
        this.pointsPath.add(this.interiorPath2)
        this.pointsPath.add(this.interiorPath3)
        this.pointsPath.add(this.interiorPath4)
        this.pointsPath.add(this.exteriorPath1)
        this.pointsPath.add(this.exteriorPath2)
        this.pointsPath.add(this.exteriorPath3)
        this.pointsPath.add(this.exteriorPath4)
        this.pointsPath.add(this.exteriorPath5)
        this.pointsPath.add(this.theatrePath1)

    }

    setWalkingPathLine()
    {
        this.pathMaterial = new THREE.LineBasicMaterial({color: 0xffffff, visible: true})
        this.points = this.pointsPath.curves.reduce((p,d) => [...p, ...d.getPoints(20)], [])
        this.pathGeometry = new THREE.BufferGeometry().setFromPoints( this.points )
        this.pathLine = new THREE.Line(this.pathGeometry, this.pathMaterial)
        this.pathLine.position.set(-13.9,2.3,-12.5)
        this.pathLine.scale.set(0.005,0.005,0.005)
        this.pathLine.rotation.z = Math.PI * 0.5
        this.scene.add(this.pathLine)
    }

    setFollowObject()
    {
        this.followObjectGeo = new THREE.BoxGeometry(0.05,0.05,0.05)
        this.followObjectMat = new THREE.MeshBasicMaterial({color:0xff0000})
        this.followObject = new THREE.Mesh(this.followObjectGeo, this.followObjectMat)
        this.scene.add(this.followObject)

        this.up = new THREE.Vector3(0,1,0)
        this.axis = new THREE.Vector3( )
    }

    updatePathPosition()
    {
        this.newPosition = this.pointsPath.getPoint(this.fraction)
        this.tangent = this.pointsPath.getTangent(this.fraction)
        this.followObject.position.copy(this.newPosition)
        this.axis.crossVectors( this.up, this.tangent ).normalize()

        this.radians = Math.acos( this.up.dot( this.tangent ) )

        this.followObject.quaternion.setFromAxisAngle( this.axis, this.radians )
        
        this.fraction +=0.0002
        if(this.fraction > 1)
        {
            this.fraction = 0
        }
    }
}