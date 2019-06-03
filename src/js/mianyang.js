/* 设置画布的高宽 */

var camera, renderer , labelRenderer, controls, mouse, raycaster, meshAttack, footPlane;
let [width, height] = [window.innerWidth, window.innerHeight];
var scene = new THREE.Scene();
var fov = 45
var nameGroup = new THREE.Group();
var lineGroup = new THREE.Group();
var scale = 0.1;//obj放大倍数
var linkMesh = {
    color: new THREE.Color("#91FFAA"),
    opacity: 1,
    sizeAttenuation: 1,
    lineWidth: 10,
    near: 10,
    far: 100000,

}
function load() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 400, 160);
    controls = new THREE.OrbitControls( camera );
    renderer = new THREE.WebGLRenderer({
        antialias: true,//抗锯齿             
        autoClear: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // var material = new THREE.SpriteMaterial();
    // var sprite = new THREE.Sprite(material);
    // sprite.position.set(0,50,0);
    // var sprite = makeTextSprite('测试')
    // scene.add(sprite)
    initCamea();//相机
    initControls()
    initLight()//灯光
    initFoot()//添加背景
    initObj();
    addPlan();
    initClick()
    draw()
}
function makeTextSprite(message, parameters) {

    if ( parameters === undefined ) parameters = {};

    let fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

    /* 字体大小 */
    let fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 50;

    /* 边框厚度 */
    let borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 4;

    /* 边框颜色 */
    let borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

    /* 背景颜色 */
    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    /* 创建画布 */
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    /* 字体加粗 */
    context.font = "Bold " + fontsize + "px " + fontface;

    /* 获取文字的大小数据，高度取决于文字的大小 */
    let metrics = context.measureText( message );
    let textWidth = metrics.width;

    /* 背景颜色 */
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
        + backgroundColor.b + "," + backgroundColor.a + ")";


    /* 字体颜色 */
    context.fillStyle = "#fff";
    context.fillText( message, borderThickness, fontsize);

    /* 画布内容用于纹理贴图 */
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    let spriteMaterial = new THREE.SpriteMaterial({ map: texture } );
    let sprite = new THREE.Sprite( spriteMaterial );

    console.log(sprite.spriteMaterial);

    /* 缩放比例 */
    sprite.scale.set(256,128,0);

    return sprite;

}

function initCamea() {
    //远交相机
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onWindowResize()
}
function initControls() {
    controls = new THREE.OrbitControls(camera);
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

//导入3d模型
function initObj(){
    var loader = new THREE.OBJLoader();
    loader.load('../js/obj/mianshi1.obj',object => {
        object.scale.set(scale,scale,scale);//设置模型的放大倍数
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

                child.geometry.computeBoundingBox()
                let bbox = child.geometry.boundingBox;
                var mdlen=bbox.max.x-bbox.min.x;
                var mdwid=bbox.max.z-bbox.min.z;
                var mdhei=bbox.max.y-bbox.min.y;
                var centerpoint=new THREE.Vector3();
                var x=bbox.min.x+mdlen/2;
                var y=bbox.min.y+mdhei/2;
                var z=bbox.min.z+mdwid/2;
                child.positionRecord = {x,y,z};
                if(!child.name.includes('未知') && !child.name.includes('其他')&& !child.name.includes('食堂')&& !child.name.includes('楼梯')&& !child.name.includes('校门')){
                    let sprite = makeTextSprite(`${child.name.split('-')[0]}`);
                    sprite.position.set( x,y*2+20,z);
                    child.add(sprite)
                }
                
            }
          
        })
        
        object.position.set(0,0.1,0);
        object.add(nameGroup);
        scene.add(object);

        labelRenderer = new THREE.CSS2DRenderer();
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

function draw() {
    requestAnimationFrame( draw );
    scene.rotation.y += 0.002;
    controls.update();
    renderer.render( scene, camera );
    if(labelRenderer){
        labelRenderer.render( scene, camera );
    }  
}

//黄色方框
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


//被攻击特效
function attackAnimation(position) {
    position[1] = 1;
    let height = position[1].toString() * 2 + 100
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
        }, 40)
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
function lineIcon(src, position) {
    let loader = new THREE.TextureLoader();
    var routerName = loader.load('../imgs/4.png');
    let sprMat = new THREE.SpriteMaterial({ map: routerName });
    let spriteText = new THREE.Sprite(sprMat);
    spriteText.scale.set(15, 15, 1);
    spriteText.position.set(position[0], position[1], position[2]);
    spriteText.params_type = "step"
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
    var Icon = lineIcon(vector[i].x,vector[i].y,vector[i].z);
    Icon.name='线头';
    scene.add(Icon);
    scene.add(mesh);
    let addLine = setInterval(() => {
        i++;
        if(i>vector.length-2){
            clearInterval(addLine)
            attackAnimation(dst)
        }
        geometry.vertices.push(new THREE.Vector3(vector[i].x,vector[i].y,vector[i].z))
        var lines = new MeshLine();
        lines.setGeometry( geometry );
        material = new MeshLineMaterial(linkMesh);
        var linesMesh = new THREE.Mesh(lines.geometry,material);
        console.log(scene.children)
        var animateIcomn = scene.children[5];
        animateIcomn.position.set(vector[i].x,vector[i].y,vector[i].z)
        scene.add(linesMesh)
        scene.remove(scene.children[6])
    },30)

}



setTimeout(() => {
    console.log(scene)
    let data = scene.children[4].children;
    let p1 = new THREE.Vector3(data[4].positionRecord.x*scale,data[4].positionRecord.y*scale,data[4].positionRecord.z*scale);
    let p2 = new THREE.Vector3(data[13].positionRecord.x*scale,data[13].positionRecord.y*scale,data[13].positionRecord.z*scale);
    setTimeout(()=>{
        let src = [p1['x'],p1['y'],p1['z']];
        let dst = [p2['x'],p2['y'],p2['z']];
        selfAddLine(src,dst)
        
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
