import React, { useEffect, useRef } from "react"
import * as THREE from "three"
//import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    //Scene
    const scene = new THREE.Scene()

    //Cube
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    mesh.position.x = -2
    scene.add(mesh)

    //Camera
    //Size camera
    const sizes = {
      width: 800,
      height: 600,
    }
    //const aspectRatio = sizes.width / sizes.height
    //const camera = new THREE.OrthographicCamera(
    //  -1 * aspectRatio,
    //  1 * aspectRatio,
    //  1,
    //  -1,
    //  0.1,
    //  100
    //)
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 3
    camera.position.y = 2
    camera.lookAt(mesh.position)
    scene.add(camera)

    //Renderer
    const renderer = new THREE.WebGLRenderer()
    // Renderer crea un elemento canvas que se agregara a la escena
    currentMount.appendChild(renderer.domElement)

    renderer.setSize(sizes.width, sizes.height)
    //Controls
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    //orbitControls.target.y = 2
    orbitControls.enableDamping = true

    //Camara seguira a mouse
    const cursor = {
      x: 0,
      y: 0,
    }

    window.addEventListener("mousemove", event => {
      cursor.x = event.clientX / sizes.width - 0.5
      cursor.y = -(event.clientY / sizes.height - 0.5)
    })

    //gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

    const betterTick = () => {
      orbitControls.update()
      //camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
      //camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
      //camera.position.y = cursor.y * 3
      camera.lookAt(mesh.position)

      renderer.render(scene, camera)
      requestAnimationFrame(betterTick)
    }
    betterTick()

    return () => currentMount.removeChild(renderer.domElement)
  }, [])

  return <div ref={mountRef}></div>
}
