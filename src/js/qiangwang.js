var scene , camera , renderer , light , sourcePosition ,nextPosition;
var fov = 45 ,lineGroup = new THREE.Group();
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
    scene.add(lineGroup)
}
//选手区内容
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
                object.name = '主机'
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
    addPlayLine([0,0,60],[x,0.1,160])
}
function PlayerB(data,x,z){
    let group = new THREE.Group();

    //背景贴图
    let texture = new THREE.TextureLoader().load('../imgs/9.png');
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
                object.name = '主机'
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
    addPlayLine([0,0,-60],[x,0.1,-160])
}

function addPlayLine(source,target){
    let lineMaterial = new THREE.LineBasicMaterial({color:0x214f79});
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(source[0],source[1],source[2]))
    // geometry.vertices.push(new THREE.Vector3((i*9-13)/2, 0 ,(-40-10)/2))
    geometry.vertices.push(new THREE.Vector3(target[0],target[1],target[2]))
    let line = new THREE.Line( geometry, lineMaterial );
    lineGroup.add(line)
}

function initClick() {
    //点击
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

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
                                console.log(y)
                                document.querySelector('.threat_list').style.display = 'block';
                                let child =  y.children[3].children[0];
                                let child1 =  y.children[10].children[0];
                                sourcePosition = child.getWorldPosition();
                                nextPosition = child1.getWorldPosition();
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
    function onDocumentMouseMove(event) {
        let intersects = getIntersects(event);
        if(intersects.length>0){
            intersects.forEach(x =>{
                if(x.object.types =='clickMesh'){
                    scene.children.forEach(y => {
                        if(y.types == 'player'){
                            if(y.name == x.object.name){
                                document.getElementById('tooltip').innerHTML = y.name;
                                document.getElementById('tooltip').style.left = `${event.offsetX+20}px`;
                                document.getElementById('tooltip').style.top = `${event.offsetY}px`;
                                document.getElementById('tooltip').style.display = 'block';
                            }
                        }
                    })
                }
            })
        }else{
            setTimeout(() => {
                document.getElementById('tooltip').style.display = 'none';
            },100)
        }
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
    scene.add(group);
    groupAdd(group,lGroupData,[-100,0,0]);
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
    scene.add(group);
    groupAdd(group,rGroupData,[100,0,0]);
}
function groupAdd(group,data,source){
    data.forEach(x => {
        addPlayLine(source,[x.position.x,x.position.y,x.position.z])
        let mtlLoader = new THREE.MTLLoader();
        let loader = new THREE.OBJLoader();
        mtlLoader.load( `../js/obj/model/${x.name}.mtl`, function(materials) {
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
//选手区面板
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
//正中心5个服务器
function initObj(){
    earthData.forEach((x,i) => {
        loadObj(x.name,x.position,x.scale);
        if(i!=0){
            let s = earthData[0].position;
            let e = earthData[1].position;
            addPlayLine([s.x,s.y,s.z],[e.x,e.y,e.z])
        }
    })
}
function loadObj(name,position,scale){
    let mtlLoader = new THREE.MTLLoader();
    let loader = new THREE.OBJLoader();
    mtlLoader.load( `../js/obj/model/${name}.mtl`, function(materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load(`../js/obj/model/${name}.obj`,object => {
            object.scale.set(scale,scale,scale)
            object.position.set(position.x,position.y,position.z);
            scene.add(object)
        })
    })
    
}
function initThreatClick(){
    let i = parseInt(Math.random()*2);
    let data = [sourcePosition,nextPosition,...replayAttack[i]]
    addLine(data)
    let start = new THREE.Vector3(-200,0,0)
    let end = new THREE.Vector3(200,0,0)
    // addCurve({x:0,y:0,z:0},{x:200,y:0,z:0})
    addCurve(start,end)
}
function getVCenter(v1,v2){//求出两个点之间的中点
    let v = v1.add(v2);
    return v.divideScalar(2);
}
function getLenVcetor(v1, v2, len) {
    let v1v2Len = v1.distanceTo(v2);
    return v1.lerp(v2, len / v1v2Len);
}
function addCurve(src,dist){
    
    let start = src;
    let end = dist;
    let angle = start.angleTo(end)*270;
    let aLen = angle *50,hLen = angle*angle*120;
    let p0 = new THREE.Vector3(0,0,0);
    let rayLine  = new THREE.Ray(p0,getVCenter(start.clone(), end.clone()));
    let vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
    console.log(rayLine.at(1).distanceTo(p0))
    let v1 = getLenVcetor(start.clone(),vtop,aLen);
    let v2 = getLenVcetor(end.clone(),vtop,aLen);
    let curve = new THREE.CubicBezierCurve3(start, v1,v2,end);
    console.log(curve)
    let cinum = 30;
    let i = 0;
    let vector = curve.getPoints(30);
    console.log(vector)

    var geometry = new THREE.Geometry();
    for (let i = 0; i < cinum; i++) {
        geometry.vertices.push(new THREE.Vector3(...vector[0]));
    }
    //线条
    var line = new MeshLine();
    line.setGeometry( geometry );
    var material = new MeshLineMaterial({
        color: new THREE.Color("#91FFAA"),
        opacity: 1,
        sizeAttenuation: 1,
        lineWidth:1,
        near: 10,
        far: 100000,
    });
    var mesh = new THREE.Mesh(line.geometry,material);
    scene.add(mesh)

    let n = 0;
    var interval = (n) => {
        if (n >= cinum) {
            let timeNumber = 1500; 
            let t = setInterval(() => {
                n--;
                if (n < 0) {
                    deleteMesh(mesh)
                    clearInterval(t)
                } else {
                    line.advance(vector[cinum - 1])
                }
            }, timeNumber)
            return
        } else {
            n++
            setTimeout(() => {
                line.advance(vector[parseInt(n)])
                interval(n)
            }, 1500 / cinum);
        }
    }
    interval(n)
}

function addLine(arr){
    let p = (n) => {
        return parseFloat(n)
    }
    let vector = [];
    arr.forEach((d,i) => {
        if(i == arr.length-1){
            return;
        }
        let _src = {
            x: p(d.x),
            y: p(d.y)+0.1,
            z: p(d.z)
        }
        let _dst = {
            x: p(arr[i+1].x),
            y: p(arr[i+1].y)+0.1,
            z: p(arr[i+1].z)
        }
        let _center = [
            (_src.x + _dst.x) / 2,
            (_src.y + _dst.y) / 2,
            (_src.z + _dst.z) / 2
        ]
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(_src.x, _src.y, _src.z),
            new THREE.Vector3(_center[0], _center[1], _center[2]),
            new THREE.Vector3(_dst.x, _dst.y, _dst.z),
        ]);
        let point = curve.getPoints(30);
        vector.push(...point);
    })
    let cinum = arr.length*30;
    let i = 0;
    
    var geometry = new THREE.Geometry();
    for (let i = 0; i < cinum; i++) {
        geometry.vertices.push(new THREE.Vector3(vector[0].x,vector[0].y,vector[0].z));
    }
    
    //线条
    var line = new MeshLine();
    line.setGeometry( geometry );
    var material = new MeshLineMaterial({
        color: new THREE.Color("#91FFAA"),
        opacity: 1,
        sizeAttenuation: 1,
        lineWidth:1,
        near: 10,
        far: 100000,
    });
    var mesh = new THREE.Mesh(line.geometry,material);
    scene.add(mesh)

    //线头
    var Icon = lineIcon('../imgs/4.png',[vector[i].x,vector[i].y,vector[i].z]);
    Icon.name='线头';
    scene.add(Icon);

    let n = 0;
    console.log(n)
    var interval = (n) => {
        if (n >= cinum) {
            
            setTimeout(() => {
                deleteMesh(Icon)
                deleteMesh(mesh)
            },1000)
            // let timeNumber = 1500; 
            // let t = setInterval(() => {
            //     n--;
            //     if (n < 0) {
                    
            //         clearInterval(t)
            //     } else {
            //         // line.advance(vector[cinum - 1])
            //     }
            // }, timeNumber)
            return
        } else {
            n++
            setTimeout(() => {
                if(vector[parseInt(n)]){
                    line.advance(vector[parseInt(n)])
                    Icon.position.set(vector[parseInt(n)].x, vector[parseInt(n)].y, vector[parseInt(n)].z)
                }
                interval(n)
            }, 1500 / cinum);
        }
    }
    interval(n)
}
function addLines(src,dst){
    let p = (n) => {
        return parseFloat(n)
    }
    let _src = {
        x: p(src[0]),
        y: p(src[1]),
        z: p(src[2])
    }
    let _dst = {
        x: p(dst[0]),
        y: p(dst[1]),
        z: p(dst[2])
    }
    let _center = [
        (_src.x + _dst.x) / 2,
        (_src.y + _dst.y) / 2,
        (_src.z + _dst.z) / 2
    ]
    var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(_src.x, _src.y, _src.z),
        new THREE.Vector3(_center[0], _center[1], _center[2]),
        new THREE.Vector3(_dst.x, _dst.y, _dst.z),
    ]);
    let cinum = 30;
    let i = 0;
    let vector = curve.getPoints(30);
    var geometry = new THREE.Geometry();
    for (let i = 0; i < cinum; i++) {
        geometry.vertices.push(new THREE.Vector3(...src));
    }
    //线条
    var line = new MeshLine();
    line.setGeometry( geometry );
    var material = new MeshLineMaterial(linkMesh);
    var mesh = new THREE.Mesh(line.geometry,material);
    scene.add(mesh)
    //
    var Icon = lineIcon('../imgs/4.png',[vector[i].x,vector[i].y,vector[i].z]);
    Icon.name='线头';
    scene.add(Icon);

    let n = 0;
    var interval = (n) => {
        if (n >= cinum) {
            deleteMesh(Icon)
            let timeNumber = 1500; 
            let t = setInterval(() => {
                n--;
                if (n < 0) {
                    deleteMesh(mesh)
                    clearInterval(t)
                } else {
                    line.advance(vector[cinum - 1])
                }
            }, timeNumber)
            return
        } else {
            n++
            setTimeout(() => {
                line.advance(vector[parseInt(n)])
                Icon.position.set(vector[parseInt(n)].x, vector[parseInt(n)].y, vector[parseInt(n)].z)
                interval(n)
            }, 1500 / cinum);
        }
    }
    interval(n)
}
function deleteMesh(mesh, state) {
    mesh.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); //删除几何体
            if (item.material) {
                item.material.dispose(); //删除材质
            }
        }
    });
    scene.remove(mesh)
}
function lineIcon(src, position) {
    let loader = new THREE.TextureLoader();
    var routerName = loader.load(src);
    let sprMat = new THREE.SpriteMaterial({ map: routerName });
    let spriteText = new THREE.Sprite(sprMat);
    spriteText.scale.set(20, 20, 1);
    spriteText.position.set(position[0], position[1], position[2]);
    spriteText.params_type = "step";
    return spriteText
}

  
function animate(){
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}