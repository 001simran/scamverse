// ScamVerse - HackMol 7.0
// BuildingInterior.jsx - 3D Interior Room System
// Replaces the modal with an actual 3D room you enter

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import HomeOffice from '../components/offices/HomeOffice'
import BankOffice from '../components/offices/BankOffice'
import BazaarOffice from '../components/offices/BazaarOffice'
import CyberCellOffice from '../components/offices/CyberCellOffice'
import ScamLabOffice from '../components/offices/ScamLabOffice'
import AwarenessOffice from '../components/offices/AwarenessOffice'
import { useGame } from '../game/GameContext'
import { TRANSLATIONS } from '../utils/translations'

const INTERIOR_CONFIGS = (lang = 'en') => {
  const isHi = lang === 'hi';
  return {
    home: {
      name: isHi ? 'आपका घर' : 'Your Apartment',
      color: '#1565c0',
      floorColor: 0x8b6f47,
      wallColor: 0xf5deb3,
      roofColor: 0x0d47a1,
      width: 10,
      depth: 10,
      height: 3,
      npcs: isHi ? ['माँ', 'बहन', 'आप (पीड़ित)'] : ['Mom', 'Sister', 'You (Victim)'],
      scamTypes: ['rupee_scam', 'phishing_email', 'love_scam'],
      furniture: [
        { type: 'sofa', x: 0, z: -2, emoji: '🛋️' },
        { type: 'table', x: 0, z: 2, emoji: '🪑' },
        { type: 'laptop', x: 2, z: 0, emoji: '📱' }
      ]
    },
    bank: {
      name: isHi ? 'सिटी बैंक' : 'City Bank',
      color: '#2e7d32',
      floorColor: 0xcccccc,
      wallColor: 0xffffff,
      roofColor: 0x1b5e20,
      width: 12,
      depth: 12,
      height: 4,
      npcs: isHi ? ['बैंक मैनेजर', 'क्लर्क', 'सुरक्षा गार्ड'] : ['Bank Manager', 'Clerk', 'Security Guard'],
      scamTypes: ['digital_arrest', 'refund_scam', 'upi_payment_scam', 'business_impersonation'],
      furniture: [
        { type: 'counter', x: -3, z: 0, emoji: '🏧' },
        { type: 'desk', x: 3, z: 0, emoji: '💼' },
        { type: 'vault', x: 0, z: 3, emoji: '🔒' }
      ]
    },
    bazaar: {
      name: isHi ? 'मुख्य बाज़ार' : 'Main Bazaar',
      color: '#e65100',
      floorColor: 0xaa8855,
      wallColor: 0xffd700,
      roofColor: 0xbf360c,
      width: 14,
      depth: 14,
      height: 3,
      npcs: isHi ? ['विक्रेता', 'दुकानदार', 'ग्राहक #1'] : ['Vendor', 'Shopkeeper', 'Buyer #1'],
      scamTypes: ['rupee_scam', 'lottery_prize_scam', 'upi_payment_scam'],
      furniture: [
        { type: 'stall', x: -4, z: -2, emoji: '🛒' },
        { type: 'stall', x: 4, z: -2, emoji: '🛒' },
        { type: 'stall', x: 0, z: 4, emoji: '🛒' },
        { type: 'display', x: -2, z: 2, emoji: '📺' }
      ]
    },
    cybercell: {
      name: isHi ? 'साइबर क्राइम सेल' : 'Cyber Crime Cell HQ',
      color: '#4a148c',
      floorColor: 0x333333,
      wallColor: 0x222222,
      roofColor: 0x38006b,
      width: 12,
      depth: 12,
      height: 4,
      npcs: isHi ? ['अधिकारी शर्मा', 'जासूस', 'टेक विशेषज्ञ'] : ['Officer Sharma', 'Detective', 'Tech Specialist'],
      scamTypes: ['tech_support_scam', 'investment_scam', 'cryptocurrency_scam', 'digital_arrest'],
      furniture: [
        { type: 'desk', x: -3, z: -2, emoji: '💻' },
        { type: 'desk', x: 3, z: -2, emoji: '💻' },
        { type: 'server', x: 0, z: 3, emoji: '🖥️' },
        { type: 'evidence', x: -3, z: 2, emoji: '📋' }
      ]
    },
    scamlab: {
      name: isHi ? 'स्कैम लेबोरेटरी' : 'Scam Research Lab',
      color: '#880e4f',
      floorColor: 0x555555,
      wallColor: 0x999999,
      roofColor: 0x560027,
      width: 10,
      depth: 10,
      height: 3,
      npcs: isHi ? ['मुख्य शोधकर्ता', 'एनालिस्ट', 'डेटा विशेषज्ञ'] : ['Lead Researcher', 'Analyst', 'Data Expert'],
      scamTypes: ['love_scam', 'fake_job_offer', 'investment_scam'],
      furniture: [
        { type: 'lab', x: -2, z: 0, emoji: '🔬' },
        { type: 'lab', x: 2, z: 0, emoji: '🔬' },
        { type: 'whiteboard', x: 0, z: -3, emoji: '📊' }
      ]
    },
    awareness: {
      name: isHi ? 'जागरूकता केंद्र' : 'Safety Awareness Center',
      color: '#f57f17',
      floorColor: 0xddaa44,
      wallColor: 0xffbb33,
      roofColor: 0xe65100,
      width: 11,
      depth: 11,
      height: 3,
      npcs: isHi ? ['ट्रेनर', 'गाइड', 'शिक्षक'] : ['Trainer', 'Guide', 'Educator'],
      scamTypes: ['rupee_scam', 'digital_arrest', 'phishing_email', 'bad_job_offer', 'lottery_prize_scam'],
      furniture: [
        { type: 'board', x: 0, z: -3, emoji: '📋' },
        { type: 'seat', x: -3, z: 2, emoji: '🪑' },
        { type: 'seat', x: 3, z: 2, emoji: '🪑' }
      ]
    }
  }
}

