import { useEffect, useState } from 'react';
import estilo from './ConteudoProfessores.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/professores/';


export function ConteudoProfessores() {
    const [professores, setProfessores] = useState([]);
    const [novoProfessor, setNovoProfessor] = useState({
        nome: '',
        username: '',
        telefone: '',
        NI: '',
        password: '',
        escolha: 'P',
        data_nascimento: '',
        data_contratacao: ''
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfessores();
    }, []);

    const fetchProfessores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/professores/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProfessores(response.data);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    const handleSalvar = async () => {
        if (!novoProfessor.telefone.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
            alert('Telefone deve estar no formato (xx)xxxxx-xxxx');
            return;
        }

        if (!novoProfessor.nome || !novoProfessor.username || (!editando && !novoProfessor.password)) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            if (editando) {
                await axios.put(`${API_URL}${idEditando}`, novoProfessor, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Professor atualizado com sucesso!');
            } else {
                await axios.post(API_URL, novoProfessor, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Professor cadastrado com sucesso!');
            }

            setVisible(false);
            setEditando(false);
            setIdEditando(null);
            setNovoProfessor({
                nome: '',
                username: '',
                telefone: '',
                NI: '',
                password: '',
                escolha: 'P',
                data_nascimento: '',
                data_contratacao: ''
            });

            await fetchProfessores();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar professor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este professor?')) {
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

            await fetchProfessores();
            alert('Professor excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao excluir professor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (professor) => {
        setNovoProfessor({
            nome: professor.nome || '',
            username: professor.username || '',
            telefone: professor.telefone || '',
            NI: professor.NI || '',
            password: '',
            escolha: 'P',
            data_nascimento: professor.data_nascimento || '',
            data_contratacao: professor.data_contratacao || ''
        });

        setIdEditando(professor.id);
        setEditando(true);
        setVisible(true);
    }

    const handleEditar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const professorEditar = professores.find(p => p.id === id);
            if (!professorEditar) {
                throw new Error('Professor não encontrado');
            }

            const dadosAtualizados = {
                ...professorEditar,
                nome: professorEditar.nome,
            };
            console.log(dadosAtualizados);
            await axios.put(`${API_URL}${id}`, dadosAtualizados, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            await fetchProfessores();
            alert('Professor atualizado!');
        } catch (error) {
            console.error('Erro ao editar', {
                error,
                response: error.response,
                data: error.response?.data
            });

            alert('Erro ao editar professor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={estilo.conteudo}>
            <div className={estilo.botao}>
                <button onClick={() => {
                    setEditando(false);
                    setIdEditando(null);
                    setNovoProfessor({ nome: '', username: '', telefone: '', NI: '', password: '', escolha: 'P', data_nascimento: '', data_contratacao: '' });
                    setVisible(true);
                }} disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Cadastrar Professor'}
                </button>
            </div>

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar Professor' : 'Cadastrar Professor'}</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={novoProfessor.nome}
                                onChange={e => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Usuário"
                                value={novoProfessor.username}
                                onChange={e => setNovoProfessor({ ...novoProfessor, username: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Telefone (xx)xxxxx-xxxx"
                                value={novoProfessor.telefone}
                                onChange={e => setNovoProfessor({ ...novoProfessor, telefone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="NI"
                                value={novoProfessor.NI}
                                onChange={e => setNovoProfessor({ ...novoProfessor, NI: e.target.value })}
                            />
                            {!editando && (
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={novoProfessor.password}
                                    onChange={e => setNovoProfessor({ ...novoProfessor, password: e.target.value })}
                                />
                            )}
                            <input
                                type="date"
                                placeholder="Data de Nascimento"
                                value={novoProfessor.data_nascimento}
                                onChange={e => setNovoProfessor({ ...novoProfessor, data_nascimento: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Data de Contratação"
                                value={novoProfessor.data_contratacao}
                                onChange={e => setNovoProfessor({ ...novoProfessor, data_contratacao: e.target.value })}
                            />

                            <div className={estilo.botoes}>
                                <button
                                    type="button"
                                    className={estilo.cadastrar}
                                    onClick={handleSalvar}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Salvando...' : (editando ? 'Salvar' : 'Cadastrar')}
                                </button>
                                <button
                                    type="button"
                                    className={estilo.fechar}
                                    onClick={() => setVisible(false)}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <div className={estilo.cardContainer}>
                {professores.map((prof) => (
                    <div key={prof.id} className={estilo.card}>
                        <h3>{prof.nome || '-'}</h3>
                        <p><strong>Usuário:</strong> {prof.username || '-'}</p>
                        <p><strong>Telefone:</strong> {prof.telefone || '-'}</p>
                        <p><strong>NI:</strong> {prof.NI || '-'}</p>
                        <p><strong>Nascimento:</strong> {prof.data_nascimento || '-'}</p>
                        <p><strong>Contratação:</strong> {prof.data_contratacao || '-'}</p>
                        <div className={estilo.cardBotoes}>
                            <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(prof)} />
                            <img src={lixeira} alt="Excluir" onClick={() => handleDelete(prof.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}