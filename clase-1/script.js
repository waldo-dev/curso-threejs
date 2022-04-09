//Scene
const scene = new THREE.Scene()

//Model
/*const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0.7, -0.6, 1)
//console.log(mesh.position.length())
mesh.scale.set(2, 0.25, 0.5)
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
scene.add(mesh)*/

//Geometrys Group
const group = new THREE.Group()
// Se modifica la escala de todas las geometrias dentro del grupo
group.scale.y = 2
// Se rotan las geometrias en el eje y
group.rotation.y = 0.2
// Se agregan todas las geometrias que esten dentro del grupo a la escena
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = -2
group.add(cube1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = -0.5
group.add(cube2)

//Size camera
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
//console.log(mesh.position.distanceTo(camera.position))
//console.log(mesh.position.normalize())
camera.lookAt(new THREE.Vector3((0, -1, 0)))
//camera.lookAt(mesh.position)
scene.add(camera)

//Canvas
const canvas = document.querySelector("#webgl")

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

//AxesHelper Para ubicar hacia donde esta cada eje
// verde y -- rojo x -- azul z
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

renderer.setSize(sizes.width, sizes.height)

//Animations
// Se debe crear un bucle infinito
// Depende de la velocidad del computador que tan rapido este girara
/*
const tick = () => {
  group.rotation.y += 0.01
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
*/

//Funcion tick mejorada para que funcione igual en todas las computadoras
//Tiempo de cuando se lee el archivo
let time = Date.now()
const tick = () => {
  //Tiempo en el que se ejecuta la fucion
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  //Rotation
  group.rotation.y += 0.001 * deltaTime

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
//tick()

//La misma funcion anterior pero refactorizada
let clock = new THREE.Clock()

const BetterTick = () => {
  const elapsedTime = clock.getElapsedTime()

  //Update Objects
  group.position.x = Math.cos(elapsedTime)
  group.position.y = Math.sin(elapsedTime)
  group.rotation.y += 0.001 * elapsedTime
  camera.lookAt(group.position)

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
BetterTick()