export default function BuildingInterior({ building, onClose, onNPCInteract }) {
  const { state } = useGame()
  const t = TRANSLATIONS[state.language]
  const config = INTERIOR_CONFIGS(state.language)[building?.id] || INTERIOR_CONFIGS(state.language).home
  
  // NPCs in interior
  const interiorNPCsRef = useRef([])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const W = container.clientWidth
    const H = container.clientHeight

    // ──────── SCENE ──────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xaabbcc)
    scene.fog = new THREE.Fog(0xaabbcc, 25, 40)
    sceneRef.current = scene

    // ──────── CAMERA ──────────
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 100)
    camera.position.set(0, 1.5, 5)
    camera.lookAt(0, 1, 0)
    cameraRef.current = camera

    // ──────── RENDERER ──────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ──────── LIGHTS ──────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
    directionalLight.position.set(5, 8, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // ──────── ROOM GEOMETRY ──────────
    const wallMat = new THREE.MeshLambertMaterial({ color: config.wallColor })
    const floorMat = new THREE.MeshLambertMaterial({ color: config.floorColor })
    const roofMat = new THREE.MeshLambertMaterial({ color: config.roofColor })

    // Floor
    const floorGeo = new THREE.PlaneGeometry(config.width, config.depth)
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0
    floor.receiveShadow = true
    scene.add(floor)

    // Walls
    function makeWall(x, z, w, d) {
      const geo = new THREE.BoxGeometry(w, config.height, d)
      const mesh = new THREE.Mesh(geo, wallMat)
      mesh.position.set(x, config.height / 2, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
    }

    const hw = config.width / 2
    const hd = config.depth / 2

    makeWall(0, hd, config.width, 0.2) // front
    makeWall(0, -hd, config.width, 0.2) // back
    makeWall(hw, 0, 0.2, config.depth) // right
    makeWall(-hw, 0, 0.2, config.depth) // left

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(config.width, config.depth)
    const ceiling = new THREE.Mesh(ceilingGeo, roofMat)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = config.height
    scene.add(ceiling)

    // Door
    const doorGeo = new THREE.BoxGeometry(0.8, 1.8, 0.1)
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    const door = new THREE.Mesh(doorGeo, doorMat)
    door.position.set(0, 0.9, hd - 0.1)
    scene.add(door)

    // ──────── FURNITURE ──────────
    const furnitureMat = new THREE.MeshLambertMaterial({ color: 0xcc8844 })
    config.furniture.forEach(furn => {
      const furGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2)
      const furMesh = new THREE.Mesh(furGeo, furnitureMat)
      furMesh.position.set(furn.x, 0.4, furn.z)
      furMesh.castShadow = true
      scene.add(furMesh)
    })

    // ──────── PLAYER ──────────
    function makePlayer() {
      const group = new THREE.Group()

      const headGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32)
      const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc80 })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.y = 0.6
      head.castShadow = true
      group.add(head)

      const bodyGeo = new THREE.BoxGeometry(0.3, 0.5, 0.2)
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1976d2 })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.3
      body.castShadow = true
      group.add(body)

      group.position.set(0, 0, -hd + 2)
      group.castShadow = true
      scene.add(group)
      return group
    }

    const player = makePlayer()
    playerRef.current = player

    // ──────── NPCs IN INTERIOR ──────────
    function makeInteriorNPC(name, x, z) {
      const group = new THREE.Group()

      const headGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28)
      const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc80 })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.y = 0.55
      group.add(head)

      const bodyGeo = new THREE.BoxGeometry(0.26, 0.45, 0.18)
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4caf50 })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.position.y = 0.25
      group.add(body)

      group.position.set(x, 0, z)
      group.castShadow = true
      scene.add(group)

      return {
        mesh: group,
        name: name,
        x: x,
        z: z,
        targetX: x + (Math.random() - 0.5) * 3,
        targetZ: z + (Math.random() - 0.5) * 3,
        speed: 1 + Math.random() * 0.5
      }
    }

    config.npcs.forEach((npcName, idx) => {
      const spacing = config.width / (config.npcs.length + 1)
      const x = -config.width / 2 + spacing * (idx + 1)
      interiorNPCsRef.current.push(makeInteriorNPC(npcName, x, 1))
    })

    // ──────── KEYBOARD ──────────
    const KEY_MAP = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
      e: 'exit', E: 'exit',
      Escape: 'exit'
    }

    function onKeyDown(e) {
      if (KEY_MAP[e.key]) {
        keysRef.current[KEY_MAP[e.key]] = true
        e.preventDefault()
      }
    }
    function onKeyUp(e) {
      if (KEY_MAP[e.key]) keysRef.current[KEY_MAP[e.key]] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // ──────── ANIMATION LOOP ──────────
    let playerYaw = 0

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate)

      const delta = clockRef.current.getDelta()
      const keys = keysRef.current

      // Player movement
      let moveX = 0, moveZ = 0
      if (keys.up) moveZ = -1
      if (keys.down) moveZ = 1
      if (keys.left) moveX = -1
      if (keys.right) moveX = 1

      if (moveX !== 0 || moveZ !== 0) {
        const speed = 4
        player.position.x = Math.max(-hw + 0.5, Math.min(hw - 0.5, player.position.x + moveX * speed * delta))
        player.position.z = Math.max(-hd + 0.5, Math.min(hd - 0.5, player.position.z + moveZ * speed * delta))

        const targetYaw = Math.atan2(moveX, moveZ)
        playerYaw += (targetYaw - playerYaw) * 0.1
        player.rotation.y = playerYaw
      }

      // NPC movement
      interiorNPCsRef.current.forEach(npc => {
        const dx = npc.targetX - npc.x
        const dz = npc.targetZ - npc.z
        const dist = Math.sqrt(dx * dx + dz * dz)

        if (dist < 0.3) {
          npc.targetX = -hw + 0.5 + Math.random() * (config.width - 1)
          npc.targetZ = -hd + 0.5 + Math.random() * (config.depth - 1)
        } else {
          const moveDir = Math.atan2(dx, dz)
          npc.x += Math.sin(moveDir) * npc.speed * delta
          npc.z += Math.cos(moveDir) * npc.speed * delta
          npc.mesh.rotation.y = moveDir + Math.PI
        }

        npc.mesh.position.x = npc.x
        npc.mesh.position.z = npc.z
      })

      // Camera follow
      camera.position.x += (player.position.x - camera.position.x) * 0.1
      camera.position.z += (player.position.z + 3 - camera.position.z) * 0.1
      camera.lookAt(player.position.x, 1, player.position.z)

      // Check exits
      if (keys.exit) {
        keys.exit = false
        onClose()
      }

      renderer.render(scene, camera)
    }

    animate()

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animFrameRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [building, onClose])

  if (showModal && selectedNPC) {
    const OfficeComponent = {
      home: HomeOffice,
      bank: BankOffice,
      bazaar: BazaarOffice,
      cybercell: CyberCellOffice,
      scamlab: ScamLabOffice,
      awareness: AwarenessOffice
    }[building?.id]

    return (
      <OfficeComponent
        building={building}
        onClose={() => setShowModal(false)}
        npcName={selectedNPC}
      />
    )
  }

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '16px', left: '16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#4fc3f7',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '12px',
        zIndex: 100,
        fontWeight: 'bold'
      }}>
        🏠 {config.name}<br/>
        <span style={{ fontSize: '11px', color: '#aaa' }}>{t.exitHint}</span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '16px', right: '16px',
        background: 'rgba(0,0,0,0.8)',
        border: '1px solid #2a2a4a',
        borderRadius: '12px',
        padding: '12px',
        color: '#fff',
        fontSize: '12px',
        zIndex: 100,
        maxWidth: '200px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4fc3f7' }}>
          👥 {t.peopleHere}
        </div>
        {config.npcs.map((npc, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedNPC(npc)
              setShowModal(true)
            }}
            style={{
              padding: '6px 8px',
              background: '#1a1a2a',
              borderRadius: '6px',
              marginBottom: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid #2a2a4a'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2a2a4a'
              e.target.style.borderColor = '#4fc3f7'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1a1a2a'
              e.target.style.borderColor = '#2a2a4a'
            }}
          >
            {npc} → {t.talkTo}
          </div>
        ))}
      </div>
    </div>
  )
}
