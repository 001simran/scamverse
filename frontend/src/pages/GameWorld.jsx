/*
 * ScamVerse - HackMol 7.0
 * GameWorld.jsx - The 3D Minecraft city
 * Built by Supriya
 *
 * No API keys needed here at all
 * Just Three.js doing its thing
 * Took forever to get the camera right lol
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useGame } from '../game/GameContext'

const BUILDINGS = [
  {
    id: 'home',
    label: '🏠 Apartment',
    color: '#1565c0',
    roofColor: '#0d47a1',
    x: -14, z: -10, w: 5, h: 4, d: 5,
    mission: 'OTP Scam — Mission 1',
    district: 1
  },
  {
    id: 'bank',
    label: '🏦 City Bank',
    color: '#2e7d32',
    roofColor: '#1b5e20',
    x: 12, z: -10, w: 6, h: 6, d: 5,
    mission: 'Phishing — Mission 2',
    district: 2
  },
  {
    id: 'bazaar',
    label: '🛒 Bazaar',
    color: '#e65100',
    roofColor: '#bf360c',
    x: -14, z: 8, w: 7, h: 3, d: 5,
    mission: 'UPI Trap — Mission 3',
    district: 1
  },
  {
    id: 'cybercell',
    label: '🚔 Cyber Cell',
    color: '#4a148c',
    roofColor: '#38006b',
    x: 12, z: 8, w: 5, h: 7, d: 5,
    mission: 'Digital Arrest — Mission 4',
    district: 3
  },
  {
    id: 'awareness',
    label: '🎡 Awareness Center',
    color: '#f57f17',
    roofColor: '#e65100',
    x: 0, z: -16, w: 6, h: 4, d: 6,
    mission: 'Daily Spin Wheel',
    district: 1
  },
  {
    id: 'scamlab',
    label: '🔬 Scam Lab',
    color: '#880e4f',
    roofColor: '#560027',
    x: 0, z: 16, w: 5, h: 4, d: 5,
    mission: 'Scam DNA Report',
    district: 3
  }
]

const TREE_POSITIONS = [
  [-20, -20], [-8, -20], [8, -20], [20, -20],
  [-20, 0], [20, 0],
  [-20, 20], [-8, 20], [8, 20], [20, 20],
  [-5, -5], [5, -5], [-5, 5], [5, 5]
]

const LAMP_POSITIONS = [
  [-3, -12], [3, -12],
  [-3, 12], [3, 12],
  [-12, -3], [-12, 3],
  [12, -3], [12, 3]
]

export default function GameWorld({
  playerName,
  onEnterBuilding,
  onNearBuilding,
  isElderMode = false
}) {

  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const characterRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())
  const keysRef = useRef({})
  const animFrameRef = useRef(null)
  const nearBuildingRef = useRef(null)
  const lastAnnouncedRef = useRef(null)
  const ambientLightRef = useRef(null)

  const { state, progressionData } = useGame()
  const citySecurity = progressionData?.city?.securityLevel ?? 60

  const partsRef = useRef({
    leftLeg: null, rightLeg: null,
    leftArm: null, rightArm: null,
    body: null, head: null
  })

  const [nearBuilding, setNearBuilding] = useState(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [debugKeys, setDebugKeys] = useState(null)
  const [showMissionStart, setShowMissionStart] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowMissionStart(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!sceneRef.current || !ambientLightRef.current) return
    const sec = Math.max(0, Math.min(100, citySecurity))
    const ratio = sec / 100

    // Smoothly transition between bright cyber blue (secure) to dark corrupted red (insecure)
    const baseColor = new THREE.Color(0x220000).lerp(new THREE.Color(0x0a1a3a), ratio)
    sceneRef.current.background = baseColor
    if (sceneRef.current.fog) sceneRef.current.fog.color = baseColor

    ambientLightRef.current.intensity = 0.4 + (ratio * 0.5)
    const lightColor = new THREE.Color(0xff6666).lerp(new THREE.Color(0xffffff), ratio)
    ambientLightRef.current.color = lightColor
  }, [citySecurity, loaded])

  function checkWebGL() {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
      return !!gl
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    if (!checkWebGL()) {
      setWebglSupported(false)
      return
    }

    const container = mountRef.current
    if (!container) return

    const W = container.clientWidth
    const H = container.clientHeight

    // ── SCENE ────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050510) // Dark cyber theme base
    scene.fog = new THREE.FogExp2(0x050510, 0.03) // Thicker fog for dark aesthetic
    sceneRef.current = scene

    // ── CAMERA ───────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200)
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // ── RENDERER ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'default'
    })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap
    container.appendChild(renderer.domElement)
    renderer.domElement.tabIndex = 0
    renderer.domElement.focus()
    renderer.domElement.addEventListener('click', () => renderer.domElement.focus())
    rendererRef.current = renderer

    // ── LIGHTS ───────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    ambientLightRef.current = ambientLight
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.9)
    sunLight.position.set(15, 25, 15)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 100
    sunLight.shadow.camera.left = -30
    sunLight.shadow.camera.right = 30
    sunLight.shadow.camera.top = 30
    sunLight.shadow.camera.bottom = -30
    scene.add(sunLight)

    // ── GROUND ───────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(80, 80)
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x3a7d44 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    for (let i = 0; i < 30; i++) {
      const patchGeo = new THREE.PlaneGeometry(
        1 + Math.random() * 2,
        1 + Math.random() * 2
      )
      const patchMat = new THREE.MeshLambertMaterial({
        color: Math.random() > 0.5 ? 0x2d6a3f : 0x4a9e5c
      })
      const patch = new THREE.Mesh(patchGeo, patchMat)
      patch.rotation.x = -Math.PI / 2
      patch.position.set(
        (Math.random() - 0.5) * 70,
        0.01,
        (Math.random() - 0.5) * 70
      )
      scene.add(patch)
    }

    // ── ROADS ────────────────────────────────────────────────
    function makeRoad(x, y, z, w, h, d) {
      const geo = new THREE.BoxGeometry(w, h, d)
      const mat = new THREE.MeshLambertMaterial({ color: 0x424242 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }

    makeRoad(0, 0.03, 0, 6, 0.06, 80)
    makeRoad(0, 0.03, 0, 80, 0.06, 6)

    function makeRoadLine(x, z, w, d) {
      const geo = new THREE.BoxGeometry(w, 0.07, d)
      const mat = new THREE.MeshLambertMaterial({ color: 0xffd600 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, 0.04, z)
      scene.add(mesh)
    }

    for (let z = -35; z < 35; z += 4) makeRoadLine(0, z, 0.2, 2)
    for (let x = -35; x < 35; x += 4) makeRoadLine(x, 0, 2, 0.2)

    const footpathMat = new THREE.MeshLambertMaterial({ color: 0x9e9e9e })
    function makeFootpath(x, y, z, w, h, d) {
      const geo = new THREE.BoxGeometry(w, h, d)
      const mesh = new THREE.Mesh(geo, footpathMat)
      mesh.position.set(x, y, z)
      mesh.receiveShadow = true
      scene.add(mesh)
    }
    makeFootpath(0, 0.04, 3.5, 80, 0.05, 1)
    makeFootpath(0, 0.04, -3.5, 80, 0.05, 1)
    makeFootpath(3.5, 0.04, 0, 1, 0.05, 80)
    makeFootpath(-3.5, 0.04, 0, 1, 0.05, 80)

    // ── BUILDINGS ────────────────────────────────────────────
    function makeBuildingNameSprite(labelText, baseWidth = 5) {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 128
      const ctx = canvas.getContext('2d')

      const text = (labelText || '').toString()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.roundRect(18, 18, canvas.width - 36, canvas.height - 36, 18)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '900 44px Arial'
      ctx.shadowColor = 'rgba(0,0,0,0.85)'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 6
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
      const sprite = new THREE.Sprite(mat)

      // scale relative to building width
      const w = Math.max(3.2, Math.min(9.5, baseWidth * 1.15))
      sprite.scale.set(w, w * 0.25, 1)
      return sprite
    }

    function makeBuilding(b) {
      const group = new THREE.Group()

      const bodyGeo = new THREE.BoxGeometry(b.w, b.h, b.d)
      const bodyMat = new THREE.MeshLambertMaterial({ color: b.color })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = b.h / 2
      body.castShadow = true
      body.receiveShadow = true
      group.add(body)

      const roofGeo = new THREE.BoxGeometry(b.w + 0.3, 0.4, b.d + 0.3)
      const roofMat = new THREE.MeshLambertMaterial({ color: b.roofColor })
      const roof = new THREE.Mesh(roofGeo, roofMat)
      roof.position.y = b.h + 0.2
      roof.castShadow = true
      group.add(roof)

      const winMat = new THREE.MeshLambertMaterial({
        color: 0xfff9c4,
        emissive: 0xffe082,
        emissiveIntensity: 0.4
      })

      const floors = Math.floor(b.h / 1.5)
      const winsPerFloor = Math.floor(b.w / 2)

      for (let floor = 0; floor < floors; floor++) {
        for (let w = 0; w < winsPerFloor; w++) {
          const winGeo = new THREE.BoxGeometry(0.6, 0.7, 0.1)
          const win = new THREE.Mesh(winGeo, winMat)
          const startX = -(b.w / 2) + 1.2 +
            w * (b.w - 1.5) / Math.max(winsPerFloor - 1, 1)
          win.position.set(startX, 1.0 + floor * 1.5, b.d / 2 + 0.05)
          group.add(win)
        }
      }

      const doorGeo = new THREE.BoxGeometry(0.8, 1.2, 0.1)
      const doorMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 })
      const door = new THREE.Mesh(doorGeo, doorMat)
      door.position.set(0, 0.6, b.d / 2 + 0.05)
      group.add(door)

      const frameGeo = new THREE.BoxGeometry(1.0, 1.4, 0.08)
      const frameMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 })
      const frame = new THREE.Mesh(frameGeo, frameMat)
      frame.position.set(0, 0.7, b.d / 2 + 0.04)
      group.add(frame)

      const signGeo = new THREE.BoxGeometry(b.w, 0.6, 0.12)
      const signMat = new THREE.MeshLambertMaterial({
        color: b.roofColor,
        emissive: b.color,
        emissiveIntensity: 0.3
      })
      const sign = new THREE.Mesh(signGeo, signMat)
      sign.position.set(0, b.h - 0.7, b.d / 2 + 0.06)
      group.add(sign)

      // Building name on top/front (sprite always faces camera)
      const nameText = (b.label || '').replace(/^[^\s]+\s*/, '').trim() || b.id
      const nameSprite = makeBuildingNameSprite(nameText, b.w)
      nameSprite.position.set(0, b.h + 1.1, b.d / 2 + 0.35)
      group.add(nameSprite)

      group.position.set(b.x, 0, b.z)
      group.userData = { buildingId: b.id, label: b.label }
      scene.add(group)
      return group
    }

    BUILDINGS.forEach(b => makeBuilding(b))

    // ── TREES ────────────────────────────────────────────────
    function makeTree(x, z) {
      const group = new THREE.Group()
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.8, 6)
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 })
      const trunk = new THREE.Mesh(trunkGeo, trunkMat)
      trunk.position.y = 0.9
      trunk.castShadow = true
      group.add(trunk)

      const colors = [0x2e7d32, 0x388e3c, 0x43a047]
      const sizes = [1.8, 1.4, 0.9]
      const heights = [2.0, 2.8, 3.5]

      colors.forEach((col, i) => {
        const geo = new THREE.BoxGeometry(
          sizes[i] * 1.5, sizes[i], sizes[i] * 1.5
        )
        const mat = new THREE.MeshLambertMaterial({ color: col })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.y = heights[i]
        mesh.castShadow = true
        group.add(mesh)
      })

      group.position.set(x, 0, z)
      scene.add(group)
    }

    TREE_POSITIONS.forEach(([x, z]) => {
      if (Math.abs(x) < 4 || Math.abs(z) < 4) return
      makeTree(x, z)
    })

    // ── LAMP POSTS ───────────────────────────────────────────
    function makeLampPost(x, z) {
      const group = new THREE.Group()
      const poleMat = new THREE.MeshLambertMaterial({ color: 0x424242 })

      const poleGeo = new THREE.CylinderGeometry(0.07, 0.07, 4, 6)
      const pole = new THREE.Mesh(poleGeo, poleMat)
      pole.position.y = 2
      pole.castShadow = true
      group.add(pole)

      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 5)
      const arm = new THREE.Mesh(armGeo, poleMat)
      arm.rotation.z = Math.PI / 2
      arm.position.set(0.5, 3.8, 0)
      group.add(arm)

      const bulbGeo = new THREE.SphereGeometry(0.18, 8, 8)
      const bulbMat = new THREE.MeshLambertMaterial({
        color: 0xfff9c4,
        emissive: 0xffecb3,
        emissiveIntensity: 0.8
      })
      const bulb = new THREE.Mesh(bulbGeo, bulbMat)
      bulb.position.set(0.5, 3.6, 0)
      group.add(bulb)

      group.position.set(x, 0, z)
      scene.add(group)
    }

    LAMP_POSITIONS.forEach(([x, z]) => makeLampPost(x, z))

    // ── BENCHES ──────────────────────────────────────────────
    function makeBench(x, z) {
      const group = new THREE.Group()
      const brownMat = new THREE.MeshLambertMaterial({ color: 0x795548 })
      const darkMat = new THREE.MeshLambertMaterial({ color: 0x4e342e })

      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.12, 0.6), brownMat
      )
      seat.position.y = 0.55
      group.add(seat)

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.5, 0.1), brownMat
      )
      back.position.set(0, 0.9, -0.25)
      group.add(back)

        ;[[-0.9, -0.25], [0.9, -0.25], [-0.9, 0.25], [0.9, 0.25]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.55, 0.1), darkMat
          )
          leg.position.set(lx, 0.27, lz)
          group.add(leg)
        })

      group.position.set(x, 0, z)
      scene.add(group)
    }

    makeBench(-8, -8)
    makeBench(8, -8)

    // ── CLOUDS ───────────────────────────────────────────────
    const cloudGroup = new THREE.Group()

    function makeCloud(x, y, z) {
      const group = new THREE.Group()
      const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff })

        ;[[0, 0, 0], [1.2, 0.2, 0], [-1.2, 0.2, 0], [0, 0.3, 0.8], [0, 0.3, -0.8]]
          .forEach(([cx, cy, cz]) => {
            const size = 0.8 + Math.random() * 0.6
            const geo = new THREE.BoxGeometry(size * 2, size, size * 1.5)
            const mesh = new THREE.Mesh(geo, cloudMat)
            mesh.position.set(cx, cy, cz)
            group.add(mesh)
          })

      group.position.set(x, y, z)
      cloudGroup.add(group)
    }

    makeCloud(-20, 18, -15)
    makeCloud(15, 20, -20)
    makeCloud(-10, 22, 10)
    makeCloud(20, 19, 5)
    scene.add(cloudGroup)

    // ── CHARACTER ────────────────────────────────────────────
    function makeCharacter() {
      const group = new THREE.Group()

      const skinMat = new THREE.MeshLambertMaterial({ color: 0xffcc80 })
      const shirtMat = new THREE.MeshLambertMaterial({ color: 0x1976d2 })
      const pantsMat = new THREE.MeshLambertMaterial({ color: 0x0d47a1 })
      const eyeMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
      const phoneMat = new THREE.MeshLambertMaterial({ color: 0x111111 })
      const hairMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 })
      const screenMat = new THREE.MeshLambertMaterial({
        color: 0x4fc3f7, emissive: 0x4fc3f7, emissiveIntensity: 0.5
      })

      // head
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.72, 0.72), skinMat
      )
      head.position.y = 1.76
      head.castShadow = true
      group.add(head)
      partsRef.current.head = head

      // hair
      const hair = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.15, 0.74), hairMat
      )
      hair.position.y = 2.15
      group.add(hair)

      // eyes
      const eyeGeo = new THREE.BoxGeometry(0.14, 0.12, 0.08)
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
      leftEye.position.set(-0.18, 1.78, 0.37)
      group.add(leftEye)
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
      rightEye.position.set(0.18, 1.78, 0.37)
      group.add(rightEye)

      // body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.88, 0.32), shirtMat
      )
      body.position.y = 0.96
      body.castShadow = true
      group.add(body)
      partsRef.current.body = body

      // left arm
      const leftArmPivot = new THREE.Group()
      leftArmPivot.position.set(-0.42, 1.36, 0)
      const leftArmMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.78, 0.24), shirtMat
      )
      leftArmMesh.position.y = -0.39
      leftArmMesh.castShadow = true
      leftArmPivot.add(leftArmMesh)
      group.add(leftArmPivot)
      partsRef.current.leftArm = leftArmPivot

      // right arm + phone
      const rightArmPivot = new THREE.Group()
      rightArmPivot.position.set(0.42, 1.36, 0)
      const rightArmMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.78, 0.24), shirtMat
      )
      rightArmMesh.position.y = -0.39
      rightArmMesh.castShadow = true
      rightArmPivot.add(rightArmMesh)

      const phone = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.22, 0.04), phoneMat
      )
      phone.position.set(0, -0.85, 0.14)
      rightArmPivot.add(phone)

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.16, 0.02), screenMat
      )
      screen.position.set(0, -0.85, 0.17)
      rightArmPivot.add(screen)

      group.add(rightArmPivot)
      partsRef.current.rightArm = rightArmPivot

      // left leg
      const leftLegPivot = new THREE.Group()
      leftLegPivot.position.set(-0.16, 0.52, 0)
      const leftLegMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.78, 0.24), pantsMat
      )
      leftLegMesh.position.y = -0.39
      leftLegMesh.castShadow = true
      leftLegPivot.add(leftLegMesh)
      group.add(leftLegPivot)
      partsRef.current.leftLeg = leftLegPivot

      // right leg
      const rightLegPivot = new THREE.Group()
      rightLegPivot.position.set(0.16, 0.52, 0)
      const rightLegMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.78, 0.24), pantsMat
      )
      rightLegMesh.position.y = -0.39
      rightLegMesh.castShadow = true
      rightLegPivot.add(rightLegMesh)
      group.add(rightLegPivot)
      partsRef.current.rightLeg = rightLegPivot

      // shoes
      const shoeMat = new THREE.MeshLambertMaterial({ color: 0x212121 })
      const shoeGeo = new THREE.BoxGeometry(0.26, 0.12, 0.3)
      const leftShoe = new THREE.Mesh(shoeGeo, shoeMat)
      leftShoe.position.set(-0.16, 0.06, 0.04)
      group.add(leftShoe)
      const rightShoe = new THREE.Mesh(shoeGeo, shoeMat)
      rightShoe.position.set(0.16, 0.06, 0.04)
      group.add(rightShoe)

      group.position.set(-10, 0, -5)
      group.castShadow = true
      scene.add(group)
      characterRef.current = group
      return group
    }

    makeCharacter()

    // ── NAME TAG ─────────────────────────────────────────────
    function makeNameTag(name) {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.roundRect(4, 4, 248, 56, 12)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(name || 'Agent', 128, 32)

      const texture = new THREE.CanvasTexture(canvas)
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(2.5, 0.65, 1)
      sprite.position.set(0, 2.8, 0)
      characterRef.current.add(sprite)
    }

    makeNameTag(playerName || 'Agent')

    // ── NPCs (Non-Player Characters) ──────────────────────────
    const NPCs = []
    const NPC_NAMES = ['Anna', 'Rajesh', 'Priya', 'Amit']
    const NPC_COLORS = [
      { skin: 0xffcc80, shirt: 0xf44336, pants: 0x2e2e2e },
      { skin: 0xffcc80, shirt: 0x2196f3, pants: 0x1a1a1a },
      { skin: 0xffcc80, shirt: 0x4caf50, pants: 0x2e2e2e },
      { skin: 0xffcc80, shirt: 0xff9800, pants: 0x1a1a1a }
    ]

    function makeNPC(index, startX, startZ) {
      const group = new THREE.Group()
      const colors = NPC_COLORS[index % 4]

      const skinMat = new THREE.MeshLambertMaterial({ color: colors.skin })
      const shirtMat = new THREE.MeshLambertMaterial({ color: colors.shirt })
      const pantsMat = new THREE.MeshLambertMaterial({ color: colors.pants })
      const hairMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 })

      // head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), skinMat)
      head.position.y = 1.5
      head.castShadow = true
      group.add(head)

      // hair
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.62), hairMat)
      hair.position.y = 1.8
      group.add(hair)

      // body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.26), shirtMat)
      body.position.y = 0.82
      body.castShadow = true
      group.add(body)

      // legs
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.26), pantsMat)
      legs.position.y = 0.3
      legs.castShadow = true
      group.add(legs)

      // shoes
      const shoes = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.28), new THREE.MeshLambertMaterial({ color: 0x212121 }))
      shoes.position.y = 0.05
      group.add(shoes)

      group.position.set(startX, 0, startZ)
      scene.add(group)

      return {
        mesh: group,
        name: NPC_NAMES[index % 4],
        position: { x: startX, z: startZ },
        targetX: startX,
        targetZ: startZ,
        angle: 0,
        speed: 0.8 + Math.random() * 0.4,
        idleTimer: 0,
        idleDuration: 3 + Math.random() * 4
      }
    }

    // Create 4 NPCs at various locations
    const npcStartPositions = [
      [-8, -8], [8, -8], [-10, 10], [10, 10]
    ]
    npcStartPositions.forEach((pos, idx) => {
      NPCs.push(makeNPC(idx, pos[0], pos[1]))
    })

    // ── PARTICLES ────────────────────────────────────────────
    const particles = []
    const dangerSpots = [{ x: 12, z: 8 }, { x: -14, z: 8 }]

    dangerSpots.forEach(spot => {
      for (let i = 0; i < 5; i++) {
        const geo = new THREE.SphereGeometry(0.12, 6, 6)
        const mat = new THREE.MeshLambertMaterial({
          color: Math.random() > 0.5 ? 0xf44336 : 0xff9800,
          emissive: 0xff5722,
          emissiveIntensity: 0.4
        })
        const p = new THREE.Mesh(geo, mat)
        p.position.set(
          spot.x + (Math.random() - 0.5) * 4,
          1 + Math.random() * 3,
          spot.z + (Math.random() - 0.5) * 4
        )
        p.userData = {
          baseY: p.position.y,
          speed: 0.3 + Math.random() * 0.5,
          offset: Math.random() * Math.PI * 2
        }
        scene.add(p)
        particles.push(p)
      }
    })

    // ── KEYBOARD ─────────────────────────────────────────────
    const KEY_MAP = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
      e: 'enter', E: 'enter'
    }

    function onKeyDown(e) {
      const showDebug = typeof window !== 'undefined' && window.location?.search?.includes('debugKeys=1')
      if (showDebug) {
        setDebugKeys({
          type: 'down',
          key: e.key,
          code: e.code,
          near: nearBuildingRef.current?.id || null,
          time: Date.now()
        })
        const el = document.activeElement
        setDebugFocus({
          tag: el?.tagName || null,
          id: el?.id || null,
          cls: el?.className?.toString?.() || null
        })
      }
      if (KEY_MAP[e.key]) {
        const mapped = KEY_MAP[e.key]
        keysRef.current[mapped] = true
        e.preventDefault()

        // Enter building instantly on keydown to avoid missing quick taps
        if (mapped === 'enter' && nearBuildingRef.current && onEnterBuilding) {
          onEnterBuilding(nearBuildingRef.current.id)
          keysRef.current.enter = false
        }
      }
    }
    function onKeyUp(e) {
      const showDebug = typeof window !== 'undefined' && window.location?.search?.includes('debugKeys=1')
      if (showDebug) {
        setDebugKeys({
          type: 'up',
          key: e.key,
          code: e.code,
          near: nearBuildingRef.current?.id || null,
          time: Date.now()
        })
        const el = document.activeElement
        setDebugFocus({
          tag: el?.tagName || null,
          id: el?.id || null,
          cls: el?.className?.toString?.() || null
        })
      }
      if (KEY_MAP[e.key]) keysRef.current[KEY_MAP[e.key]] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // ── GAME LOOP ─────────────────────────────────────────────
    const SPEED = 5.5
    const BOUNDARY = 28
    let characterYaw = 0

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate)

      const delta = clockRef.current.getDelta()
      const elapsed = clockRef.current.getElapsedTime()
      const char = characterRef.current
      const parts = partsRef.current
      const keys = keysRef.current

      if (!char) return

      let moveX = 0
      let moveZ = 0
      if (keys.up) moveZ = -1
      if (keys.down) moveZ = 1
      if (keys.left) moveX = -1
      if (keys.right) moveX = 1

      const isMoving = moveX !== 0 || moveZ !== 0

      if (moveX !== 0 && moveZ !== 0) {
        moveX *= 0.707
        moveZ *= 0.707
      }

      char.position.x = Math.max(-BOUNDARY, Math.min(BOUNDARY,
        char.position.x + moveX * SPEED * delta))
      char.position.z = Math.max(-BOUNDARY, Math.min(BOUNDARY,
        char.position.z + moveZ * SPEED * delta))

      if (isMoving) {
        const targetYaw = Math.atan2(moveX, moveZ)
        let diff = targetYaw - characterYaw
        if (diff > Math.PI) diff -= Math.PI * 2
        if (diff < -Math.PI) diff += Math.PI * 2
        characterYaw += diff * 10 * delta
        char.rotation.y = characterYaw
      }

      if (isMoving) {
        const swing = Math.sin(elapsed * 8) * 0.55
        if (parts.leftLeg) parts.leftLeg.rotation.x = swing
        if (parts.rightLeg) parts.rightLeg.rotation.x = -swing
        if (parts.leftArm) parts.leftArm.rotation.x = -swing * 0.6
        if (parts.rightArm) parts.rightArm.rotation.x = swing * 0.6
        char.position.y = Math.abs(Math.sin(elapsed * 8)) * 0.06
      } else {
        if (parts.leftLeg) parts.leftLeg.rotation.x *= 0.85
        if (parts.rightLeg) parts.rightLeg.rotation.x *= 0.85
        if (parts.leftArm) parts.leftArm.rotation.x = Math.sin(elapsed * 1.5) * 0.06
        if (parts.rightArm) parts.rightArm.rotation.x = -Math.sin(elapsed * 1.5) * 0.06
        char.position.y = Math.sin(elapsed * 1.8) * 0.025
      }

      // camera follow
      const camOffsetX = -Math.sin(characterYaw) * 9
      const camOffsetZ = -Math.cos(characterYaw) * 9
      camera.position.x += (char.position.x + camOffsetX - camera.position.x) * 0.07
      camera.position.y += (char.position.y + 6.5 - camera.position.y) * 0.07
      camera.position.z += (char.position.z + camOffsetZ - camera.position.z) * 0.07
      camera.lookAt(char.position.x, char.position.y + 1.0, char.position.z)

      // ── UPDATE NPCs ──────────────────────────────────────────
      NPCs.forEach(npc => {
        const dx = npc.targetX - npc.position.x
        const dz = npc.targetZ - npc.position.z
        const distToTarget = Math.sqrt(dx * dx + dz * dz)

        if (distToTarget < 0.5) {
          // reached target, idle a bit then pick new target
          npc.idleTimer += delta
          if (npc.idleTimer > npc.idleDuration) {
            npc.targetX = (Math.random() - 0.5) * 50
            npc.targetZ = (Math.random() - 0.5) * 50
            npc.targetX = Math.max(-BOUNDARY, Math.min(BOUNDARY, npc.targetX))
            npc.targetZ = Math.max(-BOUNDARY, Math.min(BOUNDARY, npc.targetZ))
            npc.idleTimer = 0
            npc.idleDuration = 2 + Math.random() * 4
          }
        } else {
          // move towards target
          npc.idleTimer = 0
          const moveDir = Math.atan2(dx, dz)
          npc.angle = moveDir
          npc.position.x += Math.sin(moveDir) * npc.speed * delta
          npc.position.z += Math.cos(moveDir) * npc.speed * delta
          npc.position.x = Math.max(-BOUNDARY, Math.min(BOUNDARY, npc.position.x))
          npc.position.z = Math.max(-BOUNDARY, Math.min(BOUNDARY, npc.position.z))
        }

        // update mesh position and rotation
        npc.mesh.position.x = npc.position.x
        npc.mesh.position.z = npc.position.z
        npc.mesh.rotation.y = npc.angle + Math.PI
      })

      // particles
      particles.forEach(p => {
        p.position.y = p.userData.baseY +
          Math.sin(elapsed * p.userData.speed + p.userData.offset) * 0.6
        p.material.opacity = 0.4 + Math.sin(elapsed * 2 + p.userData.offset) * 0.3
        p.material.transparent = true
      })

      // clouds drift
      cloudGroup.position.x = Math.sin(elapsed * 0.04) * 3

      // nearby building check
      let foundBuilding = null
      let closestDist = 999

      BUILDINGS.forEach(b => {
        const dx = char.position.x - b.x
        const dz = char.position.z - b.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        const threshold = Math.max(b.w, b.d) / 2 + 10
        if (dist < threshold && dist < closestDist) {
          closestDist = dist
          foundBuilding = b
        }
      })

      nearBuildingRef.current = foundBuilding
      setNearBuilding(foundBuilding)

      // Proximity Alert for Elder Mode
      if (foundBuilding) {
        if (lastAnnouncedRef.current !== foundBuilding.id) {
          if (onNearBuilding) onNearBuilding(foundBuilding.id, foundBuilding.label.replace(/[^a-zA-Z0-9 ]/g, ''))
          lastAnnouncedRef.current = foundBuilding.id
        }
      } else {
        lastAnnouncedRef.current = null
      }

      if (keys.enter && foundBuilding) {
        keys.enter = false
        if (onEnterBuilding) onEnterBuilding(foundBuilding.id)
      }

      renderer.render(scene, camera)
    }

    setTimeout(() => {
      setLoaded(true)
      animate()
    }, 100)

    // ── RESIZE ───────────────────────────────────────────────
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── CLEANUP ───────────────────────────────────────────────
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animFrameRef.current)

      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })

      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [playerName])

  // ── DPAD HANDLERS ────────────────────────────────────────
  function pressKey(key) { keysRef.current[key] = true }
  function releaseKey(key) { keysRef.current[key] = false }

  // ── WEBGL NOT SUPPORTED ──────────────────────────────────
  if (!webglSupported) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a1a', color: '#fff',
        gap: '16px', padding: '20px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px' }}>😕</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
          3D Not Supported
        </div>
        <div style={{ fontSize: '14px', color: '#aaa', maxWidth: '320px' }}>
          Please open in Chrome or Edge browser.
        </div>
      </div>
    )
  }

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* canvas container */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* mission start cutscene */}
      {showMissionStart && (
        <div style={{
          position: 'absolute',
          top: '20%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#4fc3f7', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
          textAlign: 'center', background: 'rgba(0,0,0,0.85)', padding: '20px 40px',
          border: '1px solid #4fc3f7', borderRadius: '8px', pointerEvents: 'none', zIndex: 1000,
          textShadow: '0 0 10px #4fc3f7'
        }}>
          &gt; SYNCING CYBER DEFENSE GRID...<br />
          &gt; CITY SECURITY AT {citySecurity}%<br />
          &gt; MISSION ASSIGNED.
        </div>
      )}

      {/* loading screen */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0a0a1a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '48px' }}>🏗️</div>
          <div style={{ color: '#4fc3f7', fontSize: '16px', fontWeight: 'bold' }}>
            Building the city...
          </div>
        </div>
      )}

      {/* enter hint */}
      {nearBuilding && (
        <div style={{
          position: 'absolute',
          top: '20px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,215,0,0.92)',
          color: '#000', padding: '10px 20px',
          borderRadius: '24px', fontWeight: 'bold',
          fontSize: isElderMode ? '16px' : '14px',
          whiteSpace: 'nowrap',
          boxShadow: '0 0 20px rgba(255,215,0,0.5)',
          zIndex: 10
        }}>
          ⚡ {isElderMode ? 'नीचे बड़ा बटन दबाएं —' : 'Press E or tap —'} {nearBuilding.label}
        </div>
      )}

      {/* mission hint */}
      {nearBuilding && (
        <div style={{
          position: 'absolute',
          top: '64px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: '#aaa', padding: '5px 14px',
          borderRadius: '12px',
          fontSize: '12px', whiteSpace: 'nowrap',
          zIndex: 10
        }}>
          📋 {nearBuilding.mission}
        </div>
      )}

      {/* mini hud top left (Disabled for Normal Mode - Handled by HUDNormal now) */}
      {isElderMode && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(0,0,0,0.65)',
          border: '1px solid #2a2a4a',
          borderRadius: '12px', padding: '8px 12px',
          color: '#fff', fontSize: '12px', zIndex: 10, lineHeight: '1.6'
        }}>
          <div style={{ color: '#4fc3f7', fontWeight: 'bold' }}>🛡️ CyberGuardian</div>
          <div style={{ color: '#ff9800', fontSize: '11px' }}>👴 ELDER MODE</div>
          <div style={{ color: '#aaa', fontSize: '11px' }}>बड़े बटन से चलें</div>
        </div>
      )}

      {/* debug panel (add ?debugKeys=1 to URL) */}
      {debugKeys && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #2a2a4a',
          borderRadius: '12px',
          padding: '10px 12px',
          color: '#fff',
          fontSize: '11px',
          zIndex: 20,
          width: '220px',
          lineHeight: '1.5'
        }}>
          <div style={{ color: '#4fc3f7', fontWeight: 'bold', marginBottom: '6px' }}>DEBUG</div>
          <div>nearBuilding: <span style={{ color: '#ffd700' }}>{nearBuilding?.id || 'null'}</span></div>
          <div>lastKey: <span style={{ color: '#ffd700' }}>{debugKeys.key}</span></div>
          <div>code: <span style={{ color: '#aaa' }}>{debugKeys.code}</span></div>
          <div>event: <span style={{ color: '#aaa' }}>{debugKeys.type}</span></div>
          {debugFocus && (
            <div style={{ marginTop: '6px' }}>
              focus: <span style={{ color: '#aaa' }}>{debugFocus.tag || 'null'}</span>
            </div>
          )}
        </div>
      )}

      {/* ── BOTTOM CONTROLS ──────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '16px', left: 0, right: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 10
      }}>

        {/* dpad — same for both modes, bigger buttons in elder */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${isElderMode ? '60px' : '44px'})`,
          gap: '3px'
        }}>
          <div />
          <DpadBtn
            label="▲"
            size={isElderMode ? 60 : 44}
            onDown={() => pressKey('up')}
            onUp={() => releaseKey('up')}
            hint={isElderMode ? 'ऊपर' : null}
          />
          <div />
          <DpadBtn
            label="◀"
            size={isElderMode ? 60 : 44}
            onDown={() => pressKey('left')}
            onUp={() => releaseKey('left')}
            hint={isElderMode ? 'बायें' : null}
          />
          <div style={{
            width: isElderMode ? 60 : 44,
            height: isElderMode ? 60 : 44,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px'
          }} />
          <DpadBtn
            label="▶"
            size={isElderMode ? 60 : 44}
            onDown={() => pressKey('right')}
            onUp={() => releaseKey('right')}
            hint={isElderMode ? 'दायें' : null}
          />
          <div />
          <DpadBtn
            label="▼"
            size={isElderMode ? 60 : 44}
            onDown={() => pressKey('down')}
            onUp={() => releaseKey('down')}
            hint={isElderMode ? 'नीचे' : null}
          />
          <div />
        </div>

        {/* enter button */}
        <button
          onPointerDown={() => {
            if (nearBuilding && onEnterBuilding) {
              onEnterBuilding(nearBuilding)
            }
          }}
          style={{
            width: isElderMode ? '86px' : '68px',
            height: isElderMode ? '86px' : '68px',
            borderRadius: '50%',
            border: nearBuilding ? '3px solid #ffd700' : '2px solid #2a2a4a',
            background: nearBuilding
              ? 'rgba(255,152,0,0.9)'
              : 'rgba(0,0,0,0.5)',
            color: nearBuilding ? '#000' : '#555',
            fontSize: isElderMode ? '28px' : '24px',
            cursor: 'pointer',
            boxShadow: nearBuilding
              ? '0 0 20px rgba(255,215,0,0.6)'
              : 'none',
            transition: 'all 0.2s',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            padding: 0
          }}
        >
          <span>⚡</span>
          {isElderMode && (
            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
              अंदर
            </span>
          )}
        </button>

        <div style={{ width: isElderMode ? '180px' : '132px' }} />

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50%       { transform: translateX(-50%) scale(1.04); }
        }
      `}</style>
    </div>
  )
}

// ── DpadBtn component ────────────────────────────────────
function DpadBtn({ label, size = 44, hint = null, onDown, onUp }) {
  return (
    <button
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{
        width: size, height: size,
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid #3a3a5a',
        borderRadius: '8px',
        color: '#ccc',
        fontSize: hint ? '14px' : '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        gap: '1px',
        padding: 0
      }}
    >
      <span>{label}</span>
      {hint && (
        <span style={{ fontSize: '9px', color: '#888' }}>{hint}</span>
      )}
    </button>
  )
}