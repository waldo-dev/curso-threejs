import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import "./Scene.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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

    //Textures
    const textureLoader = new THREE.TextureLoader()

    const doorColorTexture = textureLoader.load("/textures/basecolor.jpg")
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/ambientOcclusion.jpg"
    )
    const doorHeightTexture = textureLoader.load("/textures/height.png")
    const doorNormalTexture = textureLoader.load("/textures/normal.jpg")
    const doorRoughnessTexture = textureLoader.load("/textures/roughness.jpg")
    const matcapTexture = textureLoader.load("/textures/matcap/matcap.png")
    const gradientTexture = textureLoader.load("/textures/gradients/3.jpg")

    //Materials
    //const material = new THREE.MeshBasicMaterial({
    //map: doorColorTexture,
    //color: 0xff0000,
    //})
    //const material = new THREE.MeshNormalMaterial({
    //  flatShading: true,
    //})
    //const material = new THREE.MeshMatcapMaterial({
    //  matcap: matcapTexture,
    //})
    //const material = new THREE.MeshLambertMaterial()
    //const material = new THREE.MeshPhongMaterial()
    //material.shininess = 100
    //material.specular = new THREE.Color(0x1188ff)
    const material = new THREE.MeshToonMaterial()

    //Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      material
    )
    sphere.position.x = -1.5

    const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material)
    plane.position.x = 0

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
      material
    )
    torus.position.x = 1.5

    scene.add(sphere, plane, torus)

    const camera = new THREE.PerspectiveCamera(
      85,
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

    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      //Update objects
      sphere.rotation.y = 0.1 * elapsedTime
      plane.rotation.y = 0.1 * elapsedTime
      torus.rotation.y = 0.1 * elapsedTime
      sphere.rotation.x = 0.15 * elapsedTime
      plane.rotation.x = 0.15 * elapsedTime
      torus.rotation.x = 0.15 * elapsedTime
      orbitControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    return () => {
      currentMount.removeChild(canvas)
    }
  }, [])

  return <div ref={mountRef}></div>
}
//te amo
