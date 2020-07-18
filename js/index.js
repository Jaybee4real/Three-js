







let scene, camera, renderer, controls;

function init(){
    scene = new THREE.Scene
    scene.background = new THREE.Color(0xdddddd)

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight,1,5000)
    camera.rotation.y = 45/180*Math.PI;
    camera.position.x = 700;
    camera.position.y = 60;
    camera.position.z = 1000;

    controls = new THREE.OrbitControls(camera, document.querySelector(".car-section"))
    controls.addEventListener("change", renderer)

    bglight = new THREE.AmbientLight(0x404040,10)

    directionalLight = new THREE.DirectionalLight(0xffffff,10)
    directionalLight.position.set(0,1,0)
    directionalLight.castShadow = true;
    scene.add(directionalLight)

    
    pointLight1 = new THREE.PointLight(0xffffff,2);
    pointLight1.position.set(1000,-100,-600)
    
    scene.add(bglight, pointLight1)

    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.querySelector(".car-section").appendChild(renderer.domElement)
     

    let loader = new THREE.GLTFLoader();
    loader.load('./models/scene.gltf', function(gltf){
        car = gltf.scene.children[0];
        car.scale.set(1, 1, 1);
        scene.add(gltf.scene)
        update()
    })
} 

function update(){
    renderer.render(scene,camera)
    requestAnimationFrame(update)
}

init()