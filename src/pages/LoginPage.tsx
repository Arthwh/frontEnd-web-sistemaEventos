import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { LoginPayload, BackendError } from '../types/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import ToastNotification from '../components/ToastNotification';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginPayload>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });


    const navigate = useNavigate();

    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            navigate('/events');
        } catch (err) {
            const axiosError = err as AxiosError;
            let errorMessage = 'Falha no login. Verifique suas credenciais.';

            if (axiosError.response) {
                const errorData = axiosError.response.data as BackendError;
                if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = `Erro ${axiosError.response.status}: Falha ao processar solicitação.`;
                }
            }
            setToastInfo({ show: true, msg: errorMessage, variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            fluid
            className="d-flex flex-column flex-grow-1 justify-content-center m-0 py-5"
        >
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>

                    <Card className="shadow-lg p-4 card-modern">
                        <Card.Body>
                            <h2 className="text-center mb-4 text-light">Acessar Conta</h2>

                            <Form onSubmit={handleSubmit}>
                                {/* Email */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="form-field-label">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-control-modern"
                                    />
                                </Form.Group>

                                {/* Senha */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="form-field-label">Senha</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="form-control-modern"
                                    />
                                </Form.Group>

                                <Button type="submit" disabled={loading} className="w-100 my-5 btn-modern btn-accent">
                                    {loading ? 'Acessando...' : 'Entrar'}
                                </Button>

                                <p className="mt-3 text-center text-light">
                                    <Link to="/password-recovery" className="text-modern-link">Esqueci minha senha</Link>
                                </p>
                                <p className="mt-3 text-center text-light">
                                    Não tem conta? <Link to="/register" className="text-modern-link">Cadastre-se aqui</Link>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;