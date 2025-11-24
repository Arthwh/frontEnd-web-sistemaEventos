import React, { useState } from 'react';
import AuthService from '../api/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import ToastNotification from '../components/ToastNotification';

// Tipagem dos dados do formulário
interface RecoveryFormData {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

const PasswordRecoveryPage: React.FC = () => {
    // Estado para controlar em qual passo o usuário está:
    // 1 = Inserir email
    // 2 = Inserir Código de Verificação
    // 3 = Inserir Nova Senha
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [token, setToken] = useState<string>('');

    const [formData, setFormData] = useState<RecoveryFormData>({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Helper para mostrar erros
    const handleError = (err: unknown) => {
        const axiosError = err as AxiosError;
        let errorMessage = 'Ocorreu um erro. Tente novamente.';

        if (axiosError.response) {
            // Ajuste conforme o tipo de erro do seu backend
            const errorData = axiosError.response.data as any;
            errorMessage = errorData?.message || `Erro ${axiosError.response.status}`;
        }
        setToastInfo({ show: true, msg: errorMessage, variant: 'danger' });
    };

    // --- AÇÕES DOS PASSOS ---

    // Passo 1: Enviar email para receber o código
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await AuthService.requestPasswordRecovery(formData.email);

            setToastInfo({ show: true, msg: 'Código enviado para seu e-mail!', variant: 'success' });
            setStep(2); // Avança para o próximo passo
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    // Validar o código recebido
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await AuthService.validateRecoveryCode(formData.email, formData.code);
            setToken(data);

            setToastInfo({ show: true, msg: 'Código validado com sucesso.', variant: 'success' });
            setStep(3); // Avança para o próximo passo
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    // Definir nova senha
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setToastInfo({ show: true, msg: 'As senhas não coincidem.', variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            await AuthService.resetPassword(formData.email, token!, formData.newPassword);

            setToastInfo({ show: true, msg: 'Senha alterada com sucesso! Redirecionando...', variant: 'success' });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            handleError(err);
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
                    <Card className="shadow-lg p-4 card-modern">
                        <Card.Body>
                            <h2 className="text-center mb-4 text-light">Recuperar Senha</h2>

                            {/* --- PASSO 1 --- */}
                            {step === 1 && (
                                <Form onSubmit={handleRequestCode}>
                                    <p className="text-light text-center mb-4">
                                        Informe seu e-mail para receber um código de verificação
                                    </p>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="form-field-label">Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder="teste@teste.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="form-control-modern"
                                        />
                                    </Form.Group>
                                    <Button type="submit" disabled={loading} className="w-100 my-4 btn-modern btn-accent">
                                        {loading ? 'Enviando...' : 'Enviar Código'}
                                    </Button>
                                </Form>
                            )}

                            {/* --- PASSO 2 --- */}
                            {step === 2 && (
                                <Form onSubmit={handleVerifyCode}>
                                    <p className="text-light text-center mb-4">
                                        Insira o código enviado para o seu e-mail.
                                    </p>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="form-field-label">Código de Verificação</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            placeholder="Ex: 123456"
                                            value={formData.code}
                                            onChange={handleChange}
                                            required
                                            className="form-control-modern"
                                        />
                                    </Form.Group>
                                    <Button type="submit" disabled={loading} className="w-100 my-4 btn-modern btn-accent">
                                        {loading ? 'Validando...' : 'Validar Código'}
                                    </Button>
                                    <div className="text-center">
                                        <Button variant="link" className="text-modern-link sm" onClick={() => setStep(1)}>
                                            Voltar / Reenviar
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            {/* --- PASSO 3 --- */}
                            {step === 3 && (
                                <Form onSubmit={handleResetPassword}>
                                    <p className="text-light text-center mb-4">
                                        Crie uma nova senha para sua conta.
                                    </p>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="form-field-label">Nova Senha</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            className="form-control-modern"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="form-field-label">Confirmar Senha</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="form-control-modern"
                                        />
                                    </Form.Group>
                                    <Button type="submit" disabled={loading} className="w-100 my-4 btn-modern btn-accent">
                                        {loading ? 'Alterando...' : 'Confirmar Alteração'}
                                    </Button>
                                </Form>
                            )}

                            <p className="mt-2 text-center text-light">
                                Lembrou a senha? <Link to="/login" className="text-modern-link">Voltar para Login</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PasswordRecoveryPage;