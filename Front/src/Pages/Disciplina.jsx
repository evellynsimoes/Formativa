import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoDisciplina } from "../Componentes/ConteudoDisciplina";
import { Rodape } from "../Componentes/Rodape";

export function Disciplina() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <ConteudoDisciplina />
            <Rodape />
        </>
    );
}