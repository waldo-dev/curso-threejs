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

    // Create an empty BufferGeometry
    const geometry = new THREE.BufferGeometry()

    // Create 50 triangles (450 values)
    const count = 50
    const positionsArray = new Float32Array(count * 3 * 3)
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4
    }

    // Create the attribute and name it 'position'
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
    geometry.setAttribute("position", positionsAttribute)

    scene.add(geometry)

    const camera = new THREE.PerspectiveCamera(
      75,
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

    /* Con esto es suficiente pero para safari se deben agregar algunos metodos
    window.addEventListener("dblclick", () => {
      if (!document.fullscreenElement) {
        canvas.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })*/
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

    const tick = () => {
      orbitControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    tick()

    return () => currentMount.removeChild(canvas)
  }, [])

  return <div ref={mountRef}></div>
}
