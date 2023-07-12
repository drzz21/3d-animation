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
// importamos gsap
import gsap from 'gsap';
// importamos el scrolltrigger, de la libreria gsap,
//para poder utilizarlo en las animaciones al momento de hacer el scroll
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// importamos la funcion scrollAnimation de la nueva carpeta que creamos para poder llamarla
import { scrollAnimation } from '../lib/scroll-animation';

//registramos el plugin del scroll para poder utilizarlo
gsap.registerPlugin(ScrollTrigger);

// creamos la funcion donde iniciaremos nuestro giviewer
// para mostrar nuestro modelo 3d

// usamos forwardRef para tener un ref en nuestro componente que enviaremos a nuestro padre (app.jsx)
const WebGiViewer = forwardRef((props, ref) => {
	// guardamos una referencia para el canvas donde se mostrará
	// el gi viewer y la enlazamos usando ref={}
	const canvasRef = useRef(null);
	// creamos estados para almacenar las referencias  anuestro elementos del webgiviewer
	//para poder usarlos en la funcion useImperativeHandle
	const [viewerRef, setViewerRef] = useState(null);
	const [targetRef, setTargetRef] = useState(null);
	const [cameraRef, setCameraRef] = useState(null);
	const [positionRef, setPositionRef] = useState(null);
	// agregamos una referencia a nuestro canvasContainer para poder activar los elementos del click
	const canvasContainerRef = useRef(null);

	//agregamos esta bandera para saber cuando estamos o no estamos en el modo preview y
	//la iniciamos en 0 porque al inicio no estamos en modo preview
	const [previewMode, setPreviewMode] = useState(false);

	const [isMobile, setIsMobile] = useState(null);

	// con este hook definimos una funcion imperativa, es decir, definimos
	//como se ejecutará una funcion, la funcion que está expuesta por medio de este hook
	//se puede llamar desde fuera del componente a través de la ref
	//imperativehandle nos ayuda a llamar funciones definidas en componentes hijos desde el componente
	//padre, la forma tradicional es que las funciones se creen en el padre y se llamen
	//en los hijos, pero de este modo podemos hacer el proceso contrario
	//para usar useImperativeHandle debemos tambien usar useRef
	useImperativeHandle(ref, () => ({
		triggerPreview() {
			// ponemos nuestra bandera en true para saber que estamos en modo preview
			setPreviewMode(true);

			// cambiamos la opacidad de nuestro contentRef a 0, recordar que hace referencia al contenedor
			//donde están todas las secciones excepto el webgiviewer (esto lo enviamos por props),
			// de este modo conseguimos ocultar todo lo demás
			//a excepcion del modelo 3d
			props.contentRef.current.style.opacity = '0';
			//agregamos los pointerevents a nuestro canvas para poder activar la rotación
			canvasContainerRef.current.style.pointerEvents = 'all';
			// llamamos la funcion de gsap para cambiar la posicion de nuestro elemento
			//y de nuevo la llamamos para actualizar el objetivo, como no estamos haciendo un timeline
			//llamamos de nuevo la instancia de gsap
			gsap.to(positionRef, {
				x: 13.04,
				y: -2.01,
				z: 2.29,
				duration: 2,
				// creamos la funcion onUpdate de nuevo ya que no tenemos la referencia
				onUpdate: () => {
					viewerRef.setDirty();
					cameraRef.positionTargetUpdated(true);
				},
			});
			// hacemos de nuevo lo mismo entonces para actualizar el target usando la referencia que ya obtuvimos
			gsap.to(targetRef, {
				x: 0.11,
				y: 0.0,
				z: 0.0,
				duration: 2,
			});
			//y con esto activamos la rotación en el modelo( activamos el control de la camara al usuario)
			viewerRef.scene.activeCamera.setCameraOptions({
				controlsEnabled: true,
			});
		},
	}));

	//memoizamos la funcion usando useCallback para que no se esté creando nuevamente la función
	//con cada actualización del componente
	const memoizedScrollAnimation = useCallback(
		// recibimos nuestros 3 parametros y validamos que existan y sean validos
		(position, target, isMobile, onUpdate) => {
			if (position && target && onUpdate) {
				// si los 3 existen llamamos la funcion original con los 3 argumentos
				scrollAnimation(position, target, isMobile, onUpdate);
			}
		},
		// solo queremos que se cree una vez entonces enviamos u arreglo vacio de dependencias
		[]
	);

	// creamos nuestra funcion y la guardamos en un callback para evitar
	//que se esté ejecutando con cada nuevo renderizado de nuestra aplicación
	const setupViewer = useCallback(async () => {
		// inicializamos el viewer, y enviamos el valor de nuestra referencia
		//y sobre esa referencia se inicializará el viewer
		const viewer = new ViewerApp({
			canvas: canvasRef.current,
		});

		//asignamos el viewer a nuestro estado
		setViewerRef(viewer);
		const isMobileOrTablet = mobileAndTabletCheck();
		setIsMobile(isMobileOrTablet);

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

		//asignamos la camara posiciion y target a nuestro estado para usarlos
		//en la funcion del imperative handle a través de su referencia
		setCameraRef(camera);
		setPositionRef(position);
		setTargetRef(target);

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
		if (isMobileOrTablet) {
			position.set(-16.7, 1.17, 11.7);
			target.set(0, 1.37, 0);

			props.contentRef.current.className = 'mobile-or-tablet';
		}

		// nos movemos hasta la parte superior de nuestra página siempre para que se cargue, para ahí mostrar
		//las animaciones
		window.scrollTo(0, 0);

		//con esta variable llevaremos el control para saber si debemos o no cambiar la posicion de la camara
		let needsUpdate = true;

		const onUpdate = () => {
			//ponemos en true nuestra variable auxiliar para indicar que debemos volver a renderizar
			needsUpdate = true;
			// marcamos como dirty al viewer para que la aplicacion
			//sepa que la cámara debe ser actualizada
			viewer.setDirty();
		};

		// agregamos un eventlistener a nuestro viewer, es preFrame, preFrame es una fase de la ejecución del webviewer que
		//es exlucisva de webgi y se puede consultar en la documentación
		viewer.addEventListener('preFrame', () => {
			//si debemos cambiar la posicion de la camara lo hacemos y ponemos nuestra variable bandera en false
			if (needsUpdate) {
				camera.positionTargetUpdated(true);
				needsUpdate = false;
			}
		});
		// ejecutamos la función enviando la posicion y objetivo de la camara, y la funcion onUpdate que se crea arriba
		memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
	}, []);

	// usamos useEffect para solo ejecutar la función en el momento en que se inicia por primera vez el componente
	//y como lo tenemos cacheado con el useCallback los próximos renderizados no harán que se ejecute de nuevo
	useEffect(() => {
		setupViewer();
	}, []);

	// creamos la funcion para salir de nuestro modo preview y la guardamos
	//en un callback para que no se esté creando cada vez
	//este metodo hará que retornemos al estado anterior antes de activar el preview mode
	//con la configuración que teniamos anteriormente
	const handleExit = useCallback(() => {
		//eliminamos los pointer events de nuestro canvas
		canvasContainerRef.current.style.pointerEvents = 'none';
		//regresamos la opacidad de las demás secciones de la página
		props.contentRef.current.style.opacity = '1';
		// y deshabilitamos la rotación de nuestro modelo 3d
		viewerRef.scene.activeCamera.setCameraOptions({
			controlsEnabled: false,
		});
		//ponemos la bandera de previewmode en false para que nos oculte el botón de salir
		setPreviewMode(false);

		//retornamos el modelo a la posicion en la que estaba antes de que entraramos al preview mode
		// y lo hacemos usando gsap porque no estamos usando el metodo de timeline, y usamos las variables de estado
		//que tenemos guardadas localmente
		gsap.to(positionRef, {
			x: !isMobile ? 1.56 : 9.36,
			y: !isMobile ? 5.0 : 10.95,
			z: !isMobile ? 0.01 : 0.09,
			scrollTrigger: {
				trigger: '.display-section',
				start: 'top bottom',
				end: 'top top',
				scrub: 2,
				immediateRender: false,
			},
			onUpdate: () => {
				//creamos de nuevo nuestro metodo onUpdate para usarlo aquí
				viewerRef.setDirty();
				cameraRef.positionTargetUpdated(true);
			},
		});
		gsap.to(targetRef, {
			x: !isMobile ? -0.55 : -1.62,
			y: !isMobile ? 0.32 : 0.02,
			z: !isMobile ? 0.0 : -0.06,

			scrollTrigger: {
				trigger: '.display-section',
				start: 'top bottom',
				end: 'top top',
				scrub: 2,
				immediateRender: false,
			},
		});
		//agregamos nuestro arreglo de dependencias para actualizar la función cuando alguno de destos valores cambie
	}, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef]);

	return (
		<div id="webgi-canvas-container" ref={canvasContainerRef}>
			<canvas id="webgi-canvas" ref={canvasRef} />
			{/* vamos a mostrar el boton para salir del modo preview dependiendo si tenemos
			nuestra bandera de preview en true*/}
			{previewMode && (
				<button className="button" onClick={handleExit}>
					Exit
				</button>
			)}
		</div>
	);
});

export default WebGiViewer;
