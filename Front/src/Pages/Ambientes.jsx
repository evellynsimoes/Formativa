import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoAmbiente } from "../Componentes/Ambiente";
import { Rodape } from "../Componentes/Rodape";

export function Ambientes() {
    return (
        <>
            <BarraNavegacao />
            <Cabecalho />
            <ConteudoAmbiente />
            <Rodape />
        </>
    );
}