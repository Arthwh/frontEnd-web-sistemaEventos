import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
    const { isAuthenticated } = useAuth();

    // Se já estiver logado, redireciona para a Home/Eventos
    // O "replace" impede que ele clique em "Voltar" e caia no login de novo
    return isAuthenticated ? <Navigate to="/events" replace /> : <Outlet />;
};