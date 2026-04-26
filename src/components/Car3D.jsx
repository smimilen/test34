import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/* ─────────────────────────────────────────────────────────
   BUILD CAR  — all geometry assembled here
───────────────────────────────────────────────────────── */
function buildCar() {
  const group = new THREE.Group()

  // ─── MATERIALS ───────────────────────────────────────
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a14,
    metalness: 0.92,
    roughness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 1.0,
  })
  const paintDark = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.4,
  })
  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xd8d8e8,
    metalness: 1.0,
    roughness: 0.04,
  })
  const rubber = new THREE.MeshStandardMaterial({
    color: 0x0c0c10,
    roughness: 0.95,
    metalness: 0.0,
  })
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x1a2840,
    metalness: 0.0,
    roughness: 0.0,
    transparent: true,
    opacity: 0.58,
    side: THREE.DoubleSide,
  })
  const redEmit = new THREE.MeshStandardMaterial({
    color: 0xA2050F,
    emissive: 0xA2050F,
    emissiveIntensity: 0.5,
    roughness: 0.2,
  })
  const whiteEmit = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.45,
    roughness: 0.2,
  })

  // ─── BODY — ExtrudeGeometry side profile ──────────────
  const profile = new THREE.Shape()
  profile.moveTo(-2.08, -0.46)
  profile.quadraticCurveTo(-2.20, -0.08, -1.92, 0.13)
  profile.lineTo(-0.60,  0.18)
  profile.quadraticCurveTo(-0.34,  0.18, -0.16,  0.64)
  profile.lineTo( 0.40,  0.74)
  profile.lineTo( 0.76,  0.73)
  profile.quadraticCurveTo( 1.10,  0.70,  1.24,  0.48)
  profile.lineTo( 1.56,  0.24)
  profile.quadraticCurveTo( 2.00,  0.22,  2.10,  0.06)
  profile.lineTo( 2.10, -0.16)
  profile.lineTo( 2.08, -0.46)
  profile.lineTo(-2.08, -0.46)

  const extSettings = {
    steps: 1,
    depth: 1.70,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 8,
  }

  const bodyGeo = new THREE.ExtrudeGeometry(profile, extSettings)
  bodyGeo.computeBoundingBox()
  const bz = (bodyGeo.boundingBox.max.z + bodyGeo.boundingBox.min.z) / 2
  bodyGeo.translate(0, 0, -bz)

  const body = new THREE.Mesh(bodyGeo, paint)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // ─── WINDOW HELPER ────────────────────────────────────
  const makeWindow = (pts) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    geo.setIndex([0, 1, 2, 0, 2, 3])
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, glass)
  }

  const wz = 0.78 // half inner glass span

  // Windshield
  group.add(makeWindow([
    -0.16,  0.64,  -wz,
    -0.16,  0.64,   wz,
     0.40,  0.73,   wz,
     0.40,  0.73,  -wz,
  ]))

  // Rear window
  group.add(makeWindow([
     0.76,  0.73,  -wz,
     0.76,  0.73,   wz,
     1.22,  0.48,   wz,
     1.22,  0.48,  -wz,
  ]))

  // Side windows (both sides)
  ;[-wz, wz].forEach((z, i) => {
    group.add(makeWindow(i === 0
      ? [-0.14, 0.63, z,  0.38, 0.72, z,  0.74, 0.71, z,  0.50, 0.46, z]
      : [-0.14, 0.63, z,  0.38, 0.72, z,  0.74, 0.71, z,  0.50, 0.46, z]
    ))
  })

  // ─── WHEELS ───────────────────────────────────────────
  const WHEEL_POS = [
    [-1.40, -0.44,  0.94],
    [-1.40, -0.44, -0.94],
    [ 1.40, -0.44,  0.94],
    [ 1.40, -0.44, -0.94],
  ]

  WHEEL_POS.forEach(([wx, wy, wz_]) => {
    const wg = new THREE.Group()

    // Tyre — torus in XY plane (default), hole faces Z → correct for side-view
    const tireGeo = new THREE.TorusGeometry(0.34, 0.11, 22, 48)
    wg.add(new THREE.Mesh(tireGeo, rubber))

    // Rim disc — cylinder axis along Z
    const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 48)
    const rim = new THREE.Mesh(rimGeo, chrome)
    rim.rotation.x = Math.PI / 2
    wg.add(rim)

    // 5 spokes (BoxGeometry tall along Y, rotated around Z)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const spokeGeo = new THREE.BoxGeometry(0.034, 0.20, 0.044)
      const spoke = new THREE.Mesh(spokeGeo, chrome)
      spoke.rotation.z = a
      wg.add(spoke)
    }

    // Center cap
    const capGeo = new THREE.CylinderGeometry(0.056, 0.056, 0.26, 16)
    const cap = new THREE.Mesh(capGeo, chrome)
    cap.rotation.x = Math.PI / 2
    wg.add(cap)

    wg.position.set(wx, wy, wz_)
    group.add(wg)
  })

  // ─── HEADLIGHTS ───────────────────────────────────────
  // DRL strip
  const drl = new THREE.Mesh(
    new THREE.BoxGeometry(0.032, 0.016, 0.72), whiteEmit
  )
  drl.position.set(-2.08, 0.10, 0)
  group.add(drl)

  // Lower headlight units
  ;[-0.24, 0.24].forEach(z_ => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.072, 0.20), whiteEmit)
    hl.position.set(-2.08, 0.01, z_)
    group.add(hl)
  })

  // ─── TAIL LIGHTS ──────────────────────────────────────
  const tl = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.10, 0.60), redEmit)
  tl.position.set(2.08, 0.04, 0)
  group.add(tl)

  // Connecting LED strip
  const tlStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.030, 0.013, 1.05), redEmit
  )
  tlStrip.position.set(2.06, 0.07, 0)
  group.add(tlStrip)

  // ─── REAR SPOILER ─────────────────────────────────────
  const spoilerMount = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.15, 1.50), paintDark
  )
  spoilerMount.position.set(1.56, 0.37, 0)
  group.add(spoilerMount)

  const spoilerWing = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.04, 1.68), paint
  )
  spoilerWing.position.set(1.52, 0.47, 0)
  group.add(spoilerWing)

  // ─── FRONT SPLITTER ───────────────────────────────────
  const splitter = new THREE.Mesh(
    new THREE.BoxGeometry(0.20, 0.04, 1.34), paintDark
  )
  splitter.position.set(-2.10, -0.43, 0)
  group.add(splitter)

  // ─── DOOR MIRRORS ─────────────────────────────────────
  ;[-0.93, 0.93].forEach(z_ => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.036, 0.18), paintDark)
    arm.position.set(-0.36, 0.29, z_ * 0.97)
    group.add(arm)

    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.03), chrome)
    mirror.position.set(-0.34, 0.29, z_)
    group.add(mirror)
  })

  // ─── DOOR HANDLES ─────────────────────────────────────
  ;[[-0.06, 'f'], [0.54, 'r']].forEach(([xOff]) => {
    ;[-0.94, 0.94].forEach(z_ => {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.026, 0.030), chrome)
      h.position.set(xOff, 0.21, z_)
      group.add(h)
    })
  })

  // ─── SUBTLE BODY CREASE (highlight geometry) ──────────
  const creaseGeo = new THREE.BoxGeometry(4.0, 0.008, 1.58)
  const creaseMat = new THREE.MeshStandardMaterial({
    color: 0x444458, metalness: 0.9, roughness: 0.1,
  })
  const crease = new THREE.Mesh(creaseGeo, creaseMat)
  crease.position.set(0, 0.05, 0)
  group.add(crease)

  // Lift so wheels sit on y=0
  group.position.y = 0.46

  return group
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Car3D({ style = {} }) {
  const mountRef = useRef(null)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || window.innerWidth
    const h = mount.clientHeight || window.innerHeight

    // ─── RENDERER ──────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    // ─── SCENE ─────────────────────────────────────────
    const scene = new THREE.Scene()

    // Environment map for reflections
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new RoomEnvironment()
    const envTexture = pmrem.fromScene(envScene, 0.04)
    scene.environment = envTexture.texture
    pmrem.dispose()
    envScene.dispose()

    // ─── CAMERA ────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100)
    camera.position.set(4.0, 2.0, 5.0)
    camera.lookAt(0, 0.25, 0)

    // ─── CONTROLS ──────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.25, 0)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI * 0.15
    controls.maxPolarAngle = Math.PI * 0.52
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.65
    controls.update()

    let resumeTimeout
    controls.addEventListener('start', () => {
      controls.autoRotate = false
      setHint(false)
      clearTimeout(resumeTimeout)
    })
    controls.addEventListener('end', () => {
      resumeTimeout = setTimeout(() => { controls.autoRotate = true }, 4000)
    })

    // ─── LIGHTS ────────────────────────────────────────
    // Key light — soft top-left studio
    const key = new THREE.DirectionalLight(0xffffff, 2.8)
    key.position.set(-4, 7, 3)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.top = 5
    key.shadow.camera.bottom = -3
    key.shadow.camera.left = -7
    key.shadow.camera.right = 7
    key.shadow.camera.near = 1
    key.shadow.camera.far = 22
    key.shadow.bias = -0.001
    scene.add(key)

    // Fill — opposite blue-tinted
    const fill = new THREE.DirectionalLight(0x8899cc, 0.9)
    fill.position.set(5, 3, -4)
    scene.add(fill)

    // Rim — hot white from behind
    const rim = new THREE.DirectionalLight(0xffffff, 1.4)
    rim.position.set(1, 1, -6)
    scene.add(rim)

    // Ground bounce
    const bounce = new THREE.DirectionalLight(0xffffff, 0.18)
    bounce.position.set(0, -5, 0)
    scene.add(bounce)

    // Ambient
    scene.add(new THREE.AmbientLight(0xffffff, 0.05))

    // ─── GROUND PLANE ──────────────────────────────────
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080810,
      roughness: 0.06,
      metalness: 0.65,
    })
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.01
    ground.receiveShadow = true
    scene.add(ground)

    // Red under-car glow
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x400010,
      transparent: true,
      opacity: 0.3,
    })
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(7, 2.4), glowMat)
    glow.rotation.x = -Math.PI / 2
    glow.position.set(0, -0.008, 0)
    scene.add(glow)

    // ─── CAR ───────────────────────────────────────────
    const car = buildCar()
    scene.add(car)

    // Intro animation — car rises from below
    car.position.y = -2.0
    car.rotation.y = Math.PI * 0.15
    let introProgress = 0
    const INTRO_DURATION = 1.8 // seconds

    // ─── RENDER LOOP ───────────────────────────────────
    let rafId
    let lastTime = performance.now()

    const animate = (now = performance.now()) => {
      rafId = requestAnimationFrame(animate)
      const dt = (now - lastTime) / 1000
      lastTime = now

      // Intro rise
      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + dt / INTRO_DURATION)
        // Ease out quart
        const t = 1 - Math.pow(1 - introProgress, 4)
        car.position.y = -2.0 + 2.0 * t
        car.rotation.y = Math.PI * 0.15 * (1 - t)
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ─── RESIZE ────────────────────────────────────────
    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      if (!nw || !nh) return
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ─── CLEANUP ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resumeTimeout)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      envTexture.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', ...style }}>
      {hint && (
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          animation: 'fadeInHint 2s ease 1.8s both',
          zIndex: 10,
        }}>
          <style>{`
            @keyframes fadeInHint {
              from { opacity: 0; transform: translateX(-50%) translateY(10px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes rotateHint {
              0%, 100% { transform: rotate(-15deg); }
              50% { transform: rotate(15deg); }
            }
          `}</style>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
            style={{ animation: 'rotateHint 2s ease-in-out infinite', opacity: 0.5 }}>
            <path d="M14 4 C14 4 20 8 20 14 C20 20 14 24 14 24 C14 24 8 20 8 14 C8 8 14 4 14 4Z"
              stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M4 14 H24 M14 4 V24" stroke="white" strokeWidth="1" opacity="0.4"/>
          </svg>
          <span style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Courier New, monospace',
            textTransform: 'uppercase',
          }}>
            Зажмите для поворота
          </span>
        </div>
      )}
    </div>
  )
}
