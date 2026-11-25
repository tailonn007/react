import { useEffect, useState } from 'react';
import api from '../../services/api';
import './style.css';

const CHAVE_FAVORITOS = 'fashion-brasil-favoritos';

function lerFavoritos() {
  try { return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS) || '[]'); }
  catch { return []; }
}

export default function ModelosPage() {
  const [modelos, setModelos] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [favoritos, setFavoritos] = useState(lerFavoritos);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [sorteadoId, setSorteadoId] = useState(null);

  useEffect(() => { localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos)); }, [favoritos]);

  function mostrarMensagem(texto, tipo) { setMensagem(texto); setTipoMensagem(tipo); }

  async function buscarModelos() {
    try {
      setCarregando(true);
      const resposta = await api.get('/modelos');
      setModelos(Array.isArray(resposta.data) ? resposta.data : []);
      setMensagem('');
    } catch {
      mostrarMensagem('Não foi possível carregar o catálogo. Confira se o servidor está iniciado.', 'erro');
    } finally { setCarregando(false); }
  }

  useEffect(() => { buscarModelos(); }, []);

  function limparCampos() { setNome(''); setEmail(''); setTelefone(''); setEditando(null); }

  async function salvarModelo(evento) {
    evento.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) { mostrarMensagem('Preencha todos os campos para continuar.', 'erro'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarMensagem('Digite um e-mail válido.', 'erro'); return; }
    try {
      setSalvando(true);
      const dados = { nome: nome.trim(), email: email.trim(), telefone: telefone.trim() };
      if (editando !== null) { await api.put(`/modelos/${editando}`, dados); mostrarMensagem('Perfil atualizado com sucesso!', 'sucesso'); }
      else { await api.post('/modelos', dados); mostrarMensagem('Modelo adicionado ao catálogo!', 'sucesso'); }
      limparCampos();
      await buscarModelos();
    } catch (erro) {
      mostrarMensagem(erro.response?.data?.message || 'Não foi possível salvar o perfil. Confira se o servidor está ativo.', 'erro');
    } finally { setSalvando(false); }
  }

  function editarModelo(modelo) {
    setNome(modelo.nome || ''); setEmail(modelo.email || ''); setTelefone(modelo.telefone || ''); setEditando(modelo.id); setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function excluirModelo(id) {
    if (!window.confirm('Deseja remover este perfil do catálogo?')) return;
    try { await api.delete(`/modelos/${id}`); mostrarMensagem('Perfil removido do catálogo.', 'sucesso'); await buscarModelos(); }
    catch { mostrarMensagem('Não foi possível remover este perfil.', 'erro'); }
  }

  function alternarFavorito(id) {
    const idTexto = String(id);
    setFavoritos((atuais) => atuais.includes(idTexto) ? atuais.filter((item) => item !== idTexto) : [...atuais, idTexto]);
  }

  function surpreender() {
    const opcoes = modelosVisiveis.length ? modelosVisiveis : modelos;
    if (!opcoes.length) { mostrarMensagem('Adicione um modelo ao catálogo para fazer o sorteio!', 'erro'); return; }
    const escolhido = opcoes[Math.floor(Math.random() * opcoes.length)];
    setSorteadoId(String(escolhido.id));
    mostrarMensagem(`✨ Seu próximo talento em destaque: ${escolhido.nome}!`, 'sucesso');
    window.setTimeout(() => document.getElementById(`modelo-${escolhido.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }

  const termoBusca = busca.trim().toLocaleLowerCase('pt-BR');
  const modelosEncontrados = modelos.filter((modelo) => [modelo.id, modelo.telefone, modelo.nome, modelo.email].some((campo) => String(campo ?? '').toLocaleLowerCase('pt-BR').includes(termoBusca)));
  const modelosVisiveis = mostrarFavoritos ? modelosEncontrados.filter((modelo) => favoritos.includes(String(modelo.id))) : modelosEncontrados;

  return (
    <section className="modelos-container">
      <div className="modelos-heading">
        <div><span className="modelos-eyebrow">CATÁLOGO FASHION BRASIL</span><h1>Encontre modelos</h1><p>Busque talentos para campanhas, editoriais, eventos e novos projetos.</p></div>
        <div className="heading-doodle" aria-hidden="true">✳</div>
      </div>
      {mensagem && <div className={`mensagem ${tipoMensagem}`} role="status">{mensagem}</div>}
      <div className="modelos-layout">
        <aside className="modelos-aside">
          <div className="lista-heading"><div><span className="modelos-eyebrow">TALENTOS</span><h2>Catálogo de modelos</h2></div><span className="contador-modelos">{modelos.length} perfis</span></div>
          <input className="busca-modelo" type="search" aria-label="Buscar modelo" placeholder="Nome, ID, telefone ou e-mail..." value={busca} onChange={(evento) => setBusca(evento.target.value)} />
          <div className="catalogo-tools">
            <button className="surprise-button" type="button" onClick={surpreender}>✦ Surpreenda-me</button>
            <button className={`favorites-filter ${mostrarFavoritos ? 'ativo' : ''}`} type="button" onClick={() => setMostrarFavoritos((ativo) => !ativo)} aria-pressed={mostrarFavoritos}>♡ Meu moodboard <span>{favoritos.length}</span></button>
          </div>
          {carregando ? <p className="lista-vazia">Carregando catálogo...</p> : modelosVisiveis.length === 0 ? <p className="lista-vazia">{mostrarFavoritos ? 'Seu moodboard está vazio. Toque no coração de um perfil para guardá-lo aqui.' : busca ? 'Nenhum perfil corresponde à busca.' : 'O catálogo ainda está vazio.'}</p> : (
            <div className="cards-modelos">
              {modelosVisiveis.map((modelo, indice) => {
                const idTexto = String(modelo.id);
                const favorito = favoritos.includes(idTexto);
                const destacado = sorteadoId === idTexto;
                return (
                  <article className={`card-modelo ${destacado ? 'card-sorteado' : ''}`} id={`modelo-${modelo.id}`} key={modelo.id}>
                    {destacado && <span className="sorteado-tag">✦ ESCOLHA DO DIA</span>}
                    <button className={`btn-favorito ${favorito ? 'favorito' : ''}`} type="button" onClick={() => alternarFavorito(modelo.id)} aria-label={favorito ? `Remover ${modelo.nome} dos favoritos` : `Adicionar ${modelo.nome} aos favoritos`} aria-pressed={favorito}>{favorito ? '♥' : '♡'}</button>
                    <div className={`avatar-modelo avatar-${indice % 4}`} aria-hidden="true">{modelo.nome?.trim().charAt(0).toUpperCase() || 'M'}</div>
                    <div className="dados-modelo"><span className="perfil-tag">MODELO · PERFIL {modelo.id}</span><h3>{modelo.nome}</h3><a href={`mailto:${modelo.email}`} className="contato-email">{modelo.email}</a><a href={`tel:${modelo.telefone}`} className="contato-telefone">{modelo.telefone}</a>
                      <div className="acoes-modelo"><a className="btn-contato" href={`mailto:${modelo.email}?subject=${encodeURIComponent('Oportunidade de trabalho - Fashion Brasil')}`}>Entrar em contato <span aria-hidden="true">↗</span></a><button className="btn-editar" type="button" onClick={() => editarModelo(modelo)}>Editar</button><button className="btn-excluir" type="button" onClick={() => excluirModelo(modelo.id)} aria-label={`Remover ${modelo.nome}`}>×</button></div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </aside>
        <form className="modelos-form" onSubmit={salvarModelo}>
          <span className="form-kicker">PARA MODELOS E AGÊNCIAS</span><h2>{editando !== null ? 'Editar perfil' : 'Adicionar modelo'}</h2><p className="form-subtitle">Inclua um talento no catálogo Fashion Brasil.</p>
          <label htmlFor="nome-modelo">Nome completo</label><input id="nome-modelo" type="text" placeholder="Nome do modelo" value={nome} onChange={(evento) => setNome(evento.target.value)} />
          <label htmlFor="email-modelo">E-mail profissional</label><input id="email-modelo" type="email" placeholder="contato@exemplo.com" value={email} onChange={(evento) => setEmail(evento.target.value)} />
          <label htmlFor="telefone-modelo">Telefone para contato</label><input id="telefone-modelo" type="tel" placeholder="(00) 00000-0000" value={telefone} onChange={(evento) => setTelefone(evento.target.value)} />
          <button className="btn-principal" type="submit" disabled={salvando}>{salvando ? 'Salvando...' : editando !== null ? 'Salvar perfil' : 'Adicionar ao catálogo'} <span aria-hidden="true">→</span></button>
          {editando !== null && <button className="btn-cancelar" type="button" onClick={limparCampos}>Cancelar edição</button>}
          <p className="form-note">Os contatos informados ficam disponíveis para quem busca talentos.</p>
        </form>
      </div>
    </section>
  );
}
