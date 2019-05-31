/* 设置画布的高宽 */
let canvasId = "mainCanvas"
let canvas = document.getElementById("mainCanvas")
let [width, height] = [window.innerWidth, window.innerHeight];
var scene = new THREE.Scene();
var camera = null;
var renderer = null;
var fov = 45
var id = null;
var footPlane = null;
var controls;
var nameGroup = new THREE.Group();
var meshGroup = new THREE.Group();
var twwenF;
var scale = 0.1;//obj放大倍数
var yHeight = 0.2;
let stats;
var mouse;
var raycaster;
var Objlength = 0;
let timeAdd = 3200;


function initCamea() {
    //远交相机
    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
    camera.position.set(195, 200, 130);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onWindowResize()
}
function initControls() {
    console.log(camera)
    console.log(renderer.domElement)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  //   controls.enableDamping = true;
  //   //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  //   controls.dampingFactor = 1;
  //   //是否可以缩放
  //   controls.enableZoom = true;
  //   //是否自动旋转 controls.autoRotate = true; 设置相机距离原点的最远距离
  //   controls.minDistance = 20;
  //   //设置相机距离原点的最远距离
  //   controls.maxDistance = 900;
  //   //是否开启右键拖拽
  //   controls.enablePan = true;
}
function initCube(){
    var geometry = new THREE.BoxGeometry( 21, 21, 21 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}
function initFoot() {
    // 添加地板背景
    let foot = THREE.ImageUtils.loadTexture('../imgs/FOOT.png', {}, function () {
        // renderer.render(scene, camera);
    });
    foot.wrapS = foot.wrapT = THREE.RepeatWrapping;
    foot.repeat.set(width / 40, height / 40);
    var footPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshLambertMaterial({
            map: foot,
            side: THREE.DoubleSide,
        })
    );
    footPlane.rotation.x = -Math.PI / 2;
    footPlane.name = '地板';
    scene.add(footPlane);
}

function attackCube(p){
    // if(meshGroup.children.length > 10){
    //     meshGroup.remove(meshGroup.children[0]);
    // }
    var loader = new THREE.TextureLoader();
    var meshAttack;
    var loadedGeometry;
    loader.load('../imgs/5.png',texture => {
        loadedGeometry = texture.clone();
        let width = 50;
        meshAttack = new THREE.Mesh(
            new THREE.PlaneGeometry(width,width),
            new THREE.MeshLambertMaterial({
                map: texture,
                transparent:true
            })
        )
        meshAttack.position.set(p.x,p.y,p.z);
        meshAttack.rotation.x = -Math.PI/2;
         // console.log(meshAttack)
         var posSrc = {pos:1};
         var tween = new TWEEN.Tween(posSrc).to({pos:0},5000);
         tween.easing(TWEEN.Easing.Sinusoidal.InOut);
         var tweenBack = new TWEEN.Tween(posSrc).to({pos:1},5000);
         tweenBack.easing(TWEEN.Easing.Sinusoidal.InOut);
         tween.chain(tweenBack)
         tweenBack.chain(tween)
        scene.add(meshAttack)
        var onUpdate = function (){
            var count = 0;
            var pos = this.pos;
            loadedGeometry.vertices.forEach(e => {
                console.log(e)
                var newY = (e.y+3.22544)*pos - 3.22544;
                meshAttack.geometry.vertices[count++].set(e.x,newY,e.z);
            })
            meshAttack.sortParticles = true;
        }
        tween.onUpdate(onUpdate)
        tweenBack.onUpdate(onUpdate)
         // console.log(loadedGeometry)
    })
}

