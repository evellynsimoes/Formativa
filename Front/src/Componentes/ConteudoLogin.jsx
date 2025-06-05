import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


import estilo from './ConteudoLogin.module.css';
import imagemLogin from '../assets/imagem-login.jpg';

export function ConteudoLogin() {
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usuario,
                    password: senha,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('userRole', data.escolha);
                localStorage.setItem('username', usuario);
                navigate('/');
            } else {
                alert('Usuário ou senha inválidos');
            }
        } catch (error) {
            alert('Erro de conexão com o servidor');
        }
        setLoading(false);
    };

    return (
        <main className={estilo.conteudo}>
            <div className={estilo.loginImagem}>
                <div className={estilo.areaLogin}>
                    <h2>Login</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="p-fluid mb-4">
                            <FloatLabel>
                                <InputText
                                    id="usuario"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    placeholder=" "
                                />
                                <label htmlFor="usuario">Usuário</label>
                            </FloatLabel>
                        </div>

                        <div className="p-fluid mb-4">
                            <FloatLabel>
                                <Password
                                    id="senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    feedback={false}
                                    placeholder=" "
                                />
                                <label htmlFor="senha">Senha</label>
                            </FloatLabel>
                        </div>

                        <div className={estilo.botaoContainer}>
                            <Button
                                label="Entrar"
                                icon="pi pi-check"
                                loading={loading}
                                onClick={handleLogin}
                                className={`p-button-rounded p-button-primary ${estilo.botaoLogin}`}
                            />
                        </div>
                    </form>
                </div>

                <div className={estilo.imagemPainel}>
                    <img src={imagemLogin} alt="Welcome" className={estilo.fundoImagem} />
                    <div className={estilo.textoImagem}>
                        <h2>Seja Bem-Vindo!</h2>
                        <p>Entre com seus dados pessoais<br />para gerenciar o sistema</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
