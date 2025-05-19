import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