function initObj(){
    var loader = new THREE.OBJLoader();
    loader.load('../js/obj/mianshi1.obj',object => {
        object.scale.set(scale,scale,scale);//设置模型的放大倍数
        // object.children[0].geometry.computeBoundingBox();
        // object.children[0].geometry.center()
        // helper = new THREE.BoundingBoxHelper(object, 0xff0000);
        // helper.update();
        // scene.add(helper);
        object.children.forEach((child,id) =>{
            if(child.name=='马路-0-3'){
                child.material = new THREE.MeshLambertMaterial({color:'#383c4a'});
            }else if(child.name=='次要建筑-023-2'){
                
                child.material = new THREE.MeshLambertMaterial({color:'#264273'});
            }else if(child.name=='河-0-4'){
                child.position.set(0,10,0);
                child.visible = true;
                child.material = new THREE.MeshBasicMaterial({color:'#3775ff'});
            }else{
                child.material = new THREE.MeshLambertMaterial({color:'#3c9dff'});
                // var earthGeometry = new THREE.SphereBufferGeometry( 1, 16, 16 );
                var earthDiv = document.createElement( 'div' );
				earthDiv.className = 'label';
				earthDiv.textContent = 'Earth';
				earthDiv.style.marginTop = '-5em';
				var earthLabel = new THREE.CSS2DObject( earthDiv );
				// earthLabel.position.set( 0, EARTH_RADIUS, 0 );
                // earth.add( earthLabel );
                child.geometry.computeBoundingBox()
                let bbox = child.geometry.boundingBox;
                var mdlen=bbox.max.x-bbox.min.x;
                var mdwid=bbox.max.z-bbox.min.z;
                var mdhei=bbox.max.y-bbox.min.y;
                var centerpoint=new THREE.Vector3();
                var x=bbox.min.x+mdlen/2;
                var y=bbox.min.y+mdhei/2;
                var z=bbox.min.z+mdwid/2;
                earthLabel.positionRecord = {x,y,z};
                earthLabel.position.set(x,y*2.8,z);
                child.add(earthLabel);
                console.log(child)
                // let loader = new THREE.FontLoader();
                // loader.load('../js/FZLanTingHeiS-UL-GB_Regular.json',font=> {
                //     let textFont = new THREE.TextGeometry(`${child.name.split('-')[0]}`, {
                //         font: font,
                //         size: 25,
                //         height:4,
                //         weight:'bold',
                //         curveSegments: 10,
                //         steps:1,
                //         bevelEnabled:false,
                //         bevelSegments:9,
                //         bevelSize:1
                //     })
                //     textFont.center();
                //     let materials = [
                //         new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
                //         new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
                //     ];
                //     let mesh1 = new THREE.Mesh(textFont, materials);
                //     child.geometry.computeBoundingBox()
                //     let bbox = child.geometry.boundingBox;
                //     var mdlen=bbox.max.x-bbox.min.x;
                //     var mdwid=bbox.max.z-bbox.min.z;
                //     var mdhei=bbox.max.y-bbox.min.y;
                //     var centerpoint=new THREE.Vector3();
                //     var x=bbox.min.x+mdlen/2;
                //     var y=bbox.min.y+mdhei/2;
                //     var z=bbox.min.z+mdwid/2;
                //     child.positionRecord = {x,y,z};
                //     mesh1.position.set(x,y*2.8,z);
                //     nameGroup.add(mesh1);
                // });
            }
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        })
        
        object.position.set(0,0.1,0);
        object.add(nameGroup);
        scene.add(object);
        var labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = 0;
        document.body.appendChild( labelRenderer.domElement );
    })
}
function initClick() {
    //点击
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    function onDocumentMouseDown(event) {
        event.preventDefault();
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
        if (event.button == 2) {
            console.log('鼠标右键')
        } else {
            raycaster.setFromCamera(mouse,camera)
            let intersects = raycaster.intersectObjects(scene.children[4].children);
            if(intersects.length>0){
                intersects.forEach(x =>{
                    if(x.object.name !='次要建筑-023-2' && x.object.name!='马路-0-3'){
                        x.object.material.color.set( 'green' );
                    }
                })
            }
        }
    }
}
let status=true;
function draw() {
    // nameGroup.rotation.y-=0.005;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
class twwenFunc {
    animate() {
        this.animate = this.animate.bind(this)
        requestAnimationFrame(this.animate)
        TWEEN.update()
    }
    async activeLinks(p1, p2) {
        function addCY(o) {
            var geometry = new THREE.SphereGeometry(0.5, 0.5, 0.5);
            var material = new THREE.MeshBasicMaterial({
                color: 0x91ffaa
            });
            var sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            sphere.position.y = o.y
            sphere.position.x = o.x
            sphere.position.z = o.z
            setTimeout(x => {
                // scene.remove(sphere);
            }, 3000)
        }
        const tween = new TWEEN.Tween(p1).to(p2, timeAdd).easing(TWEEN.Easing.Linear.None).start();
       
        tween.onUpdate((data) => {
            addCY(p1)
        })
        this.animate()
    }
    activeAttack(p1,p2){
        function attackCube(p){
            // if(meshGroup.children.length > 10){
            //     meshGroup.remove(meshGroup.children[0]);
            // }
            var loader = new THREE.TextureLoader();
            loader.load('../imgs/5.png',texture => {
                let width = 50;
                let mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width,width),
                    new THREE.MeshLambertMaterial({
                        map: texture,
                        transparent:true
                    })
                )
                mesh.position.set(p.x,0.2,p.z);
                mesh.rotation.x = -Math.PI/2;
                meshGroup.add(mesh)
                scene.add(meshGroup)
            })
        }
        const tween = new TWEEN.Tween(p1).to(p2, 500).easing(TWEEN.Easing.Linear.None).start();
       
        tween.onUpdate((data) => {
            attackCube(p1)
        })
        TWEEN.update()
    }
}
twwenF = new twwenFunc()

