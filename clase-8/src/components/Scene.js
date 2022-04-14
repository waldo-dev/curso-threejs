import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import "./Scene.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

export const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    //Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const gui = new dat.GUI()

    const scene = new THREE.Scene()

    //Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 2
    scene.add(camera)

    //Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
    directionalLight.position.set(2, 2, -1)
    gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
    gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
    gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
    gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 1
    //Ajuste de camara a lo que realmente debe dirigir la luz
    directionalLight.shadow.camera.far = 6
    directionalLight.shadow.camera.top = 2
    directionalLight.shadow.camera.right = 2
    directionalLight.shadow.camera.bottom = -2
    directionalLight.shadow.camera.left = -2
    //Difuminar
    //directionalLight.shadow.radius = 10

    //Helper
    const directionalLightHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    )
    scene.add(directionalLightHelper)
    directionalLightHelper.visible = false

    scene.add(directionalLight)

    //Spot Light
    const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
    spotLight.castShadow = true
    spotLight.position.set(0, 2, 2)
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.fov = 30
    spotLight.shadow.camera.near = 1
    spotLight.shadow.camera.far = 6
    scene.add(spotLight)
    scene.add(spotLight.target)
    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera
    )
    scene.add(spotLightCameraHelper)
    spotLightCameraHelper.visible = false

    //Point Light
    const pointLight = new THREE.PointLight(0xffffff, 0.3)
    pointLight.castShadow = true
    pointLight.position.set(-1, 1, 0)
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024

    pointLight.shadow.camera.near = 0.1
    pointLight.shadow.camera.far = 5
    scene.add(pointLight)

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera
    )
    scene.add(pointLightCameraHelper)
    pointLightCameraHelper.visible = false

    //Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.7
    gui.add(material, "metalness").min(0).max(1).step(0.001)
    gui.add(material, "roughness").min(0).max(1).step(0.001)

    const textureLoader = new THREE.TextureLoader()
    //const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg")
    const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")
    //Objects
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.5
    plane.receiveShadow = true

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    )
    sphere.castShadow = true
    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
      })
    )
    sphereShadow.rotation.x = -Math.PI * 0.5
    sphereShadow.position.y = plane.position.y + 0.01

    scene.add(sphere, plane, sphereShadow)

    //Renderer
    const renderer = new THREE.WebGLRenderer()
    const canvas = renderer.domElement
    canvas.className = "webgl"
    currentMount.appendChild(canvas)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    //Precision de sombra
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    //Shadows
    renderer.shadowMap.enabled = false

    //Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    //Animate
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      //Update the sphere
      sphere.position.x = Math.cos(elapsedTime) * 1.5
      sphere.position.z = Math.sin(elapsedTime) * 1.5
      sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

      //Update the shadow
      sphereShadow.position.x = sphere.position.x
      sphereShadow.position.z = sphere.position.z
      sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

      controls.update()

      renderer.render(scene, camera)

      window.requestAnimationFrame(tick)
    }
    tick()

    // Screens Protocols
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

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    return () => {
      currentMount.removeChild(canvas)
      gui.destroy()
    }
  }, [])

  return <div ref={mountRef}></div>
}
