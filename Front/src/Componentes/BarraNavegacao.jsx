import { Link, useLocation } from 'react-router-dom'
import estilo from './BarraNavegacao.module.css'

export function BarraNavegacao(){
    const localizacao = useLocation();

    return(
        <nav className={estilo.conteiner}>
            <ul>
                <li className={localizacao.pathname === '/' ? estilo.active : ''}>
                    <Link to="/" style={{ textDecoration: 'none',  color: 'inherit' }}>Home</Link>
                </li>
                <li className={localizacao.pathname === '/login' ? estilo.active : ''}>
                    <Link to="/login" style={{ textDecoration: 'none',  color: 'inherit' }}>Login</Link>
                </li>
            </ul>
        </nav>
    )
}