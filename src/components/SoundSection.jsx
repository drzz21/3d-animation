import React from 'react';

function SoundSection() {
	//creamos la funcion para manejar el scrolll hacia la siguiente sección
	const handleLearnMore = () => {
		// obtenemos la referencia a la display-section
		const element = document.querySelector('.display-section');
		// y hacemos un scroll smooth hacia esa sección
		// con la funcion scroll to le indicamos la posicion  del documento en coordenadas a la que se debe desplazar,
		// se debe desplazar en el eje x(que en este caso es el valor de top) hacia las coordenadas
		//inferiores del elemento que estamos consultando


		//getBoundingClientRect nos ayuda a obtener las coordenadas de un elemento, de acuerdo al viewport
		//entonces para obtener las coordenadas del elemento en el documento agregamos ademas de las coordenadas del viewport,
		//el valor del scroll, por lo tanto con esta suma obtenemos el valor correcto del elemento al que queremos desplazarnos en nuestra página
		scrollTo({
			top: element?.getBoundingClientRect().top + window.scrollY,
			left: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className="sound-section wrapper">
			<div className="body">
				<div className="sound-section-content content">
					<h2 className="title">New Sound System</h2>
					<p className="text">Feel the base.</p>
					<span className="description">
						From $41.62/mo. for 24 mo. or $999 before trade-in
					</span>
					<ul className="links">
						<li>
							<button className="button">Buy</button>
						</li>
						<li>
							<a className="link" onClick={handleLearnMore}>
								Learn more...
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default SoundSection;
