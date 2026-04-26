import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function buildCar() {
  const group = new THREE.Group()

  /* ── MATERIALS ── */
  const body = new THREE.MeshPhysicalMaterial({
    color: 0x0d0d18, metalness: 0.95, roughness: 0.04,
    clearcoat: 1.0, clearcoatRoughness: 0.03, reflectivity: 1.0,
  })
  const bodyDark = new THREE.MeshPhysicalMaterial({
    color: 0x06060c, metalness: 0.85, roughness: 0.18, clearcoat: 0.5,
  })
  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xe0e0ee, metalness: 1.0, roughness: 0.02,
  })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.92 })
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x182840, transparent: true, opacity: 0.52,
    roughness: 0.0, metalness: 0.1, side: THREE.DoubleSide,
  })
  const red = new THREE.MeshStandardMaterial({
    color: 0xA2050F, emissive: 0xA2050F, emissiveIntensity: 0.6,
  })
  const white = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5,
  })
  const amber = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.3,
  })

  /* ── BODY — Porsche 911-style profile ── */
  const profile = new THREE.Shape()
  // Start front splitter level
  profile.moveTo(-2.18, -0.50)
  // Front bumper curve up
  profile.quadraticCurveTo(-2.30, -0.20, -2.15, 0.05)
  // Hood — long gentle slope up
  profile.quadraticCurveTo(-1.80, 0.28, -0.90, 0.38)
  // Windshield base / A-pillar start
  profile.quadraticCurveTo(-0.60, 0.38, -0.40, 0.68)
  // Roof — gentle arc (911 fastback)
  profile.quadraticCurveTo(0.10, 0.92, 0.62, 0.90)
  // Rear roofline — slopes down sharply (fastback)
  profile.quadraticCurveTo(1.02, 0.88, 1.32, 0.60)
  // Rear haunches / engine lid
  profile.quadraticCurveTo(1.60, 0.42, 1.90, 0.38)
  // Rear vertical / tail
  profile.quadraticCurveTo(2.22, 0.30, 2.28, 0.08)
  // Rear bumper base
  profile.quadraticCurveTo(2.30, -0.15, 2.18, -0.50)
  // Underside flat
  profile.lineTo(-2.18, -0.50)

  const bodyGeo = new THREE.ExtrudeGeometry(profile, {
    steps: 1, depth: 1.78,
    bevelEnabled: true, bevelThickness: 0.10, bevelSize: 0.10, bevelSegments: 12,
  })
  bodyGeo.computeBoundingBox()
  const bz = (bodyGeo.boundingBox.max.z + bodyGeo.boundingBox.min.z) / 2
  bodyGeo.translate(0, 0, -bz)
  const bodyMesh = new THREE.Mesh(bodyGeo, body)
  bodyMesh.castShadow = true
  group.add(bodyMesh)

  /* ── FENDER FLARES — wider arches ── */
  const makeFender = (x, z, front) => {
    const shape = new THREE.Shape()
    const r = front ? 0.52 : 0.56
    const cx = x, cy = -0.50
    shape.absarc(cx, cy, r, 0, Math.PI, false)
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: false })
    const m = new THREE.Mesh(geo, body)
    m.position.set(0, 0, z)
    m.rotation.y = z > 0 ? 0 : Math.PI
    group.add(m)
  }
  makeFender(-1.44, 0.96, true)
  makeFender(-1.44, -0.96, true)
  makeFender(1.44, 0.96, false)
  makeFender(1.44, -0.96, false)

  /* ── WINDOWS ── */
  const makeWin = (pts) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    geo.setIndex([0,1,2,0,2,3])
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, glass)
  }
  const wz = 0.80
  // Windshield
  group.add(makeWin([-0.40,0.68,-wz, -0.40,0.68,wz, 0.08,0.90,wz, 0.08,0.90,-wz]))
  // Rear window (fastback)
  group.add(makeWin([0.62,0.90,-wz, 0.62,0.90,wz, 1.30,0.58,wz, 1.30,0.58,-wz]))
  // Side windows
  ;[-wz, wz].forEach(z_ => {
    group.add(makeWin([
      -0.38,0.67,z_, 0.06,0.89,z_, 0.60,0.89,z_, 0.62,0.67,z_,
    ]))
  })

  /* ── DOOR LINES ── */
  const makeLine = (x1,y1,x2,y2,z_) => {
    const pts = [new THREE.Vector3(x1,y1,z_), new THREE.Vector3(x2,y2,z_)]
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }))
  }
  ;[-wz, wz].forEach(z_ => {
    group.add(makeLine(-0.38, -0.50, -0.38, 0.67, z_))
    group.add(makeLine(0.62, -0.50, 0.62, 0.67, z_))
  })

  /* ── WHEELS — large 20" style ── */
  const WHEEL_POS = [[-1.44,-0.50,1.04],[-1.44,-0.50,-1.04],[1.44,-0.50,1.04],[1.44,-0.50,-1.04]]
  WHEEL_POS.forEach(([wx,wy,wz_]) => {
    const wg = new THREE.Group()
    // Tyre
    wg.add(new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.12, 24, 64), rubber))
    // Rim face
    const rimFace = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.24, 64), chrome)
    rimFace.rotation.x = Math.PI / 2
    wg.add(rimFace)
    // 10 thin spokes (turbine style)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.21, 0.036), chrome)
      spoke.rotation.z = a
      wg.add(spoke)
    }
    // Center
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.27, 20), chrome)
    cap.rotation.x = Math.PI / 2
    wg.add(cap)
    // Brake disc hint (red)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.04, 32), new THREE.MeshStandardMaterial({ color: 0x301010, roughness: 0.8 }))
    disc.rotation.x = Math.PI / 2
    wg.add(disc)
    wg.position.set(wx, wy, wz_)
    group.add(wg)
  })

  /* ── HEADLIGHTS — slim LED strips (911 style) ── */
  // Main cluster housing
  ;[-0.85, 0.85].forEach(z_ => {
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.32), bodyDark)
    housing.position.set(-2.14, 0.14, z_)
    group.add(housing)
    // LED strip
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.018, 0.28), white)
    drl.position.set(-2.16, 0.20, z_)
    group.add(drl)
    // Amber indicator
    const ind = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.014, 0.10), amber)
    ind.position.set(-2.16, 0.14, z_)
    group.add(ind)
  })
  // Center DRL bar
  const centerDrl = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.013, 0.60), white)
  centerDrl.position.set(-2.16, 0.22, 0)
  group.add(centerDrl)

  /* ── TAIL LIGHTS — wide LED bar (911 style) ── */
  // Full width connecting bar
  const tlBar = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.018, 1.30), red)
  tlBar.position.set(2.20, 0.36, 0)
  group.add(tlBar)
  // Cluster units
  ;[-0.72, 0.72].forEach(z_ => {
    const cluster = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.10, 0.42), red)
    cluster.position.set(2.18, 0.14, z_)
    group.add(cluster)
  })

  /* ── FRONT GRILLE / INTAKE ── */
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.10, 0.90), bodyDark)
  grille.position.set(-2.20, -0.18, 0)
  group.add(grille)
  // Horizontal slats
  for (let i = 0; i < 5; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.008, 0.88), chrome)
    slat.position.set(-2.18, -0.24 + i * 0.025, 0)
    group.add(slat)
  }

  /* ── FRONT SPLITTER ── */
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.032, 1.52), bodyDark)
  splitter.position.set(-2.22, -0.50, 0)
  group.add(splitter)
  // Splitter fins
  for (let i = -2; i <= 2; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.06, 0.016), bodyDark)
    fin.position.set(-2.20, -0.48, i * 0.22)
    group.add(fin)
  }

  /* ── REAR SPOILER / DUCKTAIL ── */
  const duckTail = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.048, 1.62), body)
  duckTail.position.set(1.86, 0.54, 0)
  duckTail.rotation.z = -0.15
  group.add(duckTail)

  /* ── REAR DIFFUSER ── */
  const diff = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 1.30), bodyDark)
  diff.position.set(2.18, -0.46, 0)
  diff.rotation.z = 0.1
  group.add(diff)
  for (let i = -3; i <= 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.015), bodyDark)
    fin.position.set(2.18, -0.45, i * 0.18)
    group.add(fin)
  }

  /* ── EXHAUST (twin, low center) ── */
  ;[-0.14, 0.14].forEach(z_ => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.12, 24), chrome)
    pipe.rotation.x = Math.PI / 2
    pipe.position.set(2.26, -0.44, z_)
    group.add(pipe)
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.040, 0.06, 16), new THREE.MeshStandardMaterial({ color: 0x0a0808, roughness: 0.9 }))
    inner.rotation.x = Math.PI / 2
    inner.position.set(2.28, -0.44, z_)
    group.add(inner)
  })

  /* ── SIDE SKIRTS ── */
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(3.60, 0.055, 0.055), bodyDark)
  ;[-0.93, 0.93].forEach(z_ => {
    const s = skirt.clone()
    s.position.set(0.00, -0.50, z_)
    group.add(s)
  })

  /* ── DOOR HANDLES (flush) ── */
  ;[[-0.14, -0.92], [-0.14, 0.92], [0.50, -0.92], [0.50, 0.92]].forEach(([x, z_]) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.022, 0.028), chrome)
    h.position.set(x, 0.16, z_)
    group.add(h)
  })

  /* ── SIDE MIRRORS ── */
  ;[-0.96, 0.96].forEach(z_ => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.16), bodyDark)
    arm.position.set(-0.42, 0.38, z_ * 0.97)
    group.add(arm)
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.082, 0.028), bodyDark)
    face.position.set(-0.40, 0.38, z_)
    group.add(face)
    const mirrorFace = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.070, 0.010), chrome)
    mirrorFace.position.set(-0.39, 0.38, z_)
    group.add(mirrorFace)
  })

  /* ── BODY CREASE LINE ── */
  const crease = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.007, 1.72),
    new THREE.MeshStandardMaterial({ color: 0x3a3a50, metalness: 0.95, roughness: 0.08 })
  )
  crease.position.set(0.0, -0.02, 0)
  group.add(crease)

  group.position.y = 0.50
  return group
}

