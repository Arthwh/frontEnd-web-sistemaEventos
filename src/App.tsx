import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import EventsListPage from './pages/EventsListPage';
import UserProfilePage from './pages/UserProfilePage';
import UserEventsListPage from './pages/UserEventsListPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <section className="d-flex flex-column flex-grow-1 m-5">
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/" element={<HomePage />} />

            {/* --- ROTAS PRIVADAS --- */}
            {/* Tudo que estiver dentro deste Route será protegido */}
            <Route element={<PrivateRoute />}>
              <Route path="/events" element={<EventsListPage />} />
              <Route path="/me" element={<UserProfilePage />} />
              <Route path="/me/events" element={<UserEventsListPage />} />
              {/* <Route path="/meus-eventos" element={<MyRegistrationsPage />} /> */}
            </Route>
          </Routes>
        </section>
        <Footer />
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App
