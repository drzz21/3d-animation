//Este componente muestra un gif a manera de loader al momento de cargar la página
import React from 'react';
//se importa el gif
import AnimatedLogo from '../assets/images/logo-animated.gif';

function Loader() {
	return (
		//cargamos el gif dentro de un div con la etiqueta loader, y dentro de una etiqueta img
		//la clase loader contiene una animacion que se ejecuta una vez y hace que el elemento desaparezca
		//que tenga una transición en su opacidad de 1 a 0 y no se repita de nuevo
		<div className="loader">
			<img className="logo" src={AnimatedLogo} alt="apple loader" />
		</div>
	);
}

export default Loader;