function load() {
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas'),
        antialias: true,//抗锯齿             
        autoClear: true
    });
    renderer.setClearColor(0x000000, 1.0);
    initCamea();//相机
    
    initLight()//灯光
    // initCube();
    lineMaterial();
    initControls()
    initFoot()//添加背景
    initObj();
    addPlan();
    // initGrid()
    //点击事件
    initClick()
    // initDragControls()
    draw()
}
// 线材质参数
function lineMaterial(){
    var Params = function() {
        // 数量
        this.amount = 100;
        // 线条宽度为10
        this.lineWidth = 10;
        // 设置虚线的空隙大小,设置为零时,线段会连成一条线
        this.dashArray = 0;
        // 定义虚线开始的位置
        this.dashOffset = 0; 
        // 虚线的空隙比例
        this.dashRatio = 0.9;
        // 设置为抛物线,none , linear, wavy
        this.taper = 'none';
        // 是否有透视效果（false - 透视，true - 不透视）
        this.sizeAttenuation = false;
    };
    params = new Params();
    // 颜色数组,随机颜色使用
    
    // 线段生产,geometry
}
var params;

var options={
    meshLine:[]
}
function addLineBlack(arr, reference='', func='') {
    // let colorIndex = reference.split("-")[1];
    // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
    let mesh_line =new MeshLineMaterial({
        ...linkMesh,
        color: new THREE.Color("#91FFAA")
    })
    // switch (colorIndex) {
    //     case "1":
    //         mesh_line = this.Material.linne_mesh_1
    //         break
    //     case "2":
    //         mesh_line = this.Material.linne_mesh_2
    //         break
    //     case "3":
    //         mesh_line = this.Material.linne_mesh_3
    //         break
    //     default:
    //         mesh_line = this.Material.linne_mesh_4
    // }
    var line = new MeshLine();
    var geometry = new THREE.Geometry();
    let lineNum = arr.length * 200;
    for (let i = 0; i < lineNum; i++) {
        geometry.vertices.push(new THREE.Vector3(arr[0].x, arr[0].y, arr[0].z));
    }
    line.setGeometry(geometry);
    var mesh = new THREE.Mesh(line.geometry, mesh_line);
    mesh.frustumCulled = false;
    mesh.params_type = "step";
    console.log(mesh)
    scene.add(mesh)
    options.meshLine.push(mesh)
    // let stepTurt = this.addLineShowStep(reference, [arr[0].x, arr[0].y, arr[0].z])
    let addLine = (arr) => {
        if (arr.length == 1) {
            setTimeout(() => {
                // this.deleteMeshLine();
                typeof func == 'function' ? func() : null;
            }, 1000)
            return
        }
        let obj = arr.shift();
        let src = {
            x: parseInt(obj.x),
            y: parseInt(obj.y),
            z: parseInt(obj.z) + 1
        }
        let dst = {
            x: parseInt(arr[0].x),
            y: parseInt(arr[0].y),
            z: parseInt(arr[0].z) + 1
        }
        animated(src, dst, 300, () => {
            line.advance(new THREE.Vector3(src.x, src.y, src.z))
            // stepTurt.position.set(src.x, src.y, src.z)
        }, () => {
            addLine(arr)
        })

    }
    addLine(arr)
}


