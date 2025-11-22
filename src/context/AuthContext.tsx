import React, { useState, useEffect, useContext } from 'react';
import AuthService from '../api/authService';
import UserService from '../api/userService';
import type { LoginPayload, AuthContextType } from '../types/auth';
import type { UserData } from '../types/user';

// Criação do Contexto
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personalizado para consumir o contexto de autenticação global.
 * @returns O objeto de contexto contendo estado e funções de auth.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

/**
 * Componente Provedor de Autenticação.
 * É responsável por gerir o estado de autenticação e expor as funções de login/logout.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estado REAL, que será lido por toda a aplicação
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
    const [user, setUser] = useState<UserData | null>(null);

    const login = async (payload: LoginPayload) => {
        try {
            await AuthService.login(payload);
            setIsAuthenticated(true); // Atualiza o estado global
        } catch (error) {
            console.error("Erro no login:", error);
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false); // Atualiza o estado global

    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const userData: UserData = await UserService.me();
                    setUser(userData);
                } catch (error) {
                    console.error("Erro ao obter dados do usuário:", error);
                    logout();
                }
            } else {
                setUser(null);
            }
        };

        fetchUserData();
    }, [isAuthenticated]);
    
    const updateUser = (data: Partial<UserData>) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            return { ...prevUser, ...data };
        });
    };

    // Adicione updateUser no value
    const value = { isAuthenticated, user, login, logout, updateUser };

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );
};