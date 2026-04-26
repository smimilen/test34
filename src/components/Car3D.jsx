import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function buildCar() {
  const g = new THREE.Group()

  const paint = new THREE.MeshPhysicalMaterial({ color: 0x0a0a16, metalness: 0.95, roughness: 0.04, clearcoat: 1.0, clearcoatRoughness: 0.03 })
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x06060c, metalness: 0.85, roughness: 0.18, clearcoat: 0.5 })
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe0e0ee, metalness: 1.0, roughness: 0.02 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.92 })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x182840, transparent: true, opacity: 0.52, roughness: 0.0, side: THREE.DoubleSide })
  const red = new THREE.MeshStandardMaterial({ color: 0xA2050F, emissive: 0xA2050F, emissiveIntensity: 0.6 })
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 })

  // Body profile — Supra/sports car shape
  const profile = new THREE.Shape()
  profile.moveTo(-2.18, -0.50)
  profile.quadraticCurveTo(-2.32, -0.18, -2.14, 0.06)
  profile.quadraticCurveTo(-1.80, 0.30, -0.88, 0.40)
  profile.quadraticCurveTo(-0.58, 0.40, -0.38, 0.72)
  profile.quadraticCurveTo(0.08, 0.96, 0.64, 0.94)
  profile.quadraticCurveTo(1.04, 0.92, 1.34, 0.62)
  profile.quadraticCurveTo(1.62, 0.44, 1.92, 0.40)
  profile.quadraticCurveTo(2.24, 0.32, 2.30, 0.10)
  profile.quadraticCurveTo(2.34, -0.12, 2.20, -0.50)
  profile.lineTo(-2.18, -0.50)

  const bodyGeo = new THREE.ExtrudeGeometry(profile, {
    steps: 1, depth: 1.80,
    bevelEnabled: true, bevelThickness: 0.10, bevelSize: 0.10, bevelSegments: 14,
  })
  bodyGeo.computeBoundingBox()
  const bz = (bodyGeo.boundingBox.max.z + bodyGeo.boundingBox.min.z) / 2
  bodyGeo.translate(0, 0, -bz)
  const body = new THREE.Mesh(bodyGeo, paint)
  body.castShadow = true
  g.add(body)

  // Windows
  const mkWin = (pts) => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    geo.setIndex([0,1,2,0,2,3])
    geo.computeVertexNormals()
    return new THREE.Mesh(geo, glass)
  }
  const wz = 0.82
  g.add(mkWin([-0.38,0.72,-wz, -0.38,0.72,wz, 0.10,0.94,wz, 0.10,0.94,-wz]))
  g.add(mkWin([0.64,0.94,-wz, 0.64,0.94,wz, 1.32,0.60,wz, 1.32,0.60,-wz]))
  ;[-wz, wz].forEach(z_ => {
    g.add(mkWin([-0.36,0.71,z_, 0.08,0.93,z_, 0.62,0.93,z_, 0.64,0.71,z_]))
  })

  // Wheels — 20" turbine style
  const WHEELS = [[-1.44,-0.50,1.06],[-1.44,-0.50,-1.06],[1.44,-0.50,1.06],[1.44,-0.50,-1.06]]
  WHEELS.forEach(([wx,wy,wz_]) => {
    const wg = new THREE.Group()
    wg.add(new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 24, 64), rubber))
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.25, 64), chrome)
    rim.rotation.x = Math.PI / 2
    wg.add(rim)
    for (let i = 0; i < 10; i++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.22, 0.038), chrome)
      sp.rotation.z = (i / 10) * Math.PI * 2
      wg.add(sp)
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 20), chrome)
    cap.rotation.x = Math.PI / 2
    wg.add(cap)
    wg.position.set(wx, wy, wz_)
    g.add(wg)
  })

  // Headlights — slim LED strips
  ;[-0.88, 0.88].forEach(z_ => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.018, 0.30), white)
    hl.position.set(-2.16, 0.22, z_)
    g.add(hl)
    const ind = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.014, 0.12), new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.4 }))
    ind.position.set(-2.16, 0.14, z_)
    g.add(ind)
  })
  g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 0.62), white), { position: new THREE.Vector3(-2.17, 0.24, 0) }))

  // Tail lights — full width LED bar
  const tlBar = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.016, 1.36), red)
  tlBar.position.set(2.22, 0.38, 0)
  g.add(tlBar)
  ;[-0.74, 0.74].forEach(z_ => {
    const cl = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.12, 0.44), red)
    cl.position.set(2.20, 0.16, z_)
    g.add(cl)
  })

  // Front grille
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.94), dark)
  grille.position.set(-2.22, -0.16, 0)
  g.add(grille)
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.007, 0.90), chrome)
    slat.position.set(-2.20, -0.22 + i * 0.022, 0)
    g.add(slat)
  }

  // Front splitter
  const spl = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.034, 1.56), dark)
  spl.position.set(-2.24, -0.50, 0)
  g.add(spl)
  for (let i = -2; i <= 2; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.016), dark)
    fin.position.set(-2.22, -0.48, i * 0.24)
    g.add(fin)
  }

  // Ducktail spoiler
  const sp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.050, 1.66), paint)
  sp.position.set(1.88, 0.56, 0)
  sp.rotation.z = -0.14
  g.add(sp)

  // Rear diffuser
  const diff = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.065, 1.34), dark)
  diff.position.set(2.20, -0.46, 0)
  diff.rotation.z = 0.10
  g.add(diff)
  for (let i = -3; i <= 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.015), dark)
    fin.position.set(2.20, -0.45, i * 0.19)
    g.add(fin)
  }

  // Exhausts
  ;[-0.15, 0.15].forEach(z_ => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.13, 24), chrome)
    pipe.rotation.x = Math.PI / 2
    pipe.position.set(2.28, -0.44, z_)
    g.add(pipe)
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.07, 16), new THREE.MeshStandardMaterial({ color: 0x080606, roughness: 0.9 }))
    inner.rotation.x = Math.PI / 2
    inner.position.set(2.30, -0.44, z_)
    g.add(inner)
  })

  // Side skirts
  ;[-0.95, 0.95].forEach(z_ => {
    const sk = new THREE.Mesh(new THREE.BoxGeometry(3.70, 0.058, 0.058), dark)
    sk.position.set(0, -0.50, z_)
    g.add(sk)
  })

  // Door handles
  ;[[-0.12,-0.95],[-0.12,0.95],[0.52,-0.95],[0.52,0.95]].forEach(([x,z_]) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.023, 0.030), chrome)
    h.position.set(x, 0.16, z_)
    g.add(h)
  })

  // Mirrors
  ;[-0.98, 0.98].forEach(z_ => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.17), dark)
    arm.position.set(-0.44, 0.40, z_ * 0.97)
    g.add(arm)
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.085, 0.030), dark)
    face.position.set(-0.42, 0.40, z_)
    g.add(face)
    const mf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.072, 0.010), chrome)
    mf.position.set(-0.41, 0.40, z_)
    g.add(mf)
  })

  // Body crease highlight
  const cr = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.007, 1.74), new THREE.MeshStandardMaterial({ color: 0x3a3a50, metalness: 0.95, roughness: 0.08 }))
  cr.position.set(0, -0.02, 0)
  g.add(cr)

  g.position.y = 0.50
  return g
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
    controls.enableDamping = true
    controls.dampingFactor = 0.08
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

    const key = new THREE.DirectionalLight(0xffffff, 3.2)
    key.position.set(-5, 8, 3)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.top = 6; key.shadow.camera.bottom = -4
    key.shadow.camera.left = -8; key.shadow.camera.right = 8
    key.shadow.bias = -0.001
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x7090cc, 1.0)
    fill.position.set(6, 3, -5)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xfff0e0, 1.6)
    rim.position.set(2, 2, -7)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.06))

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.01
    shadow.receiveShadow = true
    scene.add(shadow)

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
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'grab' }}>
      {hint && (
        <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', zIndex: 1, animation: 'hf 1s ease 2s both' }}>
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
