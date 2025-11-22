import React, { useState } from 'react';
import AuthService from '../api/authService';
import type { RegisterPayload, BackendError } from '../types/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import ToastNotification from '../components/ToastNotification';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterPayload>({
        cpf: '',
        fullname: '',
        email: '',
        password: '',
        birth_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthService.register(formData);
            // Redireciona para o login após sucesso

            navigate('/login', { state: { successMessage: 'Cadastro realizado com sucesso!' } });
        } catch (err) {
            const axiosError = err as AxiosError;
            let errorMessage = 'Erro no cadastro. Tente novamente.';

            if (axiosError.response) {
                const errorData = axiosError.response.data as BackendError;

                if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = `Erro ${axiosError.response.status}: Falha ao processar solicitação.`;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="d-flex flex-column flex-grow-1 justify-content-center m-0 py-5">
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>

                    <Card className="shadow-lg p-4 card-modern d-flex flex-column">
                        <Card.Body>
                            <h2 className="text-center mb-4 text-white">Criar Conta</h2>

                            {error && <Alert variant="danger" className="alert-dark-variant">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-field-label">CPF</Form.Label>
                                    <Form.Control type="text" name="cpf" value={formData.cpf} onChange={handleChange} required className="form-control-modern" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-field-label">Nome Completo</Form.Label>
                                    <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} required className="form-control-modern" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-field-label">Email</Form.Label>
                                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control-modern" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-field-label">Senha</Form.Label>
                                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required className="form-control-modern" />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="form-field-label">Data de Nascimento</Form.Label>
                                    <Form.Control type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required className="form-control-modern" />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={loading} className="w-100 my-5 btn-modern btn-accent">
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </Button>

                                <p className="mt-3 text-center text-light">
                                    Já tem conta? <Link to="/login" className="text-modern-link">Fazer Login</Link>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;