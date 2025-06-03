import { useEffect, useState } from 'react';
import estilo from './ConteudoGestores.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/professores/';

export function ConteudoGestores() {
    const [gestores, setGestores] = useState([]);
    const [novoGestor, setNovoGestor] = useState({
        nome: '',
        username: '',
        telefone: '',
        NI: '',
        password: '',
        escolha: 'G',
        data_nascimento: '',
        data_contratacao: ''
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isGestor, setIsGestor] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');  
        setIsGestor(role === 'G');
        fetchGestores();
    }, []);

    const fetchGestores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setGestores(response.data);
        } catch (error) {
            console.error('Erro ao buscar gestores:', error);
        }
    };

    const handleSalvar = async () => {
        if (!novoGestor.telefone.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
            alert('Telefone deve estar no formato (xx)xxxxx-xxxx');
            return;
        }

        if (!novoGestor.nome || !novoGestor.username || (!editando && !novoGestor.password)) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            const dadosParaEnviar = {...novoGestor};

            if (editando) {
                if (!dadosParaEnviar.password) delete dadosParaEnviar.password;
                if (!dadosParaEnviar.data_nascimento) delete dadosParaEnviar.data_nascimento;
                if (!dadosParaEnviar.data_contratacao) delete dadosParaEnviar.data_contratacao;
                if (!dadosParaEnviar.NI) delete dadosParaEnviar.NI;
                if (!dadosParaEnviar.telefone) delete dadosParaEnviar.telefone;
            }

            console.log("Enviando dados para atualização:", dadosParaEnviar);

            if (editando) {
                console.log("Enviando dados para atualização:", dadosParaEnviar);
                await axios.patch(`${API_URL}${idEditando}`, dadosParaEnviar, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Gestor atualizado com sucesso!');
            }
            else {
                await axios.post(API_URL, novoGestor, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Gestor cadastrado com sucesso!');
            }

            setVisible(false);
            setEditando(false);
            setIdEditando(null);
            setNovoGestor({
                nome: '',
                username: '',
                telefone: '',
                NI: '',
                password: '',
                escolha: 'G',
                data_nascimento: '',
                data_contratacao: ''
            });

            await fetchGestores();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar gestor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este gestor?')) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            await axios.delete(`${API_URL}${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            await fetchGestores();
            alert('Gestor excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao excluir gestor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (gestor) => {
        setNovoGestor({
            nome: gestor.nome || '',
            username: gestor.username || '',
            telefone: gestor.telefone || '',
            NI: gestor.NI || '',
            password: '',
            escolha: 'G',
            data_nascimento: gestor.data_nascimento || '',
            data_contratacao: gestor.data_contratacao || ''
        });

        setIdEditando(gestor.id);
        setEditando(true);
        setVisible(true);
    };

    return (
        <main className={estilo.conteudo}>
            {isGestor && (
                <div className={estilo.botao}>
                    <button onClick={() => {
                        setEditando(false);
                        setIdEditando(null);
                        setNovoGestor({ nome: '', username: '', telefone: '', NI: '', password: '', escolha: 'G', data_nascimento: '', data_contratacao: '' });
                        setVisible(true);
                    }} disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Cadastrar Gestor'}
                    </button>
                </div>
            )}

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar Gestor' : 'Cadastrar Gestor'}</h2>
                        <form>
                            <input type="text" placeholder="Nome" value={novoGestor.nome} onChange={e => setNovoGestor({ ...novoGestor, nome: e.target.value })} />
                            <input type="text" placeholder="Usuário" value={novoGestor.username} onChange={e => setNovoGestor({ ...novoGestor, username: e.target.value })} />
                            <input type="text" placeholder="Telefone (xx)xxxxx-xxxx" value={novoGestor.telefone} onChange={e => setNovoGestor({ ...novoGestor, telefone: e.target.value })} />
                            <input type="text" placeholder="NI" value={novoGestor.NI} onChange={e => setNovoGestor({ ...novoGestor, NI: e.target.value })} />
                            {!editando && (
                                <input type="password" placeholder="Senha" value={novoGestor.password} onChange={e => setNovoGestor({ ...novoGestor, password: e.target.value })} />
                            )}
                            <input type="date" placeholder="Data de Nascimento" value={novoGestor.data_nascimento} onChange={e => setNovoGestor({ ...novoGestor, data_nascimento: e.target.value })} />
                            <input type="date" placeholder="Data de Contratação" value={novoGestor.data_contratacao} onChange={e => setNovoGestor({ ...novoGestor, data_contratacao: e.target.value })} />

                            <div className={estilo.botoes}>
                                <button type="button" className={estilo.cadastrar} onClick={handleSalvar} disabled={isLoading}>
                                    {isLoading ? 'Salvando...' : (editando ? 'Salvar' : 'Cadastrar')}
                                </button>
                                <button type="button" className={estilo.fechar} onClick={() => setVisible(false)} disabled={isLoading}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={estilo.cardContainer}>
                {gestores
                .filter(gest => gest.escolha === 'G')
                .map((gest) => (
                    <div key={gest.id} className={estilo.card}>
                        <div className={estilo.inf}>
                            <h3>{gest.nome || '-'}</h3>
                            <p><strong>Usuário:</strong> {gest.username || '-'}</p>
                            <p><strong>Telefone:</strong> {gest.telefone || '-'}</p>
                            <p><strong>NI:</strong> {gest.NI || '-'}</p>
                            <p><strong>Nascimento:</strong> {gest.data_nascimento || '-'}</p>
                            <p><strong>Contratação:</strong> {gest.data_contratacao || '-'}</p>
                        </div>

                        {isGestor && (
                            <div className={estilo.cardBotoes}>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(gest)} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(gest.id)} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
