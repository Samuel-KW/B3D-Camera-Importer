

const get_exif = function (element) {

	return new Promise((resolve, reject) => {

		EXIF.getData(element, function () {

			const tags = EXIF.getAllTags(this);

			return resolve(tags);
		});
	});
};

const camera_settings = function (tags) {

	const date = new Date();
	const offset = -1 * (date.getTimezoneOffset() / 60);

	return {
		iso: tags.ISOSpeedRatings,
		focal_length: tags.FocalLengthIn35mmFilm,
		white_balance: tags.WhiteBalance,
		exposure: tags.ExposureTime,
		f_stop: tags.FNumber,
		utc_offset: offset,
		width: tags.ImageWidth,
		height: tags.ImageHeight,
		lat: tags.GPSLatitude,
		long: tags.GPSLongitude,
		altitude: tags.GPSAltitude,
		model: tags.Model,
		date: tags.DateTime || tags.DateTimeOriginal,
		brightness: tags.BrightnessValue

	}

}

const set_rotation = function (a, b, g) {

	if (!camera || !renderer || a == null || b == null || g == null) return;

	a = THREE.MathUtils.degToRad(a);
	b = THREE.MathUtils.degToRad(b);
	g = THREE.MathUtils.degToRad(g);

	document.getElementById('alpha').textContent = a;
	document.getElementById('beta').textContent = b;
	document.getElementById('gamma').textContent = g;

	//cube.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(g));
	//cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(b));
	//cube.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), THREE.Math.degToRad(a));

	camera.rotation.set(g / 2, b, a);
	renderer.render(scene, camera);
}

function handleOrientation(event) {
	console.log(event);
	set_rotation(event.alpha, event.beta, event.gamma);

}



function updateFieldIfNotNull() { }

let is_running = false;

document.getElementById("start").onclick = function (e) {
	e.preventDefault();

	// Request permission for iOS 13+ devices
	if (
		DeviceMotionEvent &&
		typeof DeviceMotionEvent.requestPermission === "function"
	) {
		DeviceMotionEvent.requestPermission();
	}

	if (is_running) {

		window.removeEventListener("deviceorientation", handleOrientation);

		is_running = false;

	} else {

		window.addEventListener("deviceorientation", handleOrientation);

		is_running = true;

	}
};

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xa0a0a0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 0, 0);
hemiLight.castShadow = true;
scene.add(hemiLight);


const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(50, 50, 100);
dirLight.castShadow = true;
scene.add(dirLight);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);


const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x6b6b6b }));
cube.receiveShadow = true;
cube.position.set(1, 1, 0);
scene.add(cube);

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999 }));
mesh.receiveShadow = true;
scene.add(mesh);




renderer.render(scene, camera);

window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.render(scene, camera);
});

// document.body.appendChild(new VRButton().createButton(renderer));

// renderer.xr.enabled = true;
// renderer.setAnimationLoop(function () {
//     renderer.render( scene, camera );
// });

// get_exif(document.querySelector("img"))
// 	.then(camera_settings)
// 	.then(tags => {
// 		console.log(tags);
// 	});


//view-source:https://threejs.org/examples/webgl_loader_fbx.html