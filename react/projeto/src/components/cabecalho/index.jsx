import {link} from 'react-router-dom';
import './Cabecalho.css';

function Cabecalho() {
  return (
    <header>
      <Link to="/">Home</Link>

      <nav>
        <navLink to='/cadastrar'>Cadastrar</navLink>
        <navLink to='/listar-usuarios'>Listar Usuários</navLink>
      </nav>
    </header>
  );
}

export default Cabecalho;
