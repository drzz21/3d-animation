import Nav from './components/Nav';
import Jumbotron from './components/Jumbotron';
import SoundSection from './components/SoundSection';
import DisplaySection from './components/DisplaySection';
import WebGiViewer from './components/WebGiViewer';
// importamos nuestro loader
import Loader from "./components/Loader";
import { useRef } from 'react';

function App() {
	// creamos nuestro ref que hará referencia al viewer para llamar la función creada ahí 
	//con el imperative handle
	const webgiViewerRef = useRef();
	const contentRef = useRef();

	const handlePreview = () => {
		//creamos este manejador que llamará la función que está dentro de webgiviewer
		// con el imperativehandle y la vamos a enviar al componente displaysection para llamarla desde ahí
		webgiViewerRef.current.triggerPreview();
	};

	return (
		<div className="App">
			{/* colocamos el loader como primer elemento y al ocupar todo ancho y alto cubrirá toda la pantalla */}
			<Loader/>
			{/* agregamos las secciones dentro de un div para poder ocultarlas y creamos
			una referencia a este contenedor */}
			<div id="content" ref={contentRef}>
				<Nav />
				<Jumbotron />
				<SoundSection />
				<DisplaySection triggerPreview={handlePreview} />
			</div>
			{/* enviamos nuestro ref hacia nuestro contenedor hacia el webgiviewer para poder usarlo dentro, desde el boton
			que es para poder rotar el modelo 3d */}
			<WebGiViewer contentRef={contentRef} ref={webgiViewerRef} />
		</div>
	);
}

export default App;

