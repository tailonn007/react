import './style.css';

export default function HomePage({ onAbrirCadastro }) {
  return (
    <section className="home-page">
      <div className="home-copy">
        <span className="home-selo"><i /> FASHION BRASIL · CASTING</span>
        <h1>O talento certo para a sua <em>próxima campanha.</em></h1>
        <p>Descubra modelos, conheça novos perfis e encontre a pessoa ideal para dar vida à sua marca.</p>
        <div className="home-actions">
          <button className="home-cta" onClick={onAbrirCadastro}>Encontrar modelos <span aria-hidden="true">↗</span></button>
          <button className="home-secondary" onClick={onAbrirCadastro}>Cadastrar modelo</button>
        </div>
        <div className="home-proof"><span className="proof-mark">✳</span><span>Talentos para moda, publicidade e muito mais.</span></div>
      </div>
      <div className="home-visual" aria-hidden="true">
        <div className="visual-label label-top">NOVOS TALENTOS <span>✳</span></div>
        <div className="visual-photo photo-main"><div className="photo-silhouette silhouette-one" /><div className="photo-caption"><span>01 / EDITORIAL</span><strong>Presença que inspira.</strong></div></div>
        <div className="visual-photo photo-side"><div className="photo-silhouette silhouette-two" /><div className="side-caption">MODA<br />&amp; CAMPANHA</div></div>
        <div className="visual-stamp">FB<br /><span>CASTING</span></div>
        <div className="visual-label label-bottom">ENCONTRE · CONECTE · CONTRATE</div>
      </div>
    </section>
  );
}