function addPlan(){
    var loader = new THREE.TextureLoader();
    loader.load('../imgs/5.png',texture => {
        meshAttack = new THREE.Mesh(
            new THREE.PlaneGeometry(50,50),
            new THREE.MeshLambertMaterial({
                map: texture,
                transparent:true
            })
        )
        meshAttack.rotation.x = -Math.PI / 2;
    })
}
function addLine(src, dst, type, end, index) {
    var Material = {
        line: new THREE.LineBasicMaterial({
            color: 0x254968,
            linewidth: 1,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        }),
        linne_mesh_1: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#91FFAA"),
            /*   dashArray,
              // increment him to animate the dash
              dashOffset,
              // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
              dashRatio: getRandomFloat(0.1, 0.4),
              // side: DoubleSide,
              transparent: true,
              depthWrite: false, */
        }),
        linne_mesh_2: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#fea053"),
            /*   dashArray,
              // increment him to animate the dash
              dashOffset,
              // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
              dashRatio,
              // side: DoubleSide,
              transparent: true,
              depthWrite: false, */
        }),
        linne_mesh_3: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#ff3d6c"),
        }),
        linne_mesh_4: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#e17cff"),
        }),
        linne_mesh_5: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#A0F0FF"),
        }),
        linne_mesh_6: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#009DFF"),
        }),
        linne_mesh_7: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#FFD030"),
        }),
        linne_mesh_8: new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#FF7410"),
        })
        , 
        // linne_mesh_9: new MeshLineMaterial({
        //     ...linkMesh,
        //     color: new THREE.Color("#FF0053"),
        //     dashArray,
        //     // increment him to animate the dash
        //     dashOffset,
        //     // 0.5 -> balancing ; 0.1 -> more line : 0.9 -> more void
        //     dashRatio: getRandomFloat(0.1, 0.4),
        //     // side: DoubleSide,
        //     transparent: true,
        //     depthWrite: false,
        //      lineWidth:12
        // }),
    }
    if (!src || !dst) {
        return
    }
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

    //线条颜色
    // let colorIndex = reference.split("-")[1];
    // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
    let mesh_line
    switch (type) {
        case "1":
            mesh_line = Material.linne_mesh_5
            break
        case "2":
            mesh_line = Material.linne_mesh_6
            break
        case "3":
            mesh_line = Material.linne_mesh_7
            break
        case "4":
            mesh_line = Material.linne_mesh_8
        default:
            mesh_line = Material.linne_mesh_9

    }

    let _center = [
        (_src.x + _dst.x) / 2,
        (_src.y + _dst.y) / 2,
        (_src.z + _dst.z) / 2
    ]

    let cinum = 30;
    let _yheight = index % 30 * 10;
    var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(_src.x, _src.y, _src.z),
        new THREE.Vector3(_center[0], 200 + _yheight, _center[2]),
        new THREE.Vector3(_dst.x, _dst.y, _dst.z),
    ]);
    let vector = curve.getPoints(cinum);
    console.log(vector)
    var geometry = new THREE.Geometry();
    for (let i = 0; i < cinum; i++) {
        geometry.vertices.push(new THREE.Vector3(...src));
    }
    var line = new MeshLine();
    if(type==5){
        line.setGeometry(geometry);
    }else{
        line.setGeometry(geometry, function (p) { return p });
    }
    
    /*    if (Math.random() > 0.75) {
       } else if (Math.random() > 0.55) {
           line.setGeometry(geometry, function (p) { return 1 - p }); // makes width sinusoidal
       } else if (Math.random() > 0.3) {
           line.setGeometry(geometry, function (p) { return 2 + Math.cos(40 * p); }); // makes width sinusoidal
       } else {
           line.setGeometry(geometry)
       }
*/
    var mesh = new THREE.Mesh(line.geometry, mesh_line);
    mesh.frustumCulled = false;
    mesh.params_type = "step"
    this.scene.add(mesh);

    let n = 0;

    //线条动画
    var interval = (n) => {
        if (n >= cinum) {
            // this.buildingAnimation(dst, 50)
            let timeNumber = type == 5 ? 1500 / cinum:10
            let t = setInterval(() => {
                n--;
                if (n < 0) {
                    typeof end == "function" ? end() : ""
                    deleteMesh()
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
    var deleteMesh = () => {
        // this.dispose(mesh)
        vector = null;
        cinum = null;
        curve = null;
        geometry = null;
        line = null;
        _center = null;
        mesh_line = null;
        mesh = null;
        n = null;
    }
}
var linkMesh = {
    color: new THREE.Color("#91FFAA"),
    opacity: 1,
    sizeAttenuation: 1,
    lineWidth: 10,
    near: 10,
    far: 100000,

}
function addMeshLine(src, dst){
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
    let vector = curve.getPoints(30);
    var geometry = new THREE.Geometry();
    for( var j = 0; j < vector.length - 1; j++ ) {
        geometry.vertices.push( vector[ j ].clone() );
    }
    makeLine(geometry)
    function makeLine( geometry,end ='',type=4) {
        var g = new MeshLine();
        switch( params.taper ) {
            // 设置线段宽度,setGeometry第一个参数是三维点的集合,第二个参数是每两个点之间的线段宽度变化函数
            // 没有
            case 'none': g.setGeometry( geometry ); break;
            // 线性
            case 'linear': g.setGeometry( geometry, function( p ) { return 1 - p; } ); break;
            // 抛物线
            case 'parabolic': g.setGeometry( geometry, function( p ) { return 1 * Math.pow( 4 * p * ( 1 - p ), 1 )} ); break;
            // 波浪
            case 'wavy': g.setGeometry( geometry, function( p ) { return 2 + Math.sin( 50 * p ) } ); break;
        }
        // 设置线段材质
        var material = new MeshLineMaterial( {
            // 随机颜色
            // color: new THREE.Color( colors[ Math.floor(Math.random()*colors.length) ] ),
            color: new THREE.Color('#91ffaa'),
            // 透明度
            opacity: 1,
            // 虚线的线段之前空隙,为零则为实线
            dashArray: params.dashArray,
            // 虚线开始的位置
            dashOffset: params.dashOffset,
            // 虚线 的线段与空隙比例
            dashRatio: params.dashRatio,
            // 二维向量指定画布大小,必需
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
            // 线宽是否衰减(是否有透视效果)
            sizeAttenuation: params.sizeAttenuation,
            // 线宽
            lineWidth: params.lineWidth,
            // 摄像机近剪裁平面距离,跟随相机(sizeAttenuation为false时必须设置)
            near: camera.near,
            // 相机远剪裁平面距离,跟随相机(sizeAttenuation为false时必须设置)
            far: camera.far,
            // transparent: true
        });
        var mesh = new THREE.Mesh( g.geometry, material );
        scene.add( mesh );
        let n = 0;
            //线条动画
        var interval = (n) => {                 
            if (n >= cinum) {
                // attackAnimation(dst)
                let timeNumber = type == 5 ? 1500 / cinum:10
                let t = setInterval(() => {
                    n--;
                    if (n < 0) {
                        typeof end == "function" ? end() : ""
                        delAction()
                        clearInterval(t)
                    } else {
                        g.advance(vector[cinum - 1])
                    }
                }, timeNumber)
                return
            } else {
                n++;
                setTimeout(() => {
                    g.advance(vector[parseInt(n)])
                    interval(n)
                },20);
            }
        }
        interval(n)
        var delAction = () => {
            deleteMesh(mesh)
            vector = null;
            cinum = null;
            curve = null;
            geometry = null;
            g = null;
            _center = null;
            mesh_line = null;
            mesh = null;
            n = null;
        }
    
    }
}
var meshAttack;

//被攻击特效
function attackAnimation(position) {
    position[1] = 1;
    let height = position[1].toString() * 2 + 40
    let number = 1;
    var initNode = (arr) => {
        if (number == 0) {
            // animation(basePlane)
            return
        }
        console.log(meshAttack)
        let plane = meshAttack.clone()
        plane.position.set(...position)
        scene.add(plane)
        animation(plane)
        setTimeout(() => {
            number--;
            initNode()
        }, 600)
    }
    initNode()
    let _this = this
    function animation(node) {
        let num = 0;
        let scale_num = 0;
        let scale_time = setInterval(() => {
            let _n = 1 - scale_num * 0.02
            if (scale_num > 1) {
                clearInterval(scale_time)
                _TIME()
            }
            node.scale.x = _n
            node.scale.y = _n
            node.scale.z = _n
            scale_num++
        }, 100)
        const _TIME = () => {
            let time = setInterval(() => {
                let _NUM = 1 - num / height
                node.position.y = num;
                node.material.opacity = _NUM;
                num += 5
                if (num >= height) {
                    clearInterval(time)
                    setTimeout(() => {
                        deleteMesh(node)
                    }, 100)
                }
            }, 20)
        }

    }
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
function animated(source, target, time, func, endFunc) {
    /**
     * @source 起始数据
     * @target 结束数据
     * @time 持续时间
     * @fun 持续中的事件
     * @endFunc 完成触发的事件
     */
    var test = new TWEEN.Tween(source).to(target,5000);
    // createjs.Tween.get(source).to(target, time)
    //     .call(handleChange)
    var Time = setInterval(() => {
        typeof func == 'function' ? func() : null;
    })

    function handleChange(event) {
        //完成 
        clearInterval(Time);
        typeof endFunc == 'function' ? endFunc() : null;
    }
}
function addLineShowStep(img_code, position) {
    //连线展示开始图标
    let canvas = document.createElement('canvas');
    let RECT_SIZE = 128; //大小
    canvas.width = RECT_SIZE;
    canvas.height = RECT_SIZE;
    let context = canvas.getContext("2d");
    context.drawImage(this.startImgs[img_code], 0, 0, RECT_SIZE, RECT_SIZE);

    let routerName = new THREE.Texture(canvas);
    routerName.needsUpdate = true;
    let sprMat = new THREE.SpriteMaterial({ map: routerName });
    let spriteText = new THREE.Sprite(sprMat);
    let sprScale = 80;
    spriteText.scale.set(sprScale, sprScale, 1);
    spriteText.position.set(position[0], position[1], position[2]);
    spriteText.params_type = "step"
    this.scene.add(spriteText);
    this.options.meshLine.push(spriteText)
    return spriteText
}

function selfAddLine(src,dst){
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
    geometry.vertices.push(new THREE.Vector3(vector[i].x,vector[i].y,vector[i].z));
    var line = new MeshLine();
    line.setGeometry( geometry );
    var material = new MeshLineMaterial(linkMesh);
    var mesh = new THREE.Mesh(line.geometry,material);
    mesh.name='飞线';
    var Icon = lineIcon();
    Icon.position.set(vector[i].x,vector[i].y,vector[i].z);
    Icon.name='线头';
    scene.add(Icon);
    scene.add(mesh);
    let addLine = setInterval(() => {
        i++;
        if(i>vector.length-2){
            clearInterval(addLine)
        }
        geometry.vertices.push(new THREE.Vector3(vector[i].x,vector[i].y,vector[i].z))
        var lines = new MeshLine();
        lines.setGeometry( geometry );
        material = new MeshLineMaterial(linkMesh);
        var linesMesh = new THREE.Mesh(lines.geometry,material);
        var animateIcomn = scene.children[5];
        animateIcomn.position.set(vector[i].x,vector[i].y,vector[i].z)
        scene.add(linesMesh)
        scene.remove(scene.children[6])
    },30)

}
function lineIcon(){
    var loader = new THREE.TextureLoader();
    var texture = loader.load('../imgs/4.png');
    var lineIcon = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        new THREE.MeshLambertMaterial({
            map: texture,
            transparent:true
        })
    )
    return lineIcon;
}


setTimeout(() => {

    let data = scene.children[4].children;
    let p1 = new THREE.Vector3(data[4].positionRecord.x*scale,data[4].positionRecord.y*scale,data[4].positionRecord.z*scale);
    let p2 = new THREE.Vector3(data[13].positionRecord.x*scale,data[13].positionRecord.y*scale,data[13].positionRecord.z*scale);
    // twwenF.activeLinks(p1,p2)
    setTimeout(()=>{
        // animated(p1, p2, 300, () => {
        //     var line = new MeshLine();
        //     line.advance(new THREE.Vector3(src.x, src.y, src.z))
        //     // stepTurt.position.set(src.x, src.y, src.z)
        // }, () => {
        //     // addLine(arr)
        // })
        let src = [p1['x'],p1['y'],p1['z']];
        let dst = [p2['x'],p2['y'],p2['z']];
        selfAddLine(src,dst)
        // addMeshLine(src,dst);
        // let arr = [src,dst];
        // setInterval(() => {
        //     // attackAnimation(dst,100)
        //     addMeshLine(src,dst);
        // },50)
    },3000)
},3000)








function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); 
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);


function initGrid() {
  var helper = new THREE.GridHelper(width, 40);
  helper.setColors('transparent', 'transparent');
  scene.add(helper);
}

function initLight() {
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(300, 300, 300);
    scene.add(light);
    var light1 = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light1);
}





function initBox({
  x,
  y,
  z
}) {
  var rightCube = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10), new THREE.MeshLambertMaterial({
    color: 0xffff00
  }));
  rightCube.position.x = x;
  rightCube.position.y = y;
  rightCube.position.z = z;
  rightCube.params = {
    id: 12
  }
  scene.add(rightCube);
}
//鼠标

