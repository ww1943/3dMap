var scene , camera , renderer , light;
var fov = 45
function load(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(0,300,500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({
        antialias: true,//抗锯齿             
        autoClear: true,
        alpha:true 
    })
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xEEEEEE, 0.0)
    document.body.appendChild( renderer.domElement );
    initLight();
    initHelper();
    initObj();
    animate();
}

function initLight(){
    var ambientLight = new THREE.AmbientLight( 0xeeeeee );
    scene.add( ambientLight );
}
function initHelper(){
    var axesHelper = new THREE.AxesHelper( 200 );
    scene.add( axesHelper );
}
function initObj(){
    let mtlLoader = new THREE.MTLLoader();
    let loader = new THREE.OBJLoader();
    mtlLoader.load( '../js/obj/model/d-hexinluyouqi.mtl', function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load('../js/obj/model/d-hexinluyouqi.obj',object => {
            console.log(object)
            object.scale.set(0.2,0.2,0.2)
            object.position.set(0,0,0);
            scene.add(object)
        })
    })
    
}
function animate(){
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}