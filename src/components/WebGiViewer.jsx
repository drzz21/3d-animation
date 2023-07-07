import React, {
	useRef,
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	ViewerApp,
	AssetManagerPlugin,
	GBufferPlugin,
	ProgressivePlugin,
	TonemapPlugin,
	SSRPlugin,
	SSAOPlugin,
	BloomPlugin,
	GammaCorrectionPlugin,
	TweakpaneUiPlugin,
	AssetManagerBasicPopupPlugin,
	mobileAndTabletCheck,
} from 'webgi';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// creamos la funcion donde iniciaremos nuestro giviewer
// para mostrar nuestro modelo 3d
function WebGiViewer() {
	// guardamos una referencia para el canvas donde se mostrará
	// el gi viewer y la enlazamos usando ref={}
	const canvasRef = useRef(null);

	// creamos nuestra funcion y la guardamos en un callback para evitar
	//que se esté ejecutando con cada nuevo renderizado de nuestra aplicación
	const setupViewer = useCallback(async () => {
		// inicializamos el viewer, y enviamos el valor de nuestra referencia
		//y sobre esa referencia se inicializará el viewer
		const viewer = new ViewerApp({
			canvas: canvasRef.current,
		});

		// agregamos el plugin manejadro de plugins
		//este plugin maneja los plugins y assets que agreguemos al proyecto
		//y por assets nos referimos al modelo 3d que vamos a agregar

		const manager = await viewer.addPlugin(AssetManagerPlugin);

		// creamos la variable camara obteniendo la camara activa del viewer,
		// esto nos ayudará a cambiar su posicion, tambien debemos obtener su posicion y el objetivo
		// de la camara
		const camera = viewer.scene.activeCamera;
		const position = camera.position;
		const target = camera.target;

		// agregamos los plugins que necesitaremos, estos plugins cambian la apariencia de nuestro modelo 3d, por eso
		//solo debemos agregar los que necesitamos
		await viewer.addPlugin(GBufferPlugin);
		await viewer.addPlugin(new ProgressivePlugin(32));
		//modificamos esta linea y enviamos true al tonemapplugin
		//para que se elimine correctamente el fondo
		await viewer.addPlugin(new TonemapPlugin(true));
		await viewer.addPlugin(GammaCorrectionPlugin);
		await viewer.addPlugin(SSRPlugin);
		await viewer.addPlugin(SSAOPlugin);
		await viewer.addPlugin(BloomPlugin);

		// await addBasePlugins(viewer);

		// despues de añadir los plugins debemos refrescar el pipeline,
		//esto se podría hacer despues de cada plugin pero como tenemos varios lo mejor es dejarlo al final
		viewer.renderer.refreshPipeline();

		// agregamos el archivo glb, que contiene nuestro modelo tridimensional
		await manager.addFromPath('scene-black.glb');

		//con esta opcion ponemos el fondo de nuestro modelo tridimensional en transparente
		//de modo que podemos ver lo que está detrás, esto lo ponemos porque nos estaba obstruyendo
		// nuestra barra de navegación
		viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

		// con esto deshabilitamos los controles de la camara del modelo, para que el usuario no pueda rotarla
		//una vez que se carga la página y el modelo
		viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

		// nos movemos hasta la parte superior de nuestra página siempre para que se cargue, para ahí mostrar
		//las animaciones
		window.scrollTo(0, 0);

		//con esta variable llevaremos el control para saber si debemos o no cambiar la posicion de la camara
		let needsUpdate = true;

		// agregamos un eventlistener a nuestro viewer, es preFrame, preFrame es una fase de la ejecución del webviewer que 
		//es exlucisva de webgi y se puede consultar en la documentación
		viewer.addEventListener('preFrame', () => {
			//si debemos cambiar la posicion de la camara lo hacemos y ponemos nuestra variable bandera en false
			if (needsUpdate) {
				camera.positionTargetUpdated(true);
				needsUpdate = false;
			}
		});
	}, []);

	// usamos useEffect para solo ejecutar la función en el momento en que se inicia por primera vez el componente
	//y como lo tenemos cacheado con el useCallback los próximos renderizados no harán que se ejecute de nuevo
	useEffect(() => {
		setupViewer();
	});

	return (
		<div id="webgi-canvas-container">
			<canvas id="webgi-canvas" ref={canvasRef} />
		</div>
	);
}

export default WebGiViewer;
