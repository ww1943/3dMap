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
    leftGroup();
    rightGroup();
    playerGroup();
    initPlayer();
    initClick();
    animate();
}
function initPlayer(){
    playerDataA.forEach((d,id) => {
        PlayerA(d,-247+id*38,200)
    })
    playerDataB.forEach((d,id) => {
        PlayerB(d,-265+id*38,-200)
    })
}
function PlayerA(data,x,z){
    let group = new THREE.Group();

    //背景贴图
    let texture = new THREE.TextureLoader().load('../imgs/10.png');
    let materials = new THREE.MeshBasicMaterial({map:texture});
    // let materials = new THREE.MeshBasicMaterial({color:0xffffff});
    let geometry  = new THREE.PlaneGeometry(38,100,0);
    let plane = new THREE.Mesh(geometry,materials);
    plane.material.transparent = true;
    plane.material.opacity = 0;
    plane.rotation.x = -Math.PI/2;
    group.add(plane)


    let mtlLoader = new THREE.MTLLoader();
    let loader = new THREE.OBJLoader();
    mtlLoader.load( `../js/obj/model/d-jiaohuanji.mtl`, function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load(`../js/obj/model/d-jiaohuanji.obj`,object => {
            object.scale.set(0.15,0.15,0.15)
            object.position.set(0,0,-40);
            group.add(object)
        })
    })

    for(let i=0;i<4;i++){
        let mtlLoader = new THREE.MTLLoader();
        let loader = new THREE.OBJLoader();
        mtlLoader.load( `../js/obj/model/guanjunzhuji.mtl`, function(materials) {
            materials.preload();
            loader.setMaterials(materials);
            loader.load(`../js/obj/model/guanjunzhuji.obj`,object => {
                object.scale.set(0.06,0.06,0.06)
                object.position.set(-13+(i*9),0,-10);
                let lineMaterial = new THREE.LineBasicMaterial({color:0x214f79});
                let geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0,0,-40))
                geometry.vertices.push(new THREE.Vector3((i*9-13)/2, 0 ,(-40-10)/2))
                geometry.vertices.push(new THREE.Vector3(-13+(i*9),0,-10))
                let line = new THREE.Line( geometry, lineMaterial );
                group.add(line)
                group.add(object)
            })
        })
    }

    let img = new THREE.TextureLoader().load('../imgs/13.png');
    let imgMaterials = new THREE.MeshBasicMaterial({map:img});
    let imgGeometry  = new THREE.PlaneGeometry(22,32,0);
    let imgPlane = new THREE.Mesh(imgGeometry,imgMaterials);
    imgPlane.rotation.x = -Math.PI/2;
    imgPlane.position.set(0,0.1,13);
    imgPlane.name=data.playerName;
    imgPlane.types='clickMesh';
    group.add(imgPlane)
    
    group.name = data.playerName;
    group.types ='player';
    group.position.set(x,0.1,z);
    scene.add(group)
}
function PlayerB(data,x,z){
    let group = new THREE.Group();

    //背景贴图
    let texture = new THREE.TextureLoader().load('../imgs/10.png');
    let materials = new THREE.MeshBasicMaterial({map:texture});
    // let materials = new THREE.MeshBasicMaterial({color:0xffffff});
    let geometry  = new THREE.PlaneGeometry(38,100,0);
    let plane = new THREE.Mesh(geometry,materials);
    plane.material.transparent = true;
    plane.material.opacity = 0;
    plane.rotation.x = -Math.PI/2;
    group.add(plane)


    let mtlLoader = new THREE.MTLLoader();
    let loader = new THREE.OBJLoader();
    mtlLoader.load( `../js/obj/model/d-jiaohuanji.mtl`, function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load(`../js/obj/model/d-jiaohuanji.obj`,object => {
            object.scale.set(0.15,0.15,0.15)
            object.position.set(0,0,40);
            group.add(object)
        })
    })

    for(let i=0;i<4;i++){
        let mtlLoader = new THREE.MTLLoader();
        let loader = new THREE.OBJLoader();
        mtlLoader.load( `../js/obj/model/guanjunzhuji.mtl`, function(materials) {
            materials.preload();
            loader.setMaterials(materials);
            loader.load(`../js/obj/model/guanjunzhuji.obj`,object => {
                object.scale.set(0.06,0.06,0.06)
                object.position.set(-13+(i*9),0,10);
                let lineMaterial = new THREE.LineBasicMaterial({color:0x214f79});
                let geometry = new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(0,0,40))
                geometry.vertices.push(new THREE.Vector3((i*9-13)/2, 0 ,(40+10)/2))
                geometry.vertices.push(new THREE.Vector3(-13+(i*9),0,10))
                let line = new THREE.Line( geometry, lineMaterial );
                group.add(line)
                group.add(object)
            })
        })
    }

    let img = new THREE.TextureLoader().load('../imgs/13.png');
    let imgMaterials = new THREE.MeshBasicMaterial({map:img});
    let imgGeometry  = new THREE.PlaneGeometry(22,32,0);
    let imgPlane = new THREE.Mesh(imgGeometry,imgMaterials);
    imgPlane.rotation.x = -Math.PI/3;
    imgPlane.position.set(0,15,-13);
    imgPlane.name=data.playerName;
    imgPlane.types='clickMesh';
    group.add(imgPlane)
    
    group.name = data.playerName;
    group.types ='player';
    group.position.set(x,0.1,z);
    scene.add(group)
}

