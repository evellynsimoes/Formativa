import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoGestores } from "../Componentes/ConteudoGestores";
import { Rodape } from "../Componentes/Rodape";

export function Gestores() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <ConteudoGestores />
            <Rodape />
        </>
    );
}