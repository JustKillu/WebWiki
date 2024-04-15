import React, { useContext, useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './page/LandingPage.jsx'; 
import Login from './page/Login.jsx';
import Unauthorized  from './page/Unauthorized.jsx';
import Register from './page/Register.jsx';
import AdminPage from './page/AdminPage.jsx'; 
import WikiEntry from './page/wiki.jsx'; 
import Peticion from './page/peticion.jsx';
import Trivia from './page/triv.jsx'; 
import EntryDetail from './componentes/EntryDetail.jsx'; 
import Formulario from './componentes/Formulario.jsx'; 
import Navbar from './componentes/NavBar.jsx';
import { ThemeProvider } from './ThemeProvider'; 
import { withAuthentication } from './withAuthentication';
import { OpenContext } from './OpenContext'; 

function App() {
  const { isOpen } = useContext(OpenContext); 
  const [margin, setMargin] = useState(isOpen ? 'ml-64' : 'ml-0');

  useEffect(() => {
    setMargin(isOpen ? 'ml-64' : 'ml-0');
  }, [isOpen]);

  const AuthenticatedWikiEntry = withAuthentication(WikiEntry);
  const AuthenticatedEntryDetail = withAuthentication(EntryDetail);
  const AuthenticatedFormulario = withAuthentication(Formulario);
  const AuthenticatedPeticion = withAuthentication(Peticion);
  const AuthenticatedTrivia = withAuthentication(Trivia);
  const AuthenticatedAdminPage = withAuthentication(AdminPage, 'adm');

  return (
    <ThemeProvider> 
        <Router>
          <Navbar />
          <div className={`transition-all duration-200 ${margin}`}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wiki" element={<AuthenticatedWikiEntry />} />
              <Route path="/entry/:id" element={<AuthenticatedEntryDetail />} />
              <Route path="/formulario/:id" element={<AuthenticatedFormulario />} /> 
              <Route path="/peticion" element={<AuthenticatedPeticion />} /> 
              <Route path="/trivia" element={<AuthenticatedTrivia />} /> 
              <Route path="/admin" element={<AuthenticatedAdminPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </div>
        </Router>
    </ThemeProvider>
  );
}

export default App;
