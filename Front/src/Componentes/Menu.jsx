import estilo from './Menu.module.css'
import professor from '../assets/professor.png'
import book from '../assets/book.png'
import ambiente from '../assets/ambiente.png'
import sala from '../assets/sala.png'
import boss from '../assets/boss.png'
import { Link } from 'react-router-dom'

export function Menu(){
    return(
        <div className={estilo.conteiner}>
            <table>
                <tr>
                    <td>
                        <div className={estilo.item}>
                            <img src={professor} alt="Ícone de professor" className={estilo.icone}/>
                            <Link to="/professores" style={{ textDecoration: 'none',  color: 'inherit' }}>Professores</Link>
                            
                        </div>
                    </td>
                    <td>
                        <div className={estilo.item}>
                            <img src={boss} alt="Ícone de chefe" className={estilo.icone}/>
                            <Link to="/gestores" style={{ textDecoration: 'none',  color: 'inherit' }}>Gestores</Link>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className={estilo.item}>
                            <img src={book} alt="Ícone de disciplina" className={estilo.icone}/>
                            <Link to="/disciplina" style={{ textDecoration: 'none',  color: 'inherit' }}>Disciplinas</Link>
                        </div>
                    </td>
                    <td>
                        <div className={estilo.item}>
                            <img src={ambiente} alt="Ícone de ambiente" className={estilo.icone}/>
                            <Link to="/ambientes" style={{ textDecoration: 'none',  color: 'inherit' }}>Ambientes</Link>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className={estilo.item}>
                            <img src={sala} alt="" className={estilo.icone} />
                            <Link to="/salas" style={{ textDecoration: 'none',  color: 'inherit' }}>Salas</Link>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    )
}