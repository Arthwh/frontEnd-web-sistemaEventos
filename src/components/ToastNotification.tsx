import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastNotificationProps {
    show: boolean;
    onClose: () => void;
    message: string;
    variant?: 'success' | 'danger' | 'warning' | 'info';
    title?: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
    show,
    onClose,
    message,
    variant = 'success',
    title
}) => {
    return (
        <ToastContainer
            className="p-3 position-fixed bottom-0 end-0"
            style={{ zIndex: 9999 }}
            position="bottom-end"
        >
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