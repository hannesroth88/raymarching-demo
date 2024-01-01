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
let mouseClickToggle = true;

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
        iMouse: { type: 'v4', value: new THREE.Vector4(1,1) },
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
    material.uniforms.iResolution.value.x = renderer.domElement.width
    material.uniforms.iResolution.value.y = renderer.domElement.height
    render()
}

// pass mouse position to x and y axis
document.onmousemove = function(e) {
    material.uniforms.iMouse.value.x = e.pageX / window.innerWidth;
    material.uniforms.iMouse.value.y = e.pageY / window.innerHeight;
  }

// pass mouse click to z axis
document.onclick = function(e) {
    mouseClickToggle = !mouseClickToggle;
    material.uniforms.iMouse.value.z = mouseClickToggle ? 0 : 1;
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
