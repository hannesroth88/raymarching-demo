import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import raymarcherFragment from './shaders/raymarcher.frag'
import raymarcherVertex from './shaders/raymarcher.vert'

const scene = new THREE.Scene()
const startTime = Date.now();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500)
camera.position.z = 1

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

// Shader code
const rayMarchingShader = {
    vertexShader: raymarcherVertex,
    fragmentShader: raymarcherFragment,
    uniforms: {
        iResolution: {
            type: 'v2',
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iTime: { type: 'f', value: 0.0 },
        iTimeDelta: { type: 'f', value: 0.0 },
        iFrameRate: { type: 'f', value: 60.0 },
        iFrame: { type: 'i', value: 0 },
        iChannelTime: { type: 'fv1', value: [0.0, 0.0, 0.0, 0.0] },
        iChannelResolution: {
            type: 'v3v',
            value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
        },
        iMouse: { type: 'v4', value: new THREE.Vector4() },
        iDate: { type: 'v4', value: new THREE.Vector4() }, // You need to set the values for year, month, day, time
    },
}

const material = new THREE.ShaderMaterial(rayMarchingShader)
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
    
    // Update  iTime
    const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds    
    material.uniforms.iTime.value = elapsedTime;

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()
