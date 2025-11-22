import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    // Se estiver logado, renderiza as rotas filhas (Outlet)
    // Se não, redireciona para /login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};