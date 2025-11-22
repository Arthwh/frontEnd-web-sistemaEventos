import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <Container fluid className="p-0 m-0">
            {/* --- Banner Principal --- */}
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 m-5">
                <h1 className="display-3 fw-bold text-light mb-3">
                    Descubra Eventos Incríveis e <span style={{ color: 'var(--bs-info)' }}>Valorize seu Currículo</span>
                </h1>
                <p className="lead text-light mb-5" style={{ maxWidth: '700px', opacity: 0.8 }}>
                    A plataforma ideal para você se inscrever em palestras, workshops e cursos.
                    Confirme sua presença e emita certificados de participação automaticamente.
                </p>

                <div className="d-flex gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        className="btn-modern btn-accent px-5"
                        onClick={() => navigate('/events')}
                    >
                        Explorar Eventos
                    </Button>

                    {/* Botão inteligente: Mostra "Criar Conta" se não logado, ou "Meus Eventos" se logado */}
                    {!isAuthenticated ? (
                        <Button
                            variant="outline-light"
                            size="lg"
                            className="btn-modern px-5"
                            as={Link}
                            to="/register"
                        >
                            Criar Conta
                        </Button>
                    ) : (
                        <Button
                            variant="outline-light"
                            size="lg"
                            className="btn-modern px-5"
                            as={Link}
                            to="/me"
                        >
                            Meus Eventos
                        </Button>
                    )}
                </div>
            </div>

            {/* --- FEATURES SECTION (Destaques) --- */}
            <Container className="py-5">
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="card-modern">
                            <Card.Body className="text-center p-4">
                                <div className="display-4 mb-3">🎫</div>
                                <Card.Title as="h3">Inscrição Fácil</Card.Title>
                                <Card.Text className="opacity-75">
                                    Garanta sua vaga em eventos acadêmicos e profissionais com apenas alguns cliques.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-modern">
                            <Card.Body className="text-center p-4">
                                <div className="display-4 mb-3">🎓</div>
                                <Card.Title as="h3">Certificação Automática</Card.Title>
                                <Card.Text className="opacity-75">
                                    Participe dos eventos e baixe seu certificado de horas complementares diretamente na plataforma.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card-modern">
                            <Card.Body className="text-center p-4">
                                <div className="display-4 mb-3">📂</div>
                                <Card.Title as="h3">Histórico Completo</Card.Title>
                                <Card.Text className="opacity-75">
                                    Mantenha um portfólio de todas as suas participações e acesse seus comprovantes sempre que precisar.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* --- CTA SECTION (Chamada final) --- */}
            {!isAuthenticated && (
                <div className="text-center py-5 mt-4">
                    <h2 className="text-light mb-4">Não perca mais nenhum evento!</h2>
                    <Link to="/login" className="text-modern-link fs-5">
                        Já tenho cadastro, acessar minha conta &rarr;
                    </Link>
                </div>
            )}
        </Container>
    );
};

export default HomePage;