import estilo from './Cabecalho.module.css';
import livro from '../assets/livro.png';

export function Cabecalho(){
    return(
        <header className={estilo.conteiner}>
            <h1>
            <img src={livro} alt="Ícone de livro" className={estilo.icone} />              
                Sistema Escolar
            </h1>
        </header>
    )
}