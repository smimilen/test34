import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const BODY_MATS = ['body.012']
const DARK_MATS = ['glossy_black.002','glossy_black.003','grill','Mat_MT.001','Mat_mt.001','mat_mt','mat_mt.001']
const GLASS_MATS = ['glass','glass.018','Glass.013']
const TAIL_MATS = ['tailight','tailight.001','tailight.002','tailight.003','tailight.004','tailight.005']
const HEAD_MATS = ['headlight','headlight.007']

export default function Car3D() {
  const mountRef = useRef(null)
  const [hint, setHint] = useState(true)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()
    scene.background = null

    // Environment map для отражений
    try {
      const pmrem = new THREE.PMREMGenerator(renderer)
      const env = new RoomEnvironment()
      scene.environment = pmrem.fromScene(env, 0.04).texture
      pmrem.dispose()
      env.dispose()
    } catch(e) {}

    // Camera
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 200)
    camera.position.set(5.0, 2.2, 6.5)
    camera.lookAt(0, 0.5, 0)

    // Controls — с damping для плавного вращения
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.5, 0)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minPolarAngle = Math.PI * 0.12
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

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 3.5)
    key.position.set(-6, 10, 4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -4
    key.shadow.camera.left = -10; key.shadow.camera.right = 10
    key.shadow.bias = -0.001
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x7090cc, 1.1)
    fill.position.set(7, 4, -6)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xfff0e0, 1.8)
    rim.position.set(2, 3, -9)
    scene.add(rim)
    const bounce = new THREE.DirectionalLight(0xffffff, 0.22)
    bounce.position.set(0, -8, 0)
    scene.add(bounce)
    scene.add(new THREE.AmbientLight(0xffffff, 0.07))

    // Shadow catcher — невидимый пол только для теней
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.40 })
    )
    shadowCatcher.rotation.x = -Math.PI / 2
    shadowCatcher.position.y = -0.02
    shadowCatcher.receiveShadow = true
    scene.add(shadowCatcher)

    // Материалы
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a16, metalness: 0.95, roughness: 0.04,
      clearcoat: 1.0, clearcoatRoughness: 0.03, reflectivity: 1.0,
    })
    const darkMat = new THREE.MeshPhysicalMaterial({
      color: 0x080810, metalness: 0.88, roughness: 0.15, clearcoat: 0.4,
    })
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d1a2e, transparent: true, opacity: 0.50,
      roughness: 0.0, metalness: 0.05, side: THREE.DoubleSide,
    })
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xA2050F, emissive: 0xA2050F, emissiveIntensity: 0.55, roughness: 0.15,
    })
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.1,
    })

    // Draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    const modelUrl = import.meta.env.BASE_URL + 'supra.glb'
    let car = null
    let intro = 0
    let modelLoaded = false

    loader.load(
      modelUrl,
      (gltf) => {
        car = gltf.scene

        // Масштаб — на 10% больше (4.4 вместо 4.0)
        const box = new THREE.Box3().setFromObject(car)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const scale = 4.4 / Math.max(size.x, size.y, size.z)
        car.scale.setScalar(scale)

        // Центрируем
        box.setFromObject(car)
        box.getCenter(center)
        car.position.sub(center)
        car.position.y = 0

        // Убираем лого Toyota
        car.traverse((node) => {
          const name = node.name.toLowerCase()
          if (
            name.includes('logo') ||
            name.includes('badge') ||
            name.includes('emblem') ||
            name.includes('toyota')
          ) {
            node.visible = false
          }
        })

        // Применяем материалы
        car.traverse((node) => {
          if (!node.isMesh) return
          node.castShadow = true
          node.receiveShadow = true
          const name = node.material?.name || ''
          if (BODY_MATS.includes(name)) {
            node.material = paintMat
          } else if (DARK_MATS.includes(name)) {
            node.material = darkMat
          } else if (GLASS_MATS.includes(name)) {
            node.material = glassMat
          } else if (TAIL_MATS.includes(name)) {
            node.material = tailMat
          } else if (HEAD_MATS.includes(name)) {
            node.material = headMat
          } else if (node.material) {
            node.material.envMapIntensity = 1.2
          }
        })

        // Intro анимация — машина поднимается снизу
        car.position.y = -3.0
        car.rotation.y = Math.PI * 0.15
        scene.add(car)
        modelLoaded = true
        setLoading(false)
      },
      (xhr) => {
        if (xhr.total > 0) setProgress(Math.round(xhr.loaded / xhr.total * 100))
      },
      (err) => {
        console.error('GLB load error:', err)
        setLoading(false)
      }
    )

    // Render loop
    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      if (car && modelLoaded) {
        intro = Math.min(1, intro + 0.006)
        const t = 1 - Math.pow(1 - intro, 4)
        car.position.y = -3.0 + 3.0 * t
        car.rotation.y = Math.PI * 0.15 * (1 - t)
      }
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
      dracoLoader.dispose()
      try { if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement) } catch(e) {}
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      {/* Прогресс загрузки */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ width: 200, height: 1, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${progress}%`, background: '#A2050F',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{
            marginTop: 14, fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '0.2em',
          }}>
            ЗАГРУЗКА {progress}%
          </div>
        </div>
      )}

      {/* Подсказка про вращение */}
      {!loading && hint && (
        <div style={{
          position: 'absolute', bottom: '12%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          pointerEvents: 'none', zIndex: 10,
          animation: 'hf 1s ease 0.5s both',
        }}>
          <style>{`
            @keyframes hf{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
            @keyframes hs{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
          `}</style>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            style={{ animation: 'hs 2s ease-in-out infinite', opacity: 0.4 }}>
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.2"/>
            <path d="M7 12h10M12 7l5 5-5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Courier New,monospace',
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            Зажмите для поворота
          </span>
        </div>
      )}
    </div>
  )
}
