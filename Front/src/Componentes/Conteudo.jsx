import estilo from './Conteudo.module.css'
import { Menu } from './Menu'

export function Conteudo(){
    return(
        <main className={estilo.conteudo}>
           <div className={estilo.menuContainer}></div>
           <div className={estilo.imagem}>
           <Menu/>
           </div>
        </main>
    )
}