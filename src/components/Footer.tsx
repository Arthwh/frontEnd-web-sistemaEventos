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

                {/* Links de Política (Opcional, mas bom para simetria) */}
                <div className="small">
                    <Link to="/privacy" className="text-modern-link mx-2">
                        Política de Privacidade
                    </Link>
                    |
                    <Link to="/terms" className="text-modern-link mx-2">
                        Termos de Serviço
                    </Link>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;