import React from 'react';
import Iphone from '../assets/images/iphone-14.jpg';
import HoldingIphone from '../assets/images/iphone-hand.png';

function Jumbotron() {
	const handleLearnMore = () => {
		// obtenemos el elemento donde está la seccion de sonido
		const element = document.querySelector('.sound-section');
		// usamos un scroll para redirigirnos al elemento, usamos el signo de interrogación para que solo
		//funcione si el elemento no es nulo, el elemento scrollTo debe recibir las coordenadas top y left,
		//left es 0 y top es igual a las coordenadas del elemento que obtuvimos con el query, y el comportamiento es smooth
		//para hacer una transición lenta
		window.scrollTo({ top: element?.getBoundingClientRect().top,left:0,behavior:'smooth' });
	};

	return (
		<div className="jumbotron-section wrapper">
			<h2 className="title">New</h2>
			<img className="logo" src={Iphone} alt="iPhone 14 Pro" />
			<p className="text">Big and bigger.</p>
			<span className="description">
				From $41.62/mo. for 24 mo. or $999 before trade-in
			</span>
			<ul className="links">
				<li>
					<button className="button">Buy</button>
				</li>
				<li>
					<a className="link" onClick={handleLearnMore}>Learn more</a>
				</li>
			</ul>
			<img className="iphone-img" src={HoldingIphone} alt="iPhone" />
		</div>
	);
}

export default Jumbotron;
