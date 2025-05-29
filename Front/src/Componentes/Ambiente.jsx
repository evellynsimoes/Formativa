import { useEffect, useState } from 'react';
import estilo from './ConteudoDisciplina.module.css';
import axios from 'axios';
import lapis from '../assets/lapis.png';
import lixeira from '../assets/lixeira.png';

const API_URL = 'http://localhost:8000/api/reservaAmbiente/';

export function ConteudoAmbiente() {
    const [reservas, setReservas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [salas, setSalas] = useState([]);
    const [novaReserva, setNovaReserva] = useState({
        data_inicio: '',
        data_termino: '',
        disciplina: '',
        professor: '',
        sala_reservada: '',
    });
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        fetchReservas();
        fetchDisciplinas();
        fetchProfessores();
        fetchSalas();
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

    const fetchProfessores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/professores/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfessores(response.data);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const fetchSalas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/salas/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSalas(response.data);
        } catch (error) {
            console.error('Erro ao buscar salas:', error);
        }
    };

    const handleSalvar = async () => {
        const { data_inicio, data_termino, disciplina, professor, sala_reservada } = novaReserva;
        if (!data_inicio || !data_termino || !disciplina || !professor || !sala_reservada) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');

            if (editando) {
                await axios.put(`${API_URL}${idEditando}/`, novaReserva, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Reserva atualizada com sucesso!');
            } else {
                await axios.post(API_URL, novaReserva, {
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
                disciplina: '',
                professor: '',
                sala_reservada: '',
            });

            await fetchReservas();
        } catch (error) {
            alert('Erro ao salvar reserva: ' + (error.response?.data?.message || error.message));
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
            alert('Erro ao excluir reserva: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const abrirModalEdicao = (reserva) => {
        setNovaReserva({
            data_inicio: reserva.data_inicio || '',
            data_termino: reserva.data_termino || '',
            disciplina: reserva.disciplina || '',
            professor: reserva.professor || '',
            sala_reservada: reserva.sala_reservada || '',
        });
        setIdEditando(reserva.id);
        setEditando(true);
        setVisible(true);
    };

    return (
        <main className={estilo.conteudo}>
            <div className={estilo.botao}>
                <button onClick={() => {
                    setEditando(false);
                    setIdEditando(null);
                    setNovaReserva({
                        data_inicio: '',
                        data_termino: '',
                        disciplina: '',
                        professor: '',
                        sala_reservada: '',
                    });
                    setVisible(true);
                }}>
                    {isLoading ? 'Carregando...' : 'Cadastrar Reserva'}
                </button>
            </div>

            {error && <div className={estilo.erro}>{error}</div>}

            {visible && (
                <div className={estilo.modal}>
                    <div className={estilo.modalContent}>
                        <h2>{editando ? 'Editar' : 'Cadastrar'} Reserva</h2>

                        <input type="datetime-local" value={novaReserva.data_inicio} onChange={(e) => setNovaReserva({ ...novaReserva, data_inicio: e.target.value })} />
                        <input type="datetime-local" value={novaReserva.data_termino} onChange={(e) => setNovaReserva({ ...novaReserva, data_termino: e.target.value })} />

                        <select value={novaReserva.disciplina} onChange={(e) => setNovaReserva({ ...novaReserva, disciplina: e.target.value })}>
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>{d.nome}</option>
                            ))}
                        </select>

                        <select value={novaReserva.professor} onChange={(e) => setNovaReserva({ ...novaReserva, professor: e.target.value })}>
                            <option value="">Selecione um professor</option>
                            {professores.map((p) => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>

                        <select value={novaReserva.sala_reservada} onChange={(e) => setNovaReserva({ ...novaReserva, sala_reservada: e.target.value })}>
                            <option value="">Selecione uma sala</option>
                            {salas.map((s) => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </select>

                        <div className={estilo.botoes}>
                            <button onClick={handleSalvar} disabled={isLoading}>
                                {isLoading ? 'Salvando...' : (editando ? 'Salvar alterações' : 'Cadastrar')}
                            </button>
                            <button onClick={() => setVisible(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            <table className={estilo.tabela}>
                <thead>
                    <tr>
                        <th>Data Início</th>
                        <th>Data Término</th>
                        <th>Disciplina</th>
                        <th>Professor</th>
                        <th>Sala</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.length === 0 ? (
                        <tr><td colSpan={6}>Nenhuma reserva encontrada.</td></tr>
                    ) : (
                        reservas.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{new Date(reserva.data_inicio).toLocaleString()}</td>
                                <td>{new Date(reserva.data_termino).toLocaleString()}</td>
                                <td>{reserva.disciplina_nome || reserva.disciplina}</td>
                                <td>{reserva.professor_nome || reserva.professor}</td>
                                <td>
                                    {
                                        salas.find(s => s.id === reserva.sala_reservada)?.nome || reserva.sala_reservada
                                    }
                                </td>
                                <img src={lapis} alt="Editar" onClick={() => abrirModalEdicao(reserva)} style={{ cursor: 'pointer', marginRight: 10 }} />
                                <img src={lixeira} alt="Excluir" onClick={() => handleDelete(reserva.id)} style={{ cursor: 'pointer' }} />
                            </tr>
                ))
                    )}
            </tbody>
        </table>
        </main >
    );
}
