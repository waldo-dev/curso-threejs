import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import "./Scene.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

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

    const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
    const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/door/ambientOcclusion.jpg"
    )
    const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
    const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
    const doorMetalnessTexture = textureLoader.load(
      "/textures/door/metalness.jpg"
    )
    const doorRoughnessTexture = textureLoader.load(
      "/textures/door/roughness.jpg"
    )

    const matcapTexture = textureLoader.load("/textures/matcaps/2.png")

    //Materials
    /*
    Material basico
    const material = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    color: 0xff0000,
    })

     Material para ver como añadir luces entre otras cosas
    const material = new THREE.MeshNormalMaterial({
      flatShading: true,
    })

     Material que carga una imagen y mantiene efecto de luces
    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    })

     Material que reacciona a la luz 
    const material = new THREE.MeshLambertMaterial()

     Material que reacciona a la luz pero más realista
    const material = new THREE.MeshPhongMaterial()
    material.shininess = 100
    material.specular = new THREE.Color(0x1188ff)
    */

    const gui = new dat.GUI()

    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const environmentMapTexture = cubeTextureLoader.load([
      "/textures/environmentMaps/0/px.jpg",
      "/textures/environmentMaps/0/nx.jpg",
      "/textures/environmentMaps/0/py.jpg",
      "/textures/environmentMaps/0/ny.jpg",
      "/textures/environmentMaps/0/pz.jpg",
      "/textures/environmentMaps/0/nz.jpg",
    ])

    // Material estilo caricatura
    const material = new THREE.MeshStandardMaterial()
    material.metalness = 0.7
    material.roughness = 0.2
    gui.add(material, "metalness").min(0).max(1).step(0.0001)
    gui.add(material, "roughness").min(0).max(1).step(0.0001)
    material.envMap = environmentMapTexture

    /*
    material.gradientMap = gradientTexture
    gradientTexture.minFilter = THREE.NearestFilter
    gradientTexture.magFilter = THREE.NearestFilter
    gradientTexture.generateMipmaps = false
    const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
    material.metalness = 0
    material.roughness = 1
    material.aoMap = doorAmbientOcclusionTexture
    material.aoMapIntensity = 1
    material.displacementMap = doorHeightTexture
    material.displacementScale = 0.05
    material.metalnessMap = doorMetalnessTexture
    material.roughnessMap = doorRoughnessTexture
    material.normalMap = doorNormalTexture
    material.normalScale.set(0.5, 0.5)
    material.transparent = true
    material.alphaMap = doorAlphaTexture
    */

    //Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      material
    )
    sphere.position.x = -1.5

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 100, 100),
      material
    )
    plane.position.x = 0

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
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
      gui.destroy()
    }
  }, [])

  return <div ref={mountRef}></div>
}
