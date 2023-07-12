import React from 'react';

function DisplaySection({ triggerPreview }) {
	// creamos funcion para enviar el scroll hacia la parte superior
	//hacia la coordenada 0,0 que es el inicio del documento
	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	};

	return (
		<div className="display-section wrapper">
			<h2 className="title">New</h2>
			<p className="text">Brilliant.</p>
			<span className="description">
				A display that's up to 2x brighter in the sun.
			</span>
			{/* con el click en este boton de try me, vamos a disparar una funcion en el componente padre (app.jsx), que a su vez dispara otra funcion
			en otro componente (webgi viewer) */}
			<button className="button" onClick={triggerPreview}>
				Try me
			</button>
			<button className="back-button" onClick={handleScrollToTop}>
				TOP
			</button>
		</div>
	);
}

export default DisplaySection;
