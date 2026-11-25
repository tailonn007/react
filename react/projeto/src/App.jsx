import { useState } from 'react';
import Cabecalho from './components/cabecalho/index.jsx';
import Rodape from './components/Rodape/index.jsx';
import HomePage from './pages/HomePage/Index.jsx';
import ModelosPage from './pages/ModelosPage/Index.jsx';

export default function App() {
  const [pagina, setPagina] = useState('inicio');
  const abrirModelos = () => setPagina('modelos');

  return (
    <div className="app-shell">
      <Cabecalho pagina={pagina} onNavigate={setPagina} />
      <main className="app-content">
        {pagina === 'modelos'
          ? <ModelosPage />
          : <HomePage onAbrirCadastro={abrirModelos} />}
      </main>
      <Rodape />
    </div>
  );
}
