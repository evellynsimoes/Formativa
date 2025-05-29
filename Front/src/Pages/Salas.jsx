import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoSala } from "../Componentes/ConteudoSala";
import { Rodape } from "../Componentes/Rodape";

export function Salas() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <ConteudoSala />
            <Rodape />
        </>
    );
}