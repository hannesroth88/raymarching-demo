import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import raymarcherFragment from './shaders/raymarcher.frag'
import raymarcherVertex from './shaders/raymarcher.vert'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

// Shader code
const rayMarchingShader = {
    uniforms: {},
    vertexShader: raymarcherVertex,
    fragmentShader: raymarcherFragment,
}

const material = new THREE.ShaderMaterial(rayMarchingShader)
material.uniforms.iResolution = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
material.uniforms.iTime = { value: 0.0 }
material.uniforms.iTimeDelta = { value: 0.0 }
material.uniforms.iFrameRate = { value: 60.0 }
material.uniforms.iFrame = { value: 0 }
material.uniforms.iChannelTime = { value: [0.0, 0.0, 0.0, 0.0] }
material.uniforms.iChannelResolution = {
    value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
}
material.uniforms.iMouse = { value: new THREE.Vector4() }
material.uniforms.iDate = { value: new THREE.Vector4() } // You need to set the values for year, month, day, time

const geometry = new THREE.PlaneGeometry(2, 2)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
