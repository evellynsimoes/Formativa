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
        data_nascimento: '2000-01-01',
        data_contratacao: '2023-01-01'
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfessores();
    }, []);

    const fetchProfessores = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }
    
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("DADOS RECEBIDOS:", response.data);
            setProfessores(response.data);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            setError('Erro ao carregar professores');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCadastro = async () => {
        if (!novoProfessor.telefone.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
            alert('Telefone deve estar no formato (xx)xxxxx-xxxx');
            return;
        }

        if (!novoProfessor.nome || !novoProfessor.username || !novoProfessor.password) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Token não encontrado');
            }

            await axios.post(API_URL, novoProfessor, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }

            });

            setVisible(false);
            setNovoProfessor({
                nome: '',
                username: '',
                telefone: '',
                NI: '',
                password: '',
                escolha: 'P',
                data_nascimento: '2000-01-01',
                data_contratacao: '2023-01-01'
            });

            await fetchProfessores();

            alert('Professor cadastrado com sucesso!');
        } catch (error) {
            console.error('Detalhes do erro:', error.response?.data || error);

            let errorMessage = 'Erro ao cadastrar professor';
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Acesso não autorizado. Faça login novamente.';
                } else if (error.response.data) {
                    errorMessage = error.response.data.message || JSON.stringify(error.response.data);
                }
            }

            setError(errorMessage);
            alert(errorMessage);
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

            await axios.delete(`${API_URL}${id}/`, {
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

    const handleEditar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }
    
            const professorParaEditar = professores.find(p => p.id === id);
            if (!professorParaEditar) {
                throw new Error('Professor não encontrado');
            }

            const dadosAtualizados = {
                ...professorParaEditar,
                nome: professorParaEditar.nome + ' (Editado)',
            };
    
            await axios.put(`${API_URL}${id}/`, dadosAtualizados, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            await fetchProfessores();
            alert('Professor atualizado!');
        } catch (error) {
            console.error('Erro ao editar', error);
            alert('Erro ao editar professor: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={estilo.conteudo}>
            <div className={estilo.botao}>
                <button onClick={() => setVisible(true)} disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Cadastrar Professor'}
                </button>
            </div>

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>Cadastrar Professor</h2>
                        <input
                            type="text"
                            placeholder="Nome*"
                            value={novoProfessor.nome}
                            onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            placeholder="Usuário*"
                            value={novoProfessor.username}
                            onChange={(e) => setNovoProfessor({ ...novoProfessor, username: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="password"
                            placeholder="Senha*"
                            value={novoProfessor.password}
                            onChange={(e) => setNovoProfessor({ ...novoProfessor, password: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="text"
                            placeholder="Telefone (xx)xxxxx-xxxx*"
                            value={novoProfessor.telefone}
                            onChange={(e) => setNovoProfessor({ ...novoProfessor, telefone: e.target.value })}
                            disabled={isLoading}
                        />
                        <input
                            type="number"
                            placeholder="NI"
                            value={novoProfessor.NI}
                            onChange={(e) => setNovoProfessor({ ...novoProfessor, NI: e.target.value })}
                            disabled={isLoading}
                        />
                        <div className={estilo.botoes}>
                            <button
                                type='submit'
                                className={estilo.cadastrar}
                                onClick={handleCadastro}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                            <button
                                className={estilo.fechar}
                                onClick={() => setVisible(false)}
                                disabled={isLoading}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>


            )}
             
             <div className={estilo.containerTabela}>
                <table className={estilo.tabela}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>Telefone</th>
                            <th>NI</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {professores.map((prof) => (
                            <tr key={prof.id}>
                                <td>{prof.nome}</td>
                                <td>{prof.username}</td>
                                <td>{prof.telefone}</td>
                                <td>{prof.NI}</td>
                                <td className={estilo.icones}>
                                    <img
                                        src={lapis}
                                        alt="Editar"
                                        className={estilo.iconeAcao}
                                        onClick={() => handleEditar(prof.id)}
                                    />
                                    <img
                                        src={lixeira}
                                        alt="Excluir"
                                        className={estilo.iconeAcao}
                                        onClick={() => handleDelete(prof.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
           
        </main>
    );
}