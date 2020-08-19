let scroll = window.pageYOffset;

document.addEventListener("scroll", function (e) {
  let navbar = document.getElementById("navbar");
  var offset = window.pageYOffset;
  scroll = offset;
  if (scroll > 200) {
    navbar.classList.add("scroll");
  } else {
    navbar.classList.remove("scroll");
  }
});

let scene, camera, renderer, controls;

function init() {
  ////////////Create Scene, Camera and Set Cam Position//////////
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.rotation.y = (45 / 180) * Math.PI;
  camera.position.x = 930;
  camera.position.y = 120;
  camera.position.z = 1000;

  ////////////////Orbit Controls(conditional)//////////

  let orbiting = false;
  function addControls() {
    controls = new THREE.OrbitControls(
      camera,
      document.querySelector(".car-section")
    );

    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.addEventListener("change", renderer);
  }

  addControls();
  window.addEventListener("resize", addControls());

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 17) {
      if (orbiting === false) {
        controls.enableZoom = true;
        orbiting = true;
      } else if (orbiting === true) {
        controls.enableZoom = false;
        console.log("stopped orbiting");
        orbiting = false;
      }
    }
  });

  ////////////////////////////////////////////

  /////////Initialize Load Item////////

  //////////////////////////

  ///////////Lights///////////////////////
  bglight = new THREE.AmbientLight(0x404040, 10);

  directionalLight = new THREE.DirectionalLight(0xffffff, 7);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;

  pointLight1 = new THREE.PointLight(0xffffff, 2);
  pointLight1.castShadow = true;
  pointLight1.position.set(1000, -100, -600);

  scene.add(bglight, pointLight1, directionalLight);

  //////////////////////Add Platform///////////////

  var geometry = new THREE.CircleGeometry(500, 500, 502);
  var material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = (91 / 180) * Math.PI;
  plane.position.y = -10;
  scene.add(plane);

  ////////////////////////Render Scene//////////////////

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector(".car-section").appendChild(renderer.domElement);

  //////////Load Models//////////////////

  let models = ["mcLaren.gltf", "nissanGT.gltf"];
  let current = models[1];

  let loader = new THREE.GLTFLoader();
  loader.load("./models/" + current, function (gltf) {
    car = gltf.scene.children[0];
    car.scale.set(200, 200, 200);
    if (current == "mcLaren.gltf") {
      car.scale.set(0.7, 0.7, 0.7);
      car.position.y = 110;
    }
    scene.add(gltf.scene);
    update();
  });
}

let scene, camera, renderer, skyboxGeo, skybox, controls, myReq;
let zoomOut = false;
let autoRotate = true;
let skyboxImage = "";

function createPathStrings(filename) {
  const basePath = `./img/skyboxes/`;
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["xneg", "xpos", "yneg", "ypos", "zneg", "zpos"];
  const pathStings = sides.map((side) => {
    return baseFilename + side + fileType;
  });

  return pathStings;
}

function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);

    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
  });
  return materialArray;
}

function init() {



  const skyboxImage = ""

  const materialArray = createMaterialArray(skyboxImage);

  skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);

  scene.add(skybox);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enabled = true;
  controls.minDistance = 700;
  controls.maxDistance = 1500;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  window.addEventListener("resize", onWindowResize, false);
  animate();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

function animate() {
  controls.autoRotate = autoRotate;

  if (controls.maxDistance == 1500 && zoomOut) {
    controls.maxDistance = 20000;
    camera.position.z = 20000;
  } else if (controls.maxDistance == 20000 && !zoomOut) {
    console.log("called");
    controls.maxDistance = 1500;
    camera.position.z = 2000;
  }

  controls.update();
  renderer.render(scene, camera);
  myReq = window.requestAnimationFrame(animate);
}

function update() {
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

init();
