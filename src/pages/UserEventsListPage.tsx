import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RegistrationService from '../api/registrationService';
import type { Registration } from '../types/registration'
import type { EventData } from '../types/event'
import EventService from '../api/eventService'
import ToastNotification from '../components/ToastNotification';

// Tipo Combinado: Inscrição + Dados do Evento
interface RegistrationWithEvent extends Registration {
    eventDetails?: EventData;
}

const UserEventsListPage: React.FC = () => {
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });

    const [showModal, setShowModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithEvent | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // --- BUSCA E HIDRATAÇÃO ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                //Busca as inscrições
                const rawRegistrations = await RegistrationService.getMyRegistrations();

                //Cria um array de Promises para buscar os eventos em PARALELO
                const eventPromises = rawRegistrations.map(reg =>
                    EventService.getEventDataById(reg.eventId)
                        .catch(() => null) // Se um evento falhar, retorna null para não quebrar tudo
                );

                // Aguarda todas as requisições terminarem
                const eventsData = await Promise.all(eventPromises);

                // Combina a inscrição com seu respectivo evento
                const combinedData: RegistrationWithEvent[] = rawRegistrations.map((reg, index) => ({
                    ...reg,
                    eventDetails: eventsData[index] || {
                        id: reg.eventId,
                        title: 'Evento não encontrado',
                        date: ''
                    }
                }));

                setRegistrations(combinedData);
            } catch (err) {
                console.error(err);
                const errorMsg = err.response?.data?.message || 'Não foi possível carregar suas inscrições.';
                setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- AÇÕES ---
    const handleCancel = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja cancelar sua inscrição neste evento?')) return;

        setProcessingId(id);
        try {
            await RegistrationService.cancelRegistration(id);

            setRegistrations(prev => prev.map(item =>
                item.id === id ? { ...item, status: 'CANCELED' } : item
            ));

            setToastInfo({ show: true, msg: "Inscrição cancelada com sucesso!", variant: 'success' });
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Erro ao cancelar inscrição. Tente novamente.';
            setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleGenerateCertificate = async (registration: Registration) => {
        setProcessingId(registration.id);
        try {
            await RegistrationService.downloadCertificate(registration.id);
            setToastInfo({ show: true, msg: 'Certificado baixado com sucesso!', variant: 'success' });
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Erro ao baixar certificado.';
            setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
        } finally {
            setProcessingId(null);
        }
    };

    const openDetails = (registration: RegistrationWithEvent) => {
        setSelectedRegistration(registration);
        setShowModal(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <Badge bg="primary">Confirmado</Badge>;
            case 'PENDING': return <Badge bg="warning" text="dark">Pendente</Badge>;
            case 'CHECKED_IN': return <Badge bg="success">Presença Confirmada</Badge>;
            case 'COMPLETED': return <Badge bg="success">Concluído</Badge>;
            case 'CANCELED': return <Badge bg="danger">Cancelado</Badge>;
            case 'ABSENT': return <Badge bg="secondary">Ausente</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('pt-BR');
    };

    return (
        <Container className="py-3">
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            <Row className="mb-4">
                <Col md={8} className="mx-auto">
                    <h3 className="text-light mb-5">Meus Eventos</h3>

                    {loading ? (
                        <div className="text-center text-light py-5">
                            <Spinner animation="border" />
                            <p className="mt-2">Sincronizando inscrições...</p>
                        </div>
                    ) : registrations.length === 0 ? (
                        <Alert variant="info" className="alert-dark-variant">
                            Você ainda não possui inscrições.
                            <div className="mt-2">
                                <Button variant="outline-info" size="sm" onClick={() => navigate('/events')}>Ver eventos disponíveis</Button>
                            </div>
                        </Alert>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {registrations.map(registration => (
                                <Card key={registration.id} className="card-modern">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={5}>
                                                <h5 className="text-light mb-1">
                                                    {registration.eventDetails?.eventName || 'Carregando evento...'}
                                                </h5>
                                                <small className="subtitle">
                                                    📅 {formatDate(registration.eventDetails?.eventDate)}
                                                </small>
                                                <div className="mt-2">
                                                    {getStatusBadge(registration.status)}
                                                </div>
                                            </Col>

                                            <Col md={7} className="d-flex justify-content-md-end gap-2 mt-3 mt-md-0 flex-wrap ">
                                                <Button
                                                    className='btn-outline-dark-accent btn-modern px-5'
                                                    size="sm"
                                                    onClick={() => openDetails(registration)}
                                                >
                                                    Detalhes
                                                </Button>

                                                {(registration.status === 'CONFIRMED' || registration.status === 'PENDING') && (
                                                    <Button
                                                        className='btn-outline-dark-danger btn-modern px-5'
                                                        size="sm"
                                                        disabled={processingId === registration.id}
                                                        onClick={() => handleCancel(registration.id)}
                                                    >
                                                        {processingId === registration.id ? '...' : 'Cancelar'}
                                                    </Button>
                                                )}

                                                {(registration.status === 'CHECKED_IN' || registration.status === 'COMPLETED') && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="btn-accent"
                                                        disabled={processingId === registration.id}
                                                        onClick={() => handleGenerateCertificate(registration)}
                                                    >
                                                        {processingId === registration.id ? 'Baixando...' : 'Certificado'}
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))
                            }
                        </div>
                    )}
                </Col>
            </Row>

            {/* --- MODAL DE DETALHES --- */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                contentClassName="card-modern text-light"
                centered
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Detalhes da Inscrição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRegistration && (
                        <div>
                            <div className='mb-2'>
                                <p className='title mb-0'>
                                    Evento
                                </p>
                                <p className="subtitle">
                                    {selectedRegistration.eventDetails?.eventName}
                                </p>
                            </div>

                            <div className='mb-2'>
                                <p className='title mb-0'>
                                    Registration ID
                                </p>
                                <p className='subtitle'>
                                    {selectedRegistration.id}
                                </p>
                            </div>

                            <hr className="border-secondary" />

                            <div className="timeline-simple">
                                <div className="mb-2">
                                    <p className='title mb-0'>
                                        Inscrito em
                                    </p>
                                    <p className='subtitle'>
                                        {formatDate(selectedRegistration.createdAt)}
                                    </p>
                                </div>

                                {selectedRegistration.checkIn && (
                                    <div className="mb-2">
                                        <p className='title mb-0'>
                                            Check-in
                                        </p>
                                        <p className='subtitle'>
                                            {formatDate(selectedRegistration.checkIn)}
                                        </p>
                                    </div>
                                )}

                                {selectedRegistration.status === 'CANCELED' && (
                                    <div className="mb-2">
                                        <p className='title mb-0'>
                                            Cancelado
                                        </p>
                                        <p className='subtitle'>
                                            Sim
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserEventsListPage;