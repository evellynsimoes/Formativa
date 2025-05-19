import estilo from './Rodape.module.css'
import livro_branco from '../assets/livro-branco.png'

export function Rodape() {
    return (
        <footer className={estilo.conteiner}>
            <div className={estilo.topo}>
                <img src={livro_branco} alt="Ícone de livro" className={estilo.icone} />
                <h1 className={estilo.slogan}>Conectando educação, pessoas e futuro!</h1>
            </div>

            <ul className={estilo.links}>
                <li>Política de Privacidade</li>
                <li>Termos</li>
                <li>Acessibilidade</li>
                <li>Suporte</li>
            </ul>

            <div className={estilo.direitos}>
                <p>© 2025 Sistema Escolar. Todos os direitos reservados.</p>
                <p>Desenvolvido por Evellyn Sene</p>
            </div>
        </footer>
    );
}