function initClick() {
    //点击
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseover', onDocumentMouseOver, false);

    function  getIntersects(event){
        event.preventDefault();
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
        if (event.button == 2) {
            console.log('鼠标右键')
        } else {
            raycaster.setFromCamera(mouse,camera)
            let data = [];
            scene.children.forEach(x =>{
                if(x.types == 'player'){
                    data.push(x)
                }
            })
            let team = [];
            data.forEach(x => {
                team.push(...x.children)
            })
            return raycaster.intersectObjects(team);
        }
    }
    function onDocumentMouseDown(event) {
        let intersects = getIntersects(event);
        if(intersects.length>0){
            intersects.forEach(x =>{
                if(x.object.types =='clickMesh'){
                    scene.children.forEach(y => {
                        if(y.types == 'player'){
                            if(y.name == x.object.name){
                                y.children[0].material.transparent = false;
                                y.children[0].material.opacity = 1;
                            }else{
                                y.children[0].material.transparent = true;
                                y.children[0].material.opacity = 0;
                            }
                        }
                    })
                }
            })
        }
    }
    function onDocumentMouseOver(event) {
        console.log(event)
    }
}

function initLight(){
        ambientLight = new THREE.AmbientLight("#eeeeee");
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight("#ffffff");
        directionalLight.position.set(-40, 60, -10);

        directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
        directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
        directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
        directionalLight.shadow.camera.right = 50; //最右边
        directionalLight.shadow.camera.top = 50; //最上边
        directionalLight.shadow.camera.bottom = -50; //最下面

        //这两个值决定使用多少像素生成阴影 默认512
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.mapSize.width = 1024;

        //告诉平行光需要开启阴影投射
        directionalLight.castShadow = true;

        scene.add(directionalLight);
}
function initHelper(){
    var axesHelper = new THREE.AxesHelper( 200 );
    scene.add( axesHelper );
}
function initObj(){
    earthData.forEach(x => {
        loadObj(x.name,x.position);
    })
}
//黑盒测试区
function leftGroup(){
    var group = new THREE.Group();
    var texture = new THREE.TextureLoader().load('../imgs/12.png');
    var materials = new THREE.MeshBasicMaterial({map:texture});
    var geometry  = new THREE.PlaneGeometry(120,100,0);
    var plane = new THREE.Mesh(geometry,materials);
    plane.position.set(190,0,0);
    plane.rotation.x = -Math.PI/2;
    group.add(plane)
    groupAdd(group,lGroupData);
    scene.add(group);
}
//白盒测试区
function rightGroup(){
    var group = new THREE.Group();
    var texture = new THREE.TextureLoader().load('../imgs/12.png');
    var materials = new THREE.MeshBasicMaterial({map:texture});
    var geometry  = new THREE.PlaneGeometry(120,100,0);
    var plane = new THREE.Mesh(geometry,materials);
    plane.position.set(-190,0,0);
    plane.rotation.x = -Math.PI/2;
    group.add(plane)
    groupAdd(group,rGroupData);
    scene.add(group);
}
function groupAdd(group,data){
    data.forEach(x => {
        let mtlLoader = new THREE.MTLLoader();
        let loader = new THREE.OBJLoader();
        mtlLoader.load( `../js/obj/model/${x.name}.mtl`, function(materials) {
            console.log(materials)
            materials.preload();
            loader.setMaterials(materials);
            loader.load(`../js/obj/model/${x.name}.obj`,object => {
                object.scale.set(0.2,0.2,0.2)
                object.position.set(x.position.x,x.position.y,x.position.z);
                if(x.rotation){
                    object.rotation.y = x.rotation;
                }
                if(x.scale){
                    object.scale.set(x.scale,x.scale,x.scale);
                }
                group.add(object)
            })
        })
    })
}
//选手区
function playerGroup(){
    var group = new THREE.Group();
    //上选手区
    var texture1 = new THREE.TextureLoader().load('../imgs/11.png');
    var materials1 = new THREE.MeshBasicMaterial({map:texture1});
    var geometry1  = new THREE.PlaneGeometry(560,100,0);
    var plane1 = new THREE.Mesh(geometry1,materials1);
    plane1.position.set(0,0,-200);
    plane1.rotation.x = -Math.PI/2;
    //下选手区
    var texture2 = new THREE.TextureLoader().load('../imgs/11.png');
    var materials2 = new THREE.MeshBasicMaterial({map:texture2});
    var geometry2  = new THREE.PlaneGeometry(560,100,0);
    var plane2 = new THREE.Mesh(geometry2,materials2);
    plane2.position.set(0,0,200);
    plane2.rotation.x = -Math.PI/2;

    group.add(plane1)
    group.add(plane2)
    scene.add(group);
}

function loadObj(name,position){
    let mtlLoader = new THREE.MTLLoader();
    let loader = new THREE.OBJLoader();
    mtlLoader.load( `../js/obj/model/${name}.mtl`, function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load(`../js/obj/model/${name}.obj`,object => {
            object.scale.set(0.2,0.2,0.2)
            object.position.set(position.x,position.y,position.z);
            scene.add(object)
        })
    })
    
}
function animate(){
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}