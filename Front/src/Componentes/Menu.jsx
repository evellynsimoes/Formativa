import estilo from './Menu.module.css'
import professor from '../assets/professor.png'
import book from '../assets/book.png'
import ambiente from '../assets/ambiente.png'
import boss from '../assets/boss.png'

export function Menu(){
    return(
        <div className={estilo.conteiner}>
            <table>
                <tr>
                    <td>
                        <div className={estilo.item}>
                            <img src={professor} alt="Ícone de professor" className={estilo.icone}/>
                            Professores
                        </div>
                    </td>
                    <td>
                        <div className={estilo.item}>
                            <img src={boss} alt="Ícone de chefe" className={estilo.icone}/>
                            Gestores
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className={estilo.item}>
                            <img src={book} alt="Ícone de disciplina" className={estilo.icone}/>
                            Disciplinas
                        </div>
                    </td>
                    <td>
                        <div className={estilo.item}>
                            <img src={ambiente} alt="Ícone de ambiente" className={estilo.icone}/>
                            Ambientes
                        </div>
                    </td>
                </tr>

            </table>
        </div>
    )
}