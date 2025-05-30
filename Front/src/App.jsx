import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Professores } from './Pages/Professores';
import { Disciplina } from './Pages/Disciplina';
import { Salas } from './Pages/Salas';
import { Ambientes } from './Pages/Ambientes';
import { Gestores } from './Pages/Gestores';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/professores" element={<Professores/>}/>
          <Route path="/disciplina" element={<Disciplina/>}/>
          <Route path="/gestores" element={<Gestores/>}/>
          <Route path="/salas" element={<Salas/>}/>
          <Route path="/ambientes" element={<Ambientes/>}/>
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
