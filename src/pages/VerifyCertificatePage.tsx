import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import ToastNotification from '../components/ToastNotification';
import type { Certificate } from '../types/certificate';
import RegistrationService from '../api/registrationService';

const VerifyCertificatePage: React.FC = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [processingDownload, setProcessingDownload] = useState<boolean | null>(null);
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        setCertificate(null);
        setLoading(true);

        try {
            const certificate = await RegistrationService.getCertificateByAuthenticationCode(code)

            setCertificate(certificate);
        } catch {
            setToastInfo({ show: true, msg: 'Não foi possível verificar este certificado. Confira o código e tente novamente.', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setProcessingDownload(true)
        try {
            await RegistrationService.downloadCertificate(certificate!.authenticationCode);
            setToastInfo({ show: true, msg: 'Certificado baixado com sucesso!', variant: 'success' });
        } catch (err) {
            console.error(err);
            const errorMsg = err.data.message || 'Erro ao baixar certificado.';
            setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
        } finally {
            setProcessingDownload(false)
        }
    };

    return (
        <Container fluid>
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            <Row className="w-100 justify-content-center mt-3">
                <Col md={8} lg={6}>
                    <div className="text-center mb-5">
                        <h1 className="title">Validação de Certificados</h1>
                        <p className="subtitle">Insira o código de autenticação presente no certificado para confirmar sua validade.</p>
                    </div>

                    <Card className="card-modern">
                        <Card.Body className="p-4">
                            <Form onSubmit={handleVerify} className='mb-2'>
                                <Form.Group className="mb-5" controlId="formCode">
                                    <Form.Label className="form-field-label mb-3">Código de Autenticação (authenticationCode)</Form.Label>
                                    <Form.Control
                                        className='form-control-modern'
                                        type="text"
                                        placeholder="Ex: a67ce7d7-02ca-..."
                                        size="lg"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button size="lg" type="submit" disabled={loading} className='btn-modern btn-accent'>
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                {' '}Verificando...
                                            </>
                                        ) : 'Verificar Autenticidade'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Exibição de Sucesso (Certificado Válido) */}
                    {certificate && (
                        <Card className="border-success shadow border-2 mt-5">
                            <Card.Header className="bg-success text-white text-center fw-bold py-3">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                CERTIFICADO VÁLIDO
                            </Card.Header>
                            <Card.Body className="p-4 text-center">

                                <Button onClick={handleDownload} className='btn-outline-dark-accent btn-modern'>

                                    {processingDownload ? 'Baixando...' : 'Baixar Certificado'}
                                </Button>
                            </Card.Body>
                        </Card>
                    )}

                </Col>
            </Row>
        </Container>
    );
};

export default VerifyCertificatePage;