export default function Car3D() {
  const mountRef = useRef(null)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    // NO background — fully transparent so page background shows through
    scene.background = null

    try {
      const pmrem = new THREE.PMREMGenerator(renderer)
      const env = new RoomEnvironment()
      scene.environment = pmrem.fromScene(env, 0.04).texture
      pmrem.dispose()
      env.dispose()
    } catch(e) {}

    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100)
    camera.position.set(4.2, 1.8, 5.2)
    camera.lookAt(0, 0.2, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.2, 0)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI * 0.14
    controls.maxPolarAngle = Math.PI * 0.50
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.55
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

    /* ── LIGHTING ── */
    // Key — top left studio
    const key = new THREE.DirectionalLight(0xffffff, 3.2)
    key.position.set(-5, 8, 3)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.top = 6; key.shadow.camera.bottom = -4
    key.shadow.camera.left = -8; key.shadow.camera.right = 8
    key.shadow.bias = -0.001
    scene.add(key)
    // Fill — cool blue right
    const fill = new THREE.DirectionalLight(0x7090cc, 1.0)
    fill.position.set(6, 3, -5)
    scene.add(fill)
    // Rim — warm from behind
    const rim = new THREE.DirectionalLight(0xfff0e0, 1.6)
    rim.position.set(2, 2, -7)
    scene.add(rim)
    // Under bounce
    const bounce = new THREE.DirectionalLight(0xffffff, 0.20)
    bounce.position.set(0, -6, 0)
    scene.add(bounce)
    scene.add(new THREE.AmbientLight(0xffffff, 0.06))

    /* ── INVISIBLE SHADOW CATCHER (no visible plane) ── */
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 })
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.01
    shadow.receiveShadow = true
    scene.add(shadow)

    /* ── CAR ── */
    const car = buildCar()
    scene.add(car)
    car.position.y = -2.2
    car.rotation.y = Math.PI * 0.12
    let intro = 0

    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      intro = Math.min(1, intro + 0.007)
      const t = 1 - Math.pow(1 - intro, 4)
      car.position.y = -2.2 + 2.2 * t
      car.rotation.y = Math.PI * 0.12 * (1 - t)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight
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
      try { if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement) } catch(e) {}
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
