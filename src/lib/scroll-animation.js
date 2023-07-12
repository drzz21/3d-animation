// importamos gsap para poder usarlo localmente,
//ya tenemos importado y declarado el scrolltrigger entonces ya no ocupamos hacerlo de nuevo
import gsap from 'gsap';

// creamos y exportamos una funcion flecha, en ella recibimos la posicion de la camara,
//el objetivo y la función onUpdate para actualizar la posición de la cámara
//siempre que queramos cambiar los valores de la camara necesitaremos la función onUpdate
// para actualizarla y rerenderizarla
export const scrollAnimation = (position, target, isMobile, onUpdate) => {
	// creamos un nuevo timeline de gsap para agrupar varias animaciones
	const tl = gsap.timeline();

	// empezamos la animacion de nuestro timeline
	//enviamos como primer argumento lo que queremos modificar, en este caso es la posicion de la cámara,
	// seguido del objeto con las propiedades que queremos modificar, en este caso son las coordenadas de la cámara

	tl.to(position, {
		// estos son los valores que cambiaremos
		x: !isMobile ? -3.38 : -7.0,
		y: !isMobile ? -10.74 : -12.2,
		z: !isMobile ? -5.93 : -6.0,
		// creamos nuestro scrolltrigger para configurarlo como el disparador de esta animación
		scrollTrigger: {
			//le indicamos que la animación inicia en sound section
			trigger: '.sound-section',
			// le indicamos que queremos que inicie cuando la parte superior
			// de la clase sound-section toque la parte inferior del viewport
			//dicho de otro modo podría decirse que empezará la animación cuando entre en el viewport el elemento
			//con la clase sound-section, con este comportamiento podemos eliminar el atributo start, pues ese es 
			//el comportamiento por defecto de los elementos
			start: "top bottom",
			// asignamos el final de la animacion como top top
			//es decir cuando la parte superior de nuestro elemento alcance la parte superior del viewport
			//es decir cuando el elemento y la parte superior del viewport colisionen
			end: "top top",
			// scrub nos ayuda a que la posicion del elemento se mueva con el scroll, ya sea hacia adelante o hacia atrás, podemos tambien 
			//agregar un pequeño delay a este movimiento, de modo que no se mueva de forma instantánea segun el valor del elemento
			//sino que le tome cierta cantidad de tiempo llegar a la nueva posición del scroll, en este caso la asignamos de 2
			//segundos
			scrub: 2,
			// desactivamos la renderización inmediata, al ser un elemento 3d que puede costar trabajo renderizar		
			//con esto le indicamos que no intentará renderizar la animación hasta que sea disparada
			immediateRender: false
		},
		// cuando la animación termine, queremos llamar la función onUpdate, dentro de esa fnción recordar que indicamos
		// en nuestra variable auxiliar que el elemento se necesita actualizar, y marcamos como dirty la camara
		//despues en nuestro event listener actualizamos la posicion de la camara y ponemos la variable de nuevo en false
		onUpdate
		//copiamos y concatenamos para ahora modificar el target, tambien animando,
		// aqui no debemos ejecutar de nuevo onUpdate porque basta con ejecutarlo una vez
	}).to(target, {
		x: !isMobile ? 1.52 : 0.7,
		y: !isMobile ? 0.77 : 1.9,
		z: !isMobile ? -1.08 : 0.7,

		scrollTrigger: {
			trigger: '.sound-section',
			start: "top bottom",
			end: "top top",
			scrub: 2,
			immediateRender: false
		}
		// agregamos un fadeout
		//para la seccion de jumbotron, que se activará de igual forma cuando entremos a la sección sound,
		//aqui pasaremos la opacidad a 0 para que gradualmente se desvanezca
	}).to('.jumbotron-section', {
		opacity: 0,
		scrollTrigger: {
			trigger: '.sound-section',
			start: "top bottom",
			end: "top top",
			scrub: 2,
			immediateRender: false
		}
		// la siguiente seccion envez de fadeout sera fadein porque la opacidad es 0 y debemos cambiarla para que se muestre
	}).to('.sound-section-content', {
		opacity: 1,
		scrollTrigger: {
			trigger: '.sound-section',
			start: "top bottom",
			end: "top top",
			scrub: 2,
			immediateRender: false
		}
	})
		//agregamos la animacion  del movimiento que se hará al entrar en la display section, en la cual de igual manera, modificaremos
		// la posicion, el objetivo y modificaremos la opacidad de la sección para que haga un fadeIn
		.to(position, {
			x: !isMobile ? 1.56 : 9.36,
			y: !isMobile ? 5.0 : 10.95,
			z: !isMobile ? 0.01 : 0.09,

			scrollTrigger: {
				trigger: '.display-section',
				start: "top bottom",
				end: "top top",
				scrub: 2,
				immediateRender: false
			},
			onUpdate
		}).to(target, {
			x: !isMobile ? -0.55 : -1.62,
			y: !isMobile ? 0.32 : 0.02,
			z: !isMobile ? 0.0 : -0.06,

			scrollTrigger: {
				trigger: '.display-section',
				start: "top bottom",
				end: "top top",
				scrub: 2,
				immediateRender: false
			}
		}).to('.display-section', {
			opacity: 1,
			scrollTrigger: {
				trigger: '.display-section',
				start: "top bottom",
				end: "top top",
				scrub: 2,
				immediateRender: false
			}
		});
}