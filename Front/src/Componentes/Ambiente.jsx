import { useEffect, useState } from 'react';
import estilo from './ConteudoDisciplina.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/reservaAmbiente/';

export function ConteudoAmbiente() {
    const [reservas, setReservas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [salas, setSalas] = useState([]);
    const [professores, setProfessores] = useState([]);

    const [novaReserva, setNovaReserva] = useState({
        data_inicio: '',
        data_termino: '',
        escolha: '',
        disciplina: '',
        professor: '',
        sala_reservada: '',
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
        fetchReservas();
        fetchDisciplinas();
        fetchSalas();
        fetchProfessores();
    }, []);

    const fetchReservas = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservas(response.data);
        } catch (error) {
            setError('Erro ao carregar reservas');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDisciplinas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/disciplina/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDisciplinas(response.data);
        } catch (error) {
            console.error('Erro ao buscar disciplinas:', error);
        }
    };

    const fetchSalas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/sala/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSalas(response.data);
        } catch (error) {
            console.error('Erro ao buscar salas:', error);
        }
    };

    const fetchProfessores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/professores/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const apenasProfessores = response.data.filter(p => p.escolha === 'P');
    
            setProfessores(apenasProfessores);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };
    
    

    const handleSalvar = async () => {
        const hoje = new Date();

        const { data_inicio, data_termino, escolha, disciplina, professor, sala_reservada } = novaReserva;
        if (!data_inicio || !data_termino || !escolha || !disciplina || !sala_reservada || !professor) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const dataInicioObj = new Date(data_inicio);
        const dataTerminoObj = new Date(data_termino);

        if (dataInicioObj < hoje) {
            alert('A data de início não pode ser anterior a de hoje');
            return;
        }

        if (dataTerminoObj < hoje) {
            alert('A data de término não pode ser anterior a de hoje');
            return;
        }

        if (dataTerminoObj <= dataInicioObj) {
            alert('A data de término deve ser maior que a data de início');
            return;
        }


        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            const payload = {
                data_inicio,
                data_termino,
                escolha,
                disciplina: Number(disciplina),
                sala_reservada: Number(sala_reservada),
                usuario: Number(professor)
            };

            if (editando) {
                await axios.put(`${API_URL}${idEditando}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Reserva atualizada com sucesso!');
            } else {
                await axios.post(API_URL, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Reserva cadastrada com sucesso!');
            }

            setVisible(false);
            setEditando(false);
            setIdEditando(null);
            setNovaReserva({
                data_inicio: '',
                data_termino: '',
                escolha: '',
                disciplina: '',
                professor: '',
                sala_reservada: '',
            });

            await fetchReservas();
        } catch (error) {
            alert('Erro ao salvar reserva: ' + (error.response?.data || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta reserva?')) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchReservas();
            alert('Reserva excluída com sucesso!');
        } catch (error) {
            alert('Erro ao excluir reserva: ' + (error.response?.data || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (reserva) => {
        setNovaReserva({
            data_inicio: reserva.data_inicio || '',
            data_termino: reserva.data_termino || '',
            escolha: reserva.escolha || '',
            disciplina: reserva.disciplina || '',
            professor: reserva.usuario || '',
            sala_reservada: reserva.sala_reservada || '',
        });
        setIdEditando(reserva.id);
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
                        setNovaReserva({
                            data_inicio: '',
                            data_termino: '',
                            escolha: '',
                            disciplina: '',
                            professor: '',
                            sala_reservada: '',
                        });
                        setVisible(true);
                    }}>
                        {isLoading ? 'Carregando...' : 'Cadastrar Reserva'}
                    </button>
                </div>
            )}

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar' : 'Cadastrar'} Reserva</h2>

                        <label>Data Início:</label>
                        <input
                            type="datetime-local"
                            value={novaReserva.data_inicio}
                            onChange={(e) => setNovaReserva({ ...novaReserva, data_inicio: e.target.value })}
                        />

                        <label>Data Término:</label>
                        <input
                            type="datetime-local"
                            value={novaReserva.data_termino}
                            onChange={(e) => setNovaReserva({ ...novaReserva, data_termino: e.target.value })}
                        />

                        <label>Período:</label>
                        <select
                            value={novaReserva.escolha}
                            onChange={(e) => setNovaReserva({ ...novaReserva, escolha: e.target.value })}
                        >
                            <option value="">Selecione um período</option>
                            <option value="M">Manhã</option>
                            <option value="T">Tarde</option>
                            <option value="N">Noite</option>
                        </select>

                        <label>Disciplina:</label>
                        <select
                            value={novaReserva.disciplina}
                            onChange={(e) => setNovaReserva({ ...novaReserva, disciplina: e.target.value })}
                        >
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                        </select>

                        <label>Sala Reservada:</label>
                        <select
                            value={novaReserva.sala_reservada}
                            onChange={(e) => setNovaReserva({ ...novaReserva, sala_reservada: e.target.value })}
                        >
                            <option value="">Selecione uma sala</option>
                            {salas.map((s) => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </select>

                        <label>Professor:</label>
                        <select
                            value={novaReserva.professor}
                            onChange={(e) => setNovaReserva({ ...novaReserva, professor: e.target.value })}
                        >
                            <option value="">Selecione um professor</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>

                        <div className={estilo.botoes}>
                            <button onClick={handleSalvar} disabled={isLoading} type="submit" className={estilo.cadastrar}>
                                {isLoading ? 'Salvando...' : (editando ? 'Salvar alterações' : 'Cadastrar')}
                            </button>
                            <button onClick={() => setVisible(false)} type="submit" className={estilo.fechar}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={estilo.cardContainer}>
                {reservas.map((reserva) => {
                    const disciplina = disciplinas.find(d => d.id === reserva.disciplina);
                    const sala = salas.find(s => s.id === reserva.sala_reservada);
                    const professor = professores.find(p => p.id === reserva.usuario);

                    return (
                        <div key={reserva.id} className={estilo.card}>
                            <div className={estilo.inf}>
                                <h3>{disciplina ? disciplina.nome : 'Disciplina desconhecida'}</h3>
                                <p><strong>Período:</strong> {reserva.escolha === 'M' ? 'Manhã' : reserva.escolha === 'T' ? 'Tarde' : 'Noite'}</p>
                                <p><strong>Sala:</strong> {sala ? sala.nome : 'Sala desconhecida'}</p>
                                <p><strong>Professor:</strong> {professor ? professor.nome : 'Professor desconhecido'}</p>
                                <p><strong>Início:</strong> {new Date(reserva.data_inicio).toLocaleString()}</p>
                                <p><strong>Término:</strong> {new Date(reserva.data_termino).toLocaleString()}</p>
                            </div>

                            {isGestor && (
                            <div className={estilo.cardBotoes}>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(reserva)} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(reserva.id)} />
                            </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </main>
    );
}