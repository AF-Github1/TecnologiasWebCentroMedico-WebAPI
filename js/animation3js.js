/* global THREE */

const SCENE_CONFIG = {
  containerAnimacao: 'container-3d',
  ficheiro: 'media/cruz.glb',
  rotationSpeed: 0.02
}

function inicializarCena () {
  /*

  Inicializa a cena 3D, configurando a posição da camera, o tipo de luz que incide sobre o objecto e a posição do modelo, 
  sendo o modelo uma cruz 3D criada em blender
  
  */

  const container = document.getElementById(SCENE_CONFIG.containerAnimacao)
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100) // Configuração do posicionamento da camera
  camera.position.z = 10

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // Informação para renderização, permitindo controlar o aspecto da cruz e o fundo
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0x00ff00, 0.8) // Luz verde para forçar a cor da cruz a ser verde
  scene.add(ambientLight)

  const LoaderClass = THREE.GLTFLoader // Carregamento de modelo
  const loader = new LoaderClass()
  let model

  loader.load(
    SCENE_CONFIG.ficheiro,
    (gltf) => {
      model = gltf.scene

      const box = new THREE.Box3().setFromObject(model) // Definição do posicionamento do modelo
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      const maxDim = Math.max(size.x, size.y)
      if (maxDim > 0) {
        const scale = 5 / maxDim
        model.scale.set(scale, scale, scale)
      }

      model.position.x += (model.position.x - center.x)
      model.position.y += (model.position.y - center.y)

      scene.add(model)
      animateRotation()
    }
  )

  function animateRotation () {
  /*

  Aplica uma animação de rotação no modelo da cruz, causando com que esta rode sobre o eixo y

  */

    requestAnimationFrame(animateRotation)
    model.rotation.y += SCENE_CONFIG.rotationSpeed
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
}

window.addEventListener('DOMContentLoaded', inicializarCena)
