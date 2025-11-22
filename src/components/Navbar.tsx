import React from 'react';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login') //Redireciona
  };

  return (
    <BSNavbar expand="lg" className='navbar-modern'>
      <Container>
        <BSNavbar.Brand as={Link} to="/">Sistema de Eventos</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/events">Eventos</Nav.Link>
            )}

          </Nav>
          <Nav>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/me/events">Meus Eventos</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/me" className='mx-3'>Conta</Nav.Link>
            )}
            {isAuthenticated ? (
              <Button variant="outline-danger" onClick={handleLogout}>Sair</Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className='btn-outline-dark-accent btn-modern'>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className='btn-outline-dark-accent btn-modern mx-3'>Cadastrar</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;