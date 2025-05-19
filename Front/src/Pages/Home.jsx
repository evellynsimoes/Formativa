import { BarraNavegacao } from "../Componentes/BarraNavegacao";
import { Cabecalho } from "../Componentes/Cabecalho";
import { Conteudo } from "../Componentes/Conteudo";
import { Rodape } from "../Componentes/Rodape";

export function Home(){
  return(
    <>
      <BarraNavegacao/>
      <Cabecalho/>
      <Conteudo/>
      <Rodape/>
    </>
  )
}
