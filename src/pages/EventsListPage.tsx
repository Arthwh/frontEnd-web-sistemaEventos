import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, Alert, Spinner } from 'react-bootstrap';
import EventService from '../api/eventService';
import RegistrationService from '../api/registrationService';
import ToastNotification from '../components/ToastNotification';
import type { EventData } from '../types/event';
import type { Registration } from '../types/registration'
import { useAuth } from '../context/AuthContext';

const formatEventDateTime = (isoString: string): { formattedDate: string; formattedTime: string } => {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) {
        return { formattedDate: 'Data Inválida', formattedTime: 'Hora Inválida' };
    }
    const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { formattedDate, formattedTime };
};

const EventsListPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [subscribingId, setSubscribingId] = useState<string | null>(null); // ID do evento sendo inscrito no momento
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const eventsData = await EventService.getEventsData()
                    .catch(err => {
                        throw new Error("Falha ao carregar eventos: " + err?.message)
                    });
                setEvents(eventsData);

                const userRegistrations = await RegistrationService.getMyRegistrations()
                    .catch(err => {
                        throw new Error("Não foi possível carregar inscrições do usuário: " + err?.message);
                    })

                setRegistrations(userRegistrations);
            } catch (err) {
                setToastInfo({ show: true, msg: "Não foi possível carregar inscrições do usuário: " + err.message, variant: 'danger' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    const handleSubscribe = async (eventId: string) => {

        setSubscribingId(eventId);

        try {
            const newRegistration = await RegistrationService.registerForEvent(eventId, user!.id);
            setRegistrations(prev => [...prev, newRegistration]);

            setToastInfo({ show: true, msg: 'Inscrição realizada com sucesso!', variant: 'success' });
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Erro ao realizar inscrição.';
            setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
        } finally {
            setSubscribingId(null);
        }
    };

    const categories = useMemo(() => {
        const cats = new Set(events.map(e => e.category));
        return ['Todos', ...Array.from(cats)];
    }, [events]);

    const filteredEvents = useMemo(() => {
        return events
            .filter(event =>
                event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(event =>
                !filterCategory || filterCategory === 'Todos' || event.category === filterCategory
            )
    }, [events, searchTerm, filterCategory]);

    if (isLoading) {
        return (
            <Container fluid className="py-5 d-flex justify-content-center align-items-center flex-grow-1">
                <Spinner animation="border" variant="primary" />
                <span className="ms-3 text-light">Carregando eventos...</span>
            </Container>
        );
    }

    return (
        <Container fluid className="flex-grow-1 position-relative">
            {/* TOAST DE FEEDBACK */}
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            {/* CABEÇALHO */}
            <Row className="mb-5 align-items-center justify-content-between px-3 px-md-0">
                <Col xs={12} md={6}>
                    <h1 className="display-4 fw-light mb-2">Descubra Eventos</h1>
                    <h2 className="fs-6 subtitle">Encontre a sua próxima experiência!</h2>
                </Col>
            </Row>

            {/* BARRA DE PESQUISA E FILTROS */}
            <Row className="mb-5 p-3 mx-0 card-modern">
                <Col md={8} className="mb-3 mb-md-0">
                    <InputGroup>
                        <InputGroup.Text className="input-group-modern-prepend">
                            <span style={{ color: '#888' }}>🔎</span>
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por título ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control-modern input-group-modern-control"
                        />
                    </InputGroup>
                </Col>

                <Col md={4}>
                    <Dropdown onSelect={(key) => setFilterCategory(key)}>
                        <Dropdown.Toggle className="w-100 btn-modern btn-accent">
                            Categoria: {filterCategory || 'Todos'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="card-modern">
                            {categories.map(cat => (
                                <Dropdown.Item key={cat} eventKey={cat} active={cat === filterCategory} className='dropdownItem'>
                                    {cat}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            {/* LISTAGEM DE CARDS */}
            <Row className="g-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                        const { formattedDate, formattedTime } = formatEventDateTime(event.eventDate);

                        const isRegistered = registrations.some(reg =>
                            reg.eventId === event.id && reg.status !== 'CANCELED' && reg.status !== 'DELETED'
                        );

                        const isSubscribingThis = subscribingId === event.id;

                        return (
                            <Col key={event.id} xs={12} sm={6} lg={4} xl={3}>
                                <Card className={`h-100 card-modern card-modern-hover`}>
                                    <Card.Body className="d-flex flex-column">

                                        <div className="d-flex align-items-center mb-3">
                                            <div>
                                                <Card.Title className="mb-0 fs-5">
                                                    {event.eventName}
                                                </Card.Title>
                                            </div>
                                        </div>

                                        <Card.Text className="small mb-4 flex-grow-1 subtitle">
                                            {event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                                        </Card.Text>

                                        <div className="mb-4">
                                            <div className="d-flex align-items-center mb-2 small text-light">
                                                <span className="me-2 text-accent">📅</span>
                                                {formattedDate}
                                            </div>
                                            <div className="d-flex align-items-center mb-2 small text-light">
                                                <span className="me-2 text-accent">⏰</span>
                                                {formattedTime}
                                            </div>
                                            <div className="d-flex align-items-center mb-2 small text-light">
                                                <span className="me-2 text-accent">📍</span>
                                                {event.eventLocal}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleSubscribe(event.id)}
                                            disabled={isSubscribingThis || isRegistered}
                                            variant="outline-primary"
                                            className="mt-auto btn-outline-dark-accent btn-modern"
                                        >
                                            {isSubscribingThis ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                    Inscrevendo...
                                                </>
                                            ) : isRegistered ? (
                                                'Inscrito'
                                            ) : (
                                                'Inscrever-se'
                                            )}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })) : (
                    <Col xs={12}>
                        <Alert variant="info" className="alert-dark-variant">
                            Nenhum evento encontrado para o termo de busca ou filtro selecionado.
                        </Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default EventsListPage;