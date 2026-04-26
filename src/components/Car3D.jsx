import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function buildCar() {
  const group = new THREE.Group()
  const paint = new THREE.MeshPhysicalMaterial({ color: 0x0a0a14, metalness: 0.92, roughness: 0.06, clearcoat: 1.0, clearcoatRoughness: 0.04 })
  const paintDark = new THREE.MeshPhysicalMaterial({ color: 0x050508, metalness: 0.8, roughness: 0.2, clearcoat: 0.4 })
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xd8d8e8, metalness: 1.0, roughness: 0.04 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.95 })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x1a2840, transparent: true, opacity: 0.55, roughness: 0.0, side: THREE.DoubleSide })
  const redEmit = new THREE.MeshStandardMaterial({ color: 0xA2050F, emissive: 0xA2050F, emissiveIntensity: 0.5 })
  const whiteEmit = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 })

  const profile = new THREE.Shape()
  profile.moveTo(-2.08, -0.46)
  profile.quadraticCurveTo(-2.20, -0.08, -1.92, 0.13)
  profile.lineTo(-0.60, 0.18)
  profile.quadraticCurveTo(-0.34, 0.18, -0.16, 0.64)
  profile.lineTo(0.40, 0.74)
  profile.lineTo(0.76, 0.73)
  profile.quadraticCurveTo(1.10, 0.70, 1.24, 0.48)
  profile.lineTo(1.56, 0.24)
  profile.quadraticCurveTo(2.00, 0.22, 2.10, 0.06)
  profile.lineTo(2.10, -0.16)
  profile.lineTo(2.08, -0.46)
  profile.lineTo(-2.08, -0.46)

  const bodyGeo = new THREE.ExtrudeGeometry(profile, { steps: 1, depth: 1.70, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 8 })
  bodyGeo.computeBoundingBox()
  const bz = (bodyGeo.boundingBox.max.z + bodyGeo.boundingBox.min.z) / 2
  bodyGeo.translate(0, 0, -bz)
  const body = new THREE.Mesh(bodyGeo, paint)
  body.castShadow = true
  group.add(body)

  const makeWin = (pts) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    geo.setIndex([0,1,2,0,2,3])
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, glass)
  }
  const wz = 0.78
  group.add(makeWin([-0.16,0.64,-wz,-0.16,0.64,wz,0.40,0.73,wz,0.40,0.73,-wz]))
  group.add(makeWin([0.76,0.73,-wz,0.76,0.73,wz,1.22,0.48,wz,1.22,0.48,-wz]))

  ;[[-1.40,-0.44,0.94],[-1.40,-0.44,-0.94],[1.40,-0.44,0.94],[1.40,-0.44,-0.94]].forEach(([wx,wy,wz_]) => {
    const wg = new THREE.Group()
    wg.add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.11, 20, 48), rubber))
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.22, 40), chrome)
    rim.rotation.x = Math.PI / 2
    wg.add(rim)
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.19, 0.04), chrome)
      spoke.rotation.z = (i / 5) * Math.PI * 2
      wg.add(spoke)
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 12), chrome)
    cap.rotation.x = Math.PI / 2
    wg.add(cap)
    wg.position.set(wx, wy, wz_)
    group.add(wg)
  })

  const drl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, 0.70), whiteEmit)
  drl.position.set(-2.08, 0.10, 0)
  group.add(drl)
  const tl = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.10, 0.58), redEmit)
  tl.position.set(2.08, 0.04, 0)
  group.add(tl)
  const tlStrip = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.012, 1.0), redEmit)
  tlStrip.position.set(2.06, 0.07, 0)
  group.add(tlStrip)
  const spoilerWing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 1.65), paint)
  spoilerWing.position.set(1.52, 0.47, 0)
  group.add(spoilerWing)
  const spoilerMount = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 1.48), paintDark)
  spoilerMount.position.set(1.56, 0.37, 0)
  group.add(spoilerMount)
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 1.30), paintDark)
  splitter.position.set(-2.10, -0.43, 0)
  group.add(splitter)
  ;[-0.93, 0.93].forEach(z_ => {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.03), chrome)
    mirror.position.set(-0.34, 0.29, z_)
    group.add(mirror)
  })
  const crease = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.007, 1.56), new THREE.MeshStandardMaterial({ color: 0x444458, metalness: 0.9, roughness: 0.1 }))
  crease.position.set(0, 0.05, 0)
  group.add(crease)
  group.position.y = 0.46
  return group
}

export default function Car3D() {
  const mountRef = useRef(null)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Use window size — always correct on first render
    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    // Canvas fills the container
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    try {
      const pmrem = new THREE.PMREMGenerator(renderer)
      const env = new RoomEnvironment()
      scene.environment = pmrem.fromScene(env, 0.04).texture
      pmrem.dispose()
      env.dispose()
    } catch(e) {}

    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100)
    camera.position.set(4.0, 2.0, 5.0)
    camera.lookAt(0, 0.25, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.25, 0)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI * 0.15
    controls.maxPolarAngle = Math.PI * 0.52
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.65
    controls.update()

    let resumeTimer
    controls.addEventListener('start', () => {
      controls.autoRotate = false
      setHint(false)
      clearTimeout(resumeTimer)
    })
    controls.addEventListener('end', () => {
      resumeTimer = setTimeout(() => { controls.autoRotate = true }, 4000)
    })

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 2.8)
    key.position.set(-4, 7, 3)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -3
    key.shadow.camera.left = -7; key.shadow.camera.right = 7
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x8899cc, 0.9)
    fill.position.set(5, 3, -4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 1.4)
    rim.position.set(1, 1, -6)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.08))

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.MeshStandardMaterial({ color: 0x080810, roughness: 0.06, metalness: 0.65 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Car with intro animation
    const car = buildCar()
    scene.add(car)
    car.position.y = -2.0
    car.rotation.y = Math.PI * 0.15
    let intro = 0

    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      intro = Math.min(1, intro + 0.008)
      const t = 1 - Math.pow(1 - intro, 4)
      car.position.y = -2.0 + 2.0 * t
      car.rotation.y = Math.PI * 0.15 * (1 - t)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = window.innerWidth
      const nh = window.innerHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resumeTimer)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      try {
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      } catch(e) {}
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {hint && (
        <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', zIndex: 10, animation: 'hf 1s ease 2.5s both' }}>
          <style>{`@keyframes hf{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} @keyframes hs{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}`}</style>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: 'hs 2s ease-in-out infinite', opacity: 0.4 }}>
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.2"/>
            <path d="M7 12h10M12 7l5 5-5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier New,monospace', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Зажмите для поворота</span>
        </div>
      )}
    </div>
  )
}