//帧数
function initStats() {
  var stats = new Stats()
  stats.setMode(0)
  document.getElementById("stats").appendChild(stats.domElement)
  return stats

}
//拖拽
function initDragControls() {
  var transformControls = new THREE.TransformControls(camera, renderer.domElement);

  scene.add(transformControls);
  // 过滤不是 Mesh 的物体,例如辅助网格对象
  var objects = [];
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i].isMesh) {
      objects.push(scene.children[i]);
    }
  }
  console.log(objects)  // 初始化拖拽控件
  var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);

  // 鼠标略过事件
  dragControls.addEventListener('hoveron', function (event) {
    // 让变换控件对象和选中的对象绑定
    transformControls.attach(event.object);
  });

  // 开始拖拽
  dragControls.addEventListener('dragstart', function (event) {
    controls.enabled = false;
  });
  // 拖拽结束
  dragControls.addEventListener('dragend', function (event) {
    controls.enabled = true;
  });

}





function inigSign(params) {
    let {
        x,
        y,
        z,
        name
    } = params
    let height = 15
    var materials = new THREE.MeshLambertMaterial({
        color: 0xffcf43,
        lightMapIntensity:1
    });
    var loader = new THREE.FontLoader();
    //读取字体JSON文件 创建字体
    loader.load('./lib/helvetiker_regular.typeface.json', function (font) {
        let textFont = new THREE.TextGeometry(name, {
        font: font,
        size:6,
        height:1,
        })
        textFont.center()
        var mesh1 = new THREE.Mesh(textFont, materials);
        mesh1.position.x = x;
        mesh1.position.y = y + height;
        mesh1.position.z = z;
        scene.add(mesh1);

    });

    //显示名字
    var geometry = new THREE.PlaneGeometry(65, 12, 0);
    var material = new THREE.MeshBasicMaterial({
        color: 0x675121,
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.position.x = x;
    plane.position.y = y + height;
    plane.position.z = z;
    scene.add(plane);
}

function addLink({
  x,
  y
}) {
  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({
    vertexColors: true,
    linewidth: 12
  });
  var color1 = new THREE.Color(0x42aaff),
    color2 = new THREE.Color(0x42aaff);
  // 线的材质可以由2点的颜色决定 线的材质可以由2点的颜色决定
  var p1 = new THREE.Vector3(x.x, x.y, x.z);
  var p2 = new THREE.Vector3(y.x, y.y, y.z);
  geometry.vertices.push(p1);
  geometry.vertices.push(p2);
  geometry.colors.push(color1, color2);
  var line = new THREE.Line(geometry, material);
  line.params = {
    target: x.id,
    source: y.id,
    type: "link"
  }
  scene.add(line);
}

function addLink1({
  x,
  y
}) {
  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({
    vertexColors: true,
    linewidth: 12
  });
  var color1 = new THREE.Color(0xff0000),
    color2 = new THREE.Color(0xff0000);
  // 线的材质可以由2点的颜色决定 线的材质可以由2点的颜色决定
  var p1 = new THREE.Vector3(x.x, x.y, x.z);
  var p2 = new THREE.Vector3(y.x, y.y, y.z);
  geometry.vertices.push(p1);
  geometry.vertices.push(p2);
  geometry.colors.push(color1, color2);
  var line = new THREE.Line(geometry, material);
  scene.add(line);
  return line
}

function initObjs(params) {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(params.mtl, function (materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(params.obj, function (object) {
      object.position.y = params.y
      object.position.x = params.x
      object.position.z = params.z
      object.params = {
        id: params.id,
        type: "node",
        ip: params.ip,
      }
      scene.add(object)
      Objlength++
      if (Objlength === list.length) {
        //加载完毕  
        nexus.links.forEach(x => {
          let target = list.filter(node => node.id == x.target)[0]
          let source = list.filter(node => node.id == x.source)[0]
          addLink({
            x: target,
            y: source,
          })
        })
        /*  attackEvent({
           src: "10.101.12.64",
           dst: "10.101.80.12"
         }) 
        /*  activeNode("10.101.12.64", true)
         activeNode("10.101.80.12", false) */

      }
    });
  });

}

//测试动画
// function tLink(arr) {
//   let childns = scene.children.filter(x => x.params).filter(x => x.params.type == "link")
//   let links = arr.map(y => {
//     let acline = childns.filter(x => {
//       let params = x.params
//       if (params.target == y.target && params.source == y.source) {
//         if (y.sorts == true) {
//           params.sorts = true
//         }
//       }

//       return params.target == y.target && params.source == y.source
//     })[0]
//     return acline
//   })

//   function acl(arr) {
//     if (arr.length == 0) {
//       return
//     }
//     let l = arr.splice(0, 1)
//     let src = l[0].geometry.vertices[0]
//     let dst = l[0].geometry.vertices[1]
//     if (l[0].params.sorts) {
//       twwenF.activeLinks(dst, src)
//     } else {
//       twwenF.activeLinks(src, dst)
//     }
//     setTimeout(x => {
//       acl(arr)
//     }, timeAdd)
//   }
//   acl(links)
// }


function ipGetNode(ip) {
  //根据IP找到ID
  let node = scene.children.filter(x => x.params).filter(x => x.params.type == "node" && x.params.ip == ip)[0]
  return node.params.id
}

function getNodeTop(id, arr) {
  //找到节点上级一直到路由器 
  let srcNode = 126
  let links = nexus.links;
  let link = links.filter(x => x.target == id)[0]

  if (!link) {
    return
  }
  if (link.source == srcNode) {
    arr.push(link)
    return "终结"
  } else {
    arr.push(link)
    getNodeTop(link.source, arr)
  }
}

function activeShowLink(link) {
  let nums = 0
  let time = setInterval(x => {
    nums += 1
    link.geometry.colorsNeedUpdate = true
    if (nums % 2 == 0) {
      link.geometry.colors[0] = new THREE.Color(0x42aaff)
      link.geometry.colors[1] = new THREE.Color(0x42aaff)
    } else {
      link.geometry.colors[0] = new THREE.Color(0xff0000)
      link.geometry.colors[1] = new THREE.Color(0xff0000)
    }
    if (nums == 20) {
      clearInterval(time)
    }
  }, 300)
}

function activeLink(arr) {
  let childns = scene.children.filter(x => x.params).filter(x => x.params.type == "link")

  arr.forEach(y => {
    let acline = childns.filter(x => {
      let params = x.params
      return params.target == y.target && params.source == y.source
    })[0]
    activeShowLink(acline)
  })

}

function attackEvent({
  dst,
  src
}) {
  //找到src和dst节点
  let childns = scene.children.filter(x => x.params).filter(x => x.params.type == "node")
  let srcNode = childns.filter(x => src === x.params.ip)[0]
  let dstNode = childns.filter(x => dst === x.params.ip)[0]
  let arrSrc = []
  let arrTar = []
  getNodeTop(srcNode.params.id, arrSrc)
  getNodeTop(dstNode.params.id, arrTar)
  let arr = [...arrTar, ...arrSrc]
  var a1 = []
  arrSrc.forEach(x => {
    arrTar.forEach(y => {
      if (x.target == y.target && x.source == y.source) {
        a1.push(y)
      }
    })
  })
  arr = arr.filter(x => {
    return a1.filter(y => x.target == y.target && x.source == y.source).length == 0
  })
  activeLink(arr)
  return arr
}

function activeNode(ip, bl) {
  let node = scene.children.filter(x => x.params).filter(x => x.params.type == "node" && x.params.ip == ip)[0]
  var geometry = new THREE.BoxGeometry(12, 12, 12);
  var material = new THREE.MeshBasicMaterial({
    color: bl ? 0xff0000 : 0x00ff00,
    wireframe: true,
    wireframeLinecap: "butt",
    skinning: true,
    // alphaMap:0.1
  });
  var cube = new THREE.Mesh(geometry, material);
  let position = node.position;
  cube.position.x = position.x;
  cube.position.y = position.y + 1;
  cube.position.z = position.z;

  let time = setInterval(x => {
    // cube.rotation.x += 0.5
    // cube.rotation.z += 0.5
    cube.rotation.y += 0.5
  }, 100)
  scene.add(cube);
  setTimeout(x => {
    clearInterval(time)
    scene.remove(cube)
  }, 5000)

}

