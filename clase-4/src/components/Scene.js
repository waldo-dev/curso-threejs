import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import "./Scene.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import gsap from "gsap"

export const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      //Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      //Update renderer
      renderer.setSize(sizes.width, sizes.height)
      //Fijacion de proporcion de pixeles
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const scene = new THREE.Scene()

    const parameters = {
      color: 0xff0000,
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 1,
          y: mesh.rotation.y + Math.PI * 2,
        })
      },
    }

    //Textures
    /*const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const texture = textureLoader.load(
      "/texture/basecolor.jpg"
      //(loadingManager.onStart = () => {}),
      //(loadingManager.onProgress = () => {}),
      //(loadingManager.onError = () => {})
    )*/
    const textureLoader = new THREE.TextureLoader()
    const colorTexture = textureLoader.load("/texture/basecolor.jpg")
    //const heightTexure = textureLoader.load("/texture/height.png")
    //const normalTexture = textureLoader.load("/texture/normal.jpg")
    //const ambientOclussionTexture = textureLoader.load(
    //  "/texture/ambientOclussion.jpg"
    //)
    //const roughnessTexture = textureLoader.load("/texture/roughness.jpg")
    //colorTexture.repeat.x = 2
    //colorTexture.repeat.y = 3
    colorTexture.wrapS = THREE.MirroredRepeatWrapping
    colorTexture.wrapT = THREE.MirroredRepeatWrapping
    //colorTexture.offset.x = 0.5
    //colorTexture.offset.y = 0.5
    colorTexture.rotation = Math.PI * 0.25
    colorTexture.center.x = 0.5
    colorTexture.center.y = 0.5

    //Filtros
    //Si la textura es mas grande que la superficie
    //minFilter
    colorTexture.generateMipmaps = false // descargara un poco la gpu
    colorTexture.minFilter = THREE.NearestFilter
    //Si la textura es más pequeña que la superficie
    //magFilter
    //colorTexture.magFilter = THREE.NearestFilter

    // Create an empty BufferGeometry
    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ map: colorTexture })
    )

    scene.add(mesh)

    const camera = new THREE.PerspectiveCamera(
      50,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 3
    camera.position.y = 0
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer()
    const canvas = renderer.domElement
    canvas.className = "webgl"
    currentMount.appendChild(canvas)
    renderer.setSize(sizes.width, sizes.height)

    // modo pantalla completa para todos los navegadores
    window.addEventListener("dblclick", () => {
      if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen()
        }
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    })

    const orbitControls = new OrbitControls(camera, canvas)
    orbitControls.enableDamping = true

    //Dat.gui
    const gui = new dat.GUI({ width: 200 })
    //posicion en y
    gui.add(mesh.position, "y").min(-2).max(2).step(0.01).name("elevation")
    //Visibilidad
    gui.add(mesh, "visible")
    // Wirefram
    gui.add(mesh.material, "wireframe")
    // Color
    gui
      .addColor(parameters, "color")
      .onChange(() => mesh.material.color.set(parameters.color))
    //Animation
    gui.add(parameters, "spin")

    const tick = () => {
      orbitControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    return () => {
      currentMount.removeChild(canvas)
      gui.destroy()
    }
  }, [])

  return <div ref={mountRef}></div>
}
