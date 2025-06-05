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
    const [isGestor, setIsGestor] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');  // 'G' ou 'P'
        setIsGestor(role === 'G');
        fetchProfessores();
    }, []);

    const fetchProfessores = async () => {
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

            let dados = response.data;

            if (role === 'P'){
                dados = dados.filter(prof => prof.username === username);
            }

            setProfessores(dados);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const handleSalvar = async () => {
        if (!novoProfessor.telefone.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
            alert('Telefone deve estar no formato (xx)xxxxx-xxxx');
            return;
        }

        if (!novoProfessor.nome || !novoProfessor.username || !novoProfessor.NI || (!editando && !novoProfessor.password)) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        if (novoProfessor.data_nascimento) {
            const hoje = new Date();
            const nascimento = new Date(novoProfessor.data_nascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mesDif = hoje.getMonth() - nascimento.getMonth();
            if (mesDif < 0 || (mesDif === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            if (idade < 18) {
                alert('O professor deve ter 18 anos.');
                return;
            }
        }

        if (novoProfessor.data_contratacao) {
            const hoje = new Date();
            const contratacao = new Date(novoProfessor.data_contratacao);
            hoje.setHours(0,0,0,0); //Remove as horas da data de hoje para comparar apenas datas
            contratacao.setHours(0,0,0,0);//Remove as horas da data de hoje para comparar apenas datas
            if (contratacao >= hoje){
                alert('A data de contratação deve ser anterior ao dia de hoje');
                return;
            }
        }
        
        if (novoProfessor.NI === '0' || novoProfessor.NI === 0){
            alert('Número de identificação (NI) não pode ser 0');
            return;
        }

        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(novoProfessor.nome)){
            alert('O nome deve conter apenas letras')
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            const dadosParaEnviar = {...novoProfessor};

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
                alert('Professor atualizado com sucesso!');
            }
            else {
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
            
            if (error.response?.status === 400 && error.response?.data?.NI) {
                alert('Erro: Esse número de identificação (NI) já está em uso')
            } else{
                alert('Erro ao salvar professor: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este professor?')) return;

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
    };

    return (
        <main className={estilo.conteudo}>
            {isGestor && (
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
            )}

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar Professor' : 'Cadastrar Professor'}</h2>
                        <form>
                            <label>
                                Nome:
                                <input type="text" placeholder="Nome*" value={novoProfessor.nome} onChange={e => setNovoProfessor({ ...novoProfessor, nome: e.target.value })} />
                            </label>

                            <label>
                                Username:
                                <input type="text" placeholder="Usuário*" value={novoProfessor.username} onChange={e => setNovoProfessor({ ...novoProfessor, username: e.target.value })} />
                            </label>

                            <label>Telefone:
                                <input type="text" placeholder="Telefone (xx)xxxxx-xxxx*" value={novoProfessor.telefone} onChange={e => setNovoProfessor({ ...novoProfessor, telefone: e.target.value })} />
                            </label>

                            <label>
                                Número de identificação:
                                <input type="text" placeholder="NI*" value={novoProfessor.NI} onChange={e => setNovoProfessor({ ...novoProfessor, NI: e.target.value })} />
                            </label>

                            {!editando && (
                                <label>
                                    Senha:
                                    <input type="password" placeholder="Senha*" value={novoProfessor.password} onChange={e => setNovoProfessor({ ...novoProfessor, password: e.target.value })} />
                                </label>
                            )}

                            <label>
                                Data de nascimento:
                                <input type="date" placeholder="Data de Nascimento" value={novoProfessor.data_nascimento} onChange={e => setNovoProfessor({ ...novoProfessor, data_nascimento: e.target.value })} />
                            </label>

                            <label>
                                Data de contratação:
                                <input type="date" placeholder="Data de Contratação" value={novoProfessor.data_contratacao} onChange={e => setNovoProfessor({ ...novoProfessor, data_contratacao: e.target.value })} />
                            </label>

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
                {professores
                .filter(prof => prof.escolha === 'P')
                .map((prof) => (
                    <div key={prof.id} className={estilo.card}>
                        <div className={estilo.inf}>
                            <h3>{prof.nome || '-'}</h3>
                            <p><strong>Usuário:</strong> {prof.username || '-'}</p>
                            <p><strong>Telefone:</strong> {prof.telefone || '-'}</p>
                            <p><strong>NI:</strong> {prof.NI || '-'}</p>
                            <p><strong>Nascimento:</strong> {prof.data_nascimento || '-'}</p>
                            <p><strong>Contratação:</strong> {prof.data_contratacao || '-'}</p>
                        </div>

                        {isGestor && (
                            <div className={estilo.cardBotoes}>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(prof)} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(prof.id)} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
