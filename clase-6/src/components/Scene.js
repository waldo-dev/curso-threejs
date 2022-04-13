import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
import "./Scene.css"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//Textos
//Aprendido en lecciones anteriores

export const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    //Size screen
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const scene = new THREE.Scene()

    //Matcaps
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load("/textures/matcaps/5.png")

    //Fonts
    const fontLoader = new FontLoader()

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    })

    //Donuts
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
    //DonutsArray
    let donutArray = []
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, material)
      // Aleteoridad en su posicion
      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10
      // Aleteoridad en su Rotation
      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI
      // Aleoteridad en su escala
      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      donutArray.push(donut)
    }

    fontLoader.load("/fonts/helvetiker_regular.typeface.json", font => {
      const textGeometry = new TextGeometry("Hello Three.js", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      })
      const text = new THREE.Mesh(textGeometry, material)
      //textGeometry.computeBoundingBox()
      //textGeometry.translate(
      //  (textGeometry.boundingBox.max.x - 0.02) * -0.5,
      //  (textGeometry.boundingBox.max.y - 0.02) * -0.5,
      //  (textGeometry.boundingBox.max.z - 0.02) * -0.5
      //)
      textGeometry.center()
      donutArray.map(donut => scene.add(donut))
      scene.add(text)
    })

    //Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 4
    camera.position.y = 0
    scene.add(camera)

    //Renderer
    const renderer = new THREE.WebGLRenderer()
    const canvas = renderer.domElement
    canvas.className = "webgl"
    currentMount.appendChild(canvas)
    renderer.setSize(sizes.width, sizes.height)

    // Full Screen all browsers
    window.addEventListener("dblclick", () => {
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement
      if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    })

    // Resize screen
    window.addEventListener("resize", () => {
      //Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      //Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //Controls
    const orbitControls = new OrbitControls(camera, canvas)
    orbitControls.enableDamping = true

    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      orbitControls.update()
      donutArray.map(donut => (donut.rotation.y = 0.8 * elapsedTime))
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()
  }, [])

  return <div ref={mountRef}></div>
}
