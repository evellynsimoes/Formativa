import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { ConteudoLogin } from "../Componentes/ConteudoLogin";
import { Rodape } from "../Componentes/Rodape";

export function Login(){
  return(
    <>
      <BarraNavegacao/>
      <Cabecalho/>
      <ConteudoLogin/>
      <Rodape/>
    </>
  )
}