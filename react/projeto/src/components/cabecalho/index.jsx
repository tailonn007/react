import './Cabecalho.css';

export default function Cabecalho({ pagina, onNavigate }) {
  return (
    <header className="cabecalho">
      <a className="cabecalho-marca" href="#inicio" onClick={(evento) => { evento.preventDefault(); onNavigate('inicio'); }}>
        <span className="marca-s">F</span>
        <span>Fashion <strong>Brasil</strong></span>
      </a>
      <nav className="cabecalho-nav" aria-label="Navegação principal">
        <button className={pagina === 'inicio' ? 'nav-link ativo' : 'nav-link'} onClick={() => onNavigate('inicio')}>Início</button>
        <button className={pagina === 'modelos' ? 'nav-link ativo' : 'nav-link'} onClick={() => onNavigate('modelos')}>Encontrar modelos</button>
        <button className="nav-cta" onClick={() => onNavigate('modelos')}>Cadastrar modelo <span aria-hidden="true">＋</span></button>
      </nav>
    </header>
  );
}
