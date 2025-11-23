import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="navbar-modern mt-auto py-3">
            <Container className="text-center text-light">
                <p className="mb-1">
                    &copy; {new Date().getFullYear()} Sistema de Eventos. Todos os direitos reservados.
                </p>

                <div className="small">
                    <Link to="/certificates/verify" className="text-modern-link mx-2">
                        Verificar Autenticidade
                    </Link>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;