import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastNotificationProps {
    show: boolean;
    onClose: () => void;
    message: string;
    variant?: 'success' | 'danger' | 'warning' | 'info';
    title?: string;
    position?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
    show,
    onClose,
    message,
    variant = 'success',
    title,
    position = 'bottom-end'
}) => {
    return (
        <ToastContainer className="p-3" position={position} style={{ zIndex: 9999 }}>
            <Toast
                onClose={onClose}
                show={show}
                delay={5000}
                autohide
                bg={variant}
            >
                <Toast.Header closeButton={true}>
                    <strong className="me-auto">
                        {title || (variant === 'success' ? 'Sucesso' : 'Atenção')}
                    </strong>
                </Toast.Header>
                <Toast.Body className="text-white">
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastNotification;