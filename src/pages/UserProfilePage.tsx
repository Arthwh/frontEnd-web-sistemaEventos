/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import type { UserUpdatePayload } from '../types/user';
import UserService from '../api/userService';
import ToastNotification from '../components/ToastNotification';

const UserProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastInfo, setToastInfo] = useState<{
        show: boolean;
        msg: string;
        variant: 'success' | 'danger' | 'warning' | 'info';
    }>({ show: false, msg: '', variant: 'success' });

    const [formData, setFormData] = useState<UserUpdatePayload>({
        fullname: '',
        birth_date: '',
    });

    // Sincroniza o formulário com os dados do usuário ao carregar
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                birth_date: user.birthDate || '',
            });
        }
    }, [user]);

    // --- HANDLERS ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await UserService.update(user!.id, formData);

            // Atualiza na tela/memória do navegador
            updateUser({
                fullname: formData.fullname,
                birthDate: formData.birth_date
            });

            setIsEditing(false);
            setToastInfo({ show: true, msg: 'Dados atualizados com sucesso!', variant: 'success' });

        } catch (err: any) {
            console.error("Erro ao atualizar:", err);
            const errorMsg = err.response.data?.message || 'Erro ao atualizar perfil.';
            setToastInfo({ show: true, msg: errorMsg, variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    // --- HELPERS DE FORMATAÇÃO ---
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatRoleName = (roleName: string) => {
        return roleName.replace('ROLE_', '').toUpperCase();
    };

    return (
        <Container className="py-5">
            <ToastNotification
                show={toastInfo.show}
                message={toastInfo.msg}
                variant={toastInfo.variant}
                onClose={() => setToastInfo({ ...toastInfo, show: false })}
            />

            <Row className="justify-content-center">
                <Col lg={10}>

                    <Card className="card-modern mb-4">
                        <Card.Body className="p-4 p-md-5">
                            <Row className="align-items-center">
                                <Col md={3} className="text-center mb-3 mb-md-0">
                                    <div
                                        className="rounded-circle bg-gradient text-white d-flex justify-content-center align-items-center mx-auto shadow"
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            fontSize: '3rem',
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)'
                                        }}
                                    >
                                        {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </Col>
                                <Col md={9}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            {isEditing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleChange}
                                                    className="form-control-modern fs-4 mb-2"
                                                />
                                            ) : (
                                                <h2 className="fw-bold text-light mb-1">{user?.fullname}</h2>
                                            )}

                                            <p className="text-light opacity-75 mb-2">{user?.email}</p>

                                            <div className="d-flex gap-2 mt-2">
                                                {user?.roles?.map((role: any) => (
                                                    <Badge key={role.id} bg="info" className="px-3 py-2">
                                                        {formatRoleName(role.name)}
                                                    </Badge>
                                                ))}
                                                {user?.complete && <Badge bg="success" className="px-3 py-2">Cadastro Completo</Badge>}
                                            </div>
                                        </div>

                                        <Button
                                            variant={isEditing ? "outline-danger" : "outline-light"}
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`${isEditing ? "btn-outline-dark-danger" : "btn-outline-dark-accent"} btn-modern px-5`}
                                            disabled={loading}
                                        >
                                            {isEditing ? 'Cancelar' : 'Editar Perfil'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row>
                        <Col md={6} className="mb-4">
                            <Card className="card-modern">
                                <Card.Header className="bg-transparent border-secondary pt-4 px-4">
                                    <h5 className="title">Dados Pessoais</h5>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">

                                    <div className="mb-4">
                                        <label className="text-uppercase fw-bold title mb-1">CPF</label>
                                        <div className="subtitle">
                                            {user?.cpf || 'Não informado'}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-uppercase fw-bold title mb-1">Data de Nascimento</label>
                                        {isEditing ? (
                                            <Form.Control
                                                type="date"
                                                name="birth_date"
                                                value={formData.birth_date}
                                                onChange={handleChange}
                                                className="form-control-modern"
                                            />
                                        ) : (
                                            <div className="subtitle">
                                                {formatDate(user?.birthDate)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-0">
                                        <label className="text-uppercase fw-bold title mb-1">Email</label>
                                        <div className="subtitle">
                                            {user?.email}
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6} className="mb-4">
                            <Card className="card-modern">
                                <Card.Header className="bg-transparent border-secondary pt-4 px-4">
                                    <h5 className="text-light mb-0">Informações da Conta</h5>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">

                                    <div className="mb-4">
                                        <label className="text-uppercase fw-bold title mb-1">ID do Usuário</label>
                                        <div className="subtitle">
                                            {user?.id}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-uppercase fw-bold title mb-1">Conta criada em</label>
                                        <div className="subtitle">
                                            {formatDateTime(user?.createdAt)}
                                        </div>
                                    </div>

                                    <div className="mb-0">
                                        <label className="text-uppercase fw-bold title mb-1">Status da Conta</label>
                                        <div>
                                            <Badge bg="success" className="me-2">Ativa</Badge>
                                            <Badge bg="secondary">Sem restrições</Badge>
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* --- BOTÃO DE SALVAR --- */}
                    {isEditing && (
                        <div className="fixed-bottom p-4 bg-dark border-top border-secondary d-flex justify-content-end gap-3" style={{ zIndex: 100 }}>
                            <span className="align-self-center ms-4 d-none d-md-block title">
                                Você tem alterações não salvas
                            </span>
                            <Button
                                variant="outline-primary"
                                onClick={handleSave}
                                disabled={loading}
                                className="px-5 btn-outline-dark-accent btn-modern"
                            >
                                {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Alterações'}
                            </Button>
                        </div>
                    )}

                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;