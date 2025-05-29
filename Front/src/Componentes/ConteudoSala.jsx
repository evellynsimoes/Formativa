import { useEffect, useState } from 'react';
import estilo from './ConteudoProfessores.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/sala/';

export function ConteudoSala() {
    const [salas, setSalas] = useState([]);
    const [novaSala, setNovaSala] = useState({
        nome: '',
        capacidade: '',
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isGestor, setIsGestor] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole'); // 'G' ou 'P'
        setIsGestor(role === 'G');
        fetchSalas();
    }, []);

    const fetchSalas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSalas(response.data);
        } catch (error) {
            console.error('Erro ao buscar salas:', error);
        }
    };

    const handleSalvar = async () => {
        if (!novaSala.nome || !novaSala.capacidade) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            const dadosParaEnviar = { ...novaSala };

            if (editando && !dadosParaEnviar.capacidade) {
                delete dadosParaEnviar.capacidade;
            }

            if (editando) {
                await axios.patch(`${API_URL}${idEditando}/`, dadosParaEnviar, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Sala atualizada com sucesso!');
            } else {
                await axios.post(API_URL, dadosParaEnviar, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Sala cadastrada com sucesso!');
            }

            setVisible(false);
            setEditando(false);
            setIdEditando(null);
            setNovaSala({
                nome: '',
                capacidade: '',
            });

            await fetchSalas();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar sala: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta sala?')) return;
    
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');
    
            await axios.delete(`${API_URL}${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            await fetchSalas();
            alert('Sala excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir sala:', error);
            alert('Erro ao excluir sala: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (sala) => {
        setNovaSala(prevState => ({
            ...prevState,
            nome: sala.nome || '',
            capacidade: sala.capacidade || ''
        }));
    
        setIdEditando(sala.id);
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
                        setNovaSala({ nome: '', capacidade: '' });
                        setVisible(true);
                    }} disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Cadastrar Sala'}
                    </button>
                </div>
            )}

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar Sala' : 'Cadastrar Sala'}</h2>
                        <form>
                            <input type="text" placeholder="Nome" value={novaSala.nome} onChange={e => setNovaSala({ ...novaSala, nome: e.target.value })} />
                            <input type="number" placeholder="Capacidade" value={novaSala.capacidade} onChange={e => setNovaSala({ ...novaSala, capacidade: e.target.value })} />
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
                {salas.map((sala) => (
                    <div key={sala.id} className={estilo.card}>
                        <h3>{sala.nome || '-'}</h3>
                        <p><strong>Capacidade:</strong> {sala.capacidade || '-'}</p>
                        {isGestor && (
                            <div className={estilo.cardBotoes}>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(sala)} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(sala.id)} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
