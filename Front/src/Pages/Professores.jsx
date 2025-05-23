import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoProfessores } from "../Componentes/ConteudoProfessores";
import { Rodape } from "../Componentes/Rodape";

export function Professores() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <ConteudoProfessores />
            <Rodape />
        </>
    );
}