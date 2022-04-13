import React, { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import "./Scene.css"
import * as dat from "dat.gui"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"

export const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

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
    camera.position.z = 4
    camera.position.y = 1
    camera.position.x = 1.5
    scene.add(camera)

    //Materials
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4

    // Geometrys
    //Cube
    const cubeGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const cube = new THREE.Mesh(cubeGeometry, material)
    cube.position.x = 0
    //Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = -1.5
    //Donut
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
    const donut = new THREE.Mesh(donutGeometry, material)
    donut.position.x = 1.5
    //Plane
    const planeGeometry = new THREE.PlaneGeometry(7, 7)
    const plane = new THREE.Mesh(planeGeometry, material)
    plane.rotation.x = -Math.PI * 0.5
    plane.position.y = -0.5
    scene.add(cube, sphere, donut, plane)

    //Lights
    //Ambient light (Luz que alumbra hacia todos lados por igual)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // directional light (Luz que alumbra desde un punto especifico)
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0)
    directionalLight.position.set(1, 0.25, 0)
    scene.add(directionalLight)
    //Directional Light Helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    )
    scene.add(directionalLightHelper)

    //hemisphere light (Luz que alumbra con uncolor desde arriba y otro desde abajo)
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
    scene.add(hemisphereLight)
    //Hemisphere Light Helper
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    )
    scene.add(hemisphereLightHelper)

    //Point Light (Luz de encendedor, muy pequeña)
    const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
    pointLight.position.set(1, -0.4, 1)
    scene.add(pointLight)
    //Point Light Helper
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
    scene.add(pointLightHelper)

    //RectAreaLight (luz como las rectangulares de las sesiones de fotos)
    // solo funciona con meshStandardMaterial y MeshPhysicalMaterial
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
    rectAreaLight.position.set(-1.5, 0, 1.5)
    rectAreaLight.lookAt(new THREE.Vector3())
    scene.add(rectAreaLight)
    //RectAreaLight Helper
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
    scene.add(rectAreaLightHelper)
    //window.requestAnimationFrame(() => {
    //  rectAreaLightHelper.position.copy(rectAreaLight.position)
    //  rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    //  rectAreaLightHelper.update()
    //})

    //SpotLight (Luz como de linterna, un cono de luz)
    // parametros: color, intensity, distance, angle, penumbra, decay
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1
    )
    spotLight.position.set(0, 2, 3)
    spotLight.target.position.x = -0.75
    scene.add(spotLight)
    scene.add(spotLight.target)
    //Spot Light Helper
    //const spotLightHelper = new THREE.SpotLightHelper(pointLight)
    //scene.add(spotLightHelper)
    //window.requestAnimationFrame(() => {
    //  spotLightHelper.update()
    //})

    //Renderer
    const renderer = new THREE.WebGLRenderer()
    const canvas = renderer.domElement
    canvas.className = "webgl"
    currentMount.appendChild(canvas)
    renderer.setSize(sizes.width, sizes.height)

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

    //OrbitControls
    const orbitControls = new OrbitControls(camera, canvas)
    orbitControls.enableDamping = true

    //GUI
    gui.add(ambientLight, "intensity").min(0).max(1).step(0.001).name("ambient")
    gui
      .add(hemisphereLight, "intensity")
      .min(0)
      .max(1)
      .step(0.001)
      .name("hemisphere")
    gui.add(pointLight, "intensity").min(0).max(1).step(0.001).name("point")
    gui
      .add(directionalLight, "intensity")
      .min(0)
      .max(1)
      .step(0.001)
      .name("directional")

    // tick
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
