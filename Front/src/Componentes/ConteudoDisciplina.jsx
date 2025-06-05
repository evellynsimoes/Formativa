import { useEffect, useState } from 'react';
import estilo from './ConteudoDisciplina.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/disciplina/';

export function ConteudoDisciplina() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [novaDisciplina, setNovaDisciplina] = useState({
        nome: '',
        curso: '',
        carga_horaria: '',
        descricao: '',
        professor: '',
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);
    const [isGestor, setIsGestor] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setIsGestor(role === 'G');
        fetchDisciplinas();
        fetchProfessores();
    }, []);

    const fetchDisciplinas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            const username = localStorage.getItem('username');

            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            let disciplinasRecebidas = response.data;

            if (role === 'P') {
                const profResponse = await axios.get('http://localhost:8000/api/professores/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const profLogado = profResponse.data.find(p => p.username === username);

                if (profLogado) {
                    disciplinasRecebidas = disciplinasRecebidas.filter(d => d.professor === profLogado.id);
                } else {
                    disciplinasRecebidas = [];
                }
            }

            setDisciplinas(disciplinasRecebidas);
        } catch (error) {
            console.error('Erro ao buscar disciplinas:', error);
            setError('Erro ao carregar disciplinas');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfessores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/professores/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const apenasProfessores = response.data.filter(p => p.escolha === 'P');
            setProfessores(apenasProfessores);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const handleSalvar = async () => {
        if (!novaDisciplina.nome || !novaDisciplina.curso || (!editando && !novaDisciplina.professor)) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            if (editando) {
                await axios.put(`${API_URL}${idEditando}`, novaDisciplina, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Disciplina atualizada com sucesso!');
            } else {
                await axios.post(API_URL, novaDisciplina, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Disciplina cadastrada com sucesso!');
            }

            setVisible(false);
            setEditando(false);
            setIdEditando(null);
            setNovaDisciplina({
                nome: '',
                curso: '',
                carga_horaria: '',
                descricao: '',
                professor: '',
            });

            await fetchDisciplinas();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar disciplina: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.delete(`${API_URL}${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            await fetchDisciplinas();
            alert('Disciplina excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao excluir disciplina: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (disciplina) => {
        setNovaDisciplina({
            nome: disciplina.nome || '',
            curso: disciplina.curso || '',
            carga_horaria: disciplina.carga_horaria || '',
            descricao: disciplina.descricao || '',
            professor: disciplina.professor || '',
        });

        setIdEditando(disciplina.id);
        setEditando(true);
        setVisible(true);
    };

    const handleEditar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const disciplinaEditar = disciplinas.find(p => p.id === id);
            if (!disciplinaEditar) {
                throw new Error('Disciplina não encontrada');
            }

            const dadosAtualizados = {
                ...disciplinaEditar,
                nome: disciplinaEditar.nome,
            };
            console.log(dadosAtualizados);
            await axios.put(`${API_URL}${id}`, dadosAtualizados, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            await fetchDisciplinas();
            alert('Disciplina atualizada!');
        } catch (error) {
            console.error('Erro ao editar', {
                error,
                response: error.response,
                data: error.response?.data
            });

            alert('Erro ao editar disciplina: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={estilo.conteudo}>
            {isGestor && (
                <div className={estilo.botao}>
                    <button
                        onClick={() => {
                            setEditando(false);
                            setIdEditando(null);
                            setNovaDisciplina({
                                nome: '',
                                curso: '',
                                carga_horaria: '',
                                descricao: '',
                                professor: ''
                            });
                            setVisible(true);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Carregando...' : 'Cadastrar Disciplina'}
                    </button>
                </div>
            )}

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar Disciplina' : 'Cadastrar Disciplina'}</h2>
                        <input
                            type="text"
                            placeholder="Nome*"
                            value={novaDisciplina.nome}
                            onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            placeholder="Curso*"
                            value={novaDisciplina.curso}
                            onChange={(e) => setNovaDisciplina({ ...novaDisciplina, curso: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            placeholder="Carga Horária*"
                            value={novaDisciplina.carga_horaria}
                            onChange={(e) => setNovaDisciplina({ ...novaDisciplina, carga_horaria: Number(e.target.value) })}
                            disabled={isLoading}
                        />

                        <input
                            type="text"
                            placeholder="Descrição"
                            value={novaDisciplina.descricao}
                            onChange={(e) => setNovaDisciplina({ ...novaDisciplina, descricao: e.target.value })}
                            disabled={isLoading}
                        />
                        <select
                            value={novaDisciplina.professor}
                            onChange={(e) => setNovaDisciplina({ ...novaDisciplina, professor: e.target.value })}
                            disabled={isLoading || editando} 
                        >
                            <option value="">Selecione um professor</option>
                            {professores.map(prof => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.nome}
                                </option>
                            ))}
                        </select>

                        <div className={estilo.botoes}>
                            <button
                                type='submit'
                                className={estilo.cadastrar}
                                onClick={handleSalvar}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}
                            </button>
                            <button
                                className={estilo.fechar}
                                onClick={() => {
                                    setVisible(false);
                                    setEditando(false);
                                    setIdEditando(null);
                                    setNovaDisciplina({
                                        nome: '',
                                        curso: '',
                                        carga_horaria: '',
                                        descricao: '',
                                        professor: ''
                                    });
                                }}
                                disabled={isLoading}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={estilo.cardContainer}>
                {disciplinas.map((disc) => (
                    <div key={disc.id} className={estilo.card}>
                        <div className={estilo.inf}>
                            <h3>{disc.nome}</h3>

                            <p><strong>Curso:</strong> {disc.curso}</p>
                            <p><strong>Carga Horária:</strong> {disc.carga_horaria}</p>
                            <p><strong>Descrição:</strong> {disc.descricao}</p>
                            <p><strong>Professor:</strong>{
                                professores.find(p => p.id === disc.professor)?.nome || 'Desconhecido'
                            }</p>
                        </div>

                        {isGestor && (
                            <div className={estilo.cardBotoes}>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(disc)} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(disc.id)} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
