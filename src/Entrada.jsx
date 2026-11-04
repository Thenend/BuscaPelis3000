import React, { useState } from 'react';
import { entrar, recuperarContrasena } from './datos';

const traducir = (mensaje = '') => {
    if (/invalid login credentials/i.test(mensaje)) return 'Correo o contraseña incorrectos.';
    if (/email not confirmed/i.test(mensaje)) return 'Falta confirmar el correo: mira tu bandeja de entrada (o la de spam).';
    if (/rate limit/i.test(mensaje)) return 'Demasiados intentos seguidos. Espera unos minutos.';
    return mensaje || 'Algo ha fallado. Inténtalo de nuevo.';
};

// Pantalla para entrar (correo y contraseña). No se pueden crear cuentas desde la web: las crea a mano quien lleva
// el proyecto de Supabase (Authentication → Users → Add user).
const Entrada = () => {
    const [modo, setModo] = useState('entrar'); // 'entrar' | 'recuperar'
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [aviso, setAviso] = useState('');

    const enviar = async (e) => {
        e.preventDefault();
        setOcupado(true); setAviso('');
        try {
            if (modo === 'entrar') await entrar(email.trim(), contrasena);
            else {
                await recuperarContrasena(email.trim());
                setAviso('Si hay una cuenta con ese correo, te llegará un enlace para entrar y cambiar la contraseña.');
            }
        } catch (err) {
            setAviso(traducir(err.message));
        } finally {
            setOcupado(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-4xl font-extrabold text-center mb-2">🎬 BuscaPelis 3000</h1>
                <p className="text-center text-gray-400 mb-6">Busca y organiza las películas y series que ver.</p>
                <form onSubmit={enviar} className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 shadow-2xl">
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" autoComplete="email"
                        className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {modo !== 'recuperar' && (
                        <input type="password" required minLength={6} value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña"
                            autoComplete="current-password"
                            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    )}
                    <button type="submit" disabled={ocupado} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-full shadow-lg">
                        {ocupado ? 'Un momento…' : modo === 'entrar' ? 'Entrar' : 'Enviar enlace'}
                    </button>
                    {aviso && <p className="text-sm text-yellow-300 text-center">{aviso}</p>}
                    {modo === 'entrar' && (<>
                        <button type="button" onClick={() => { setModo('recuperar'); setAviso(''); }} className="text-sm text-gray-400 hover:text-gray-200 underline">
                            He olvidado la contraseña
                        </button>
                        <p className="text-xs text-gray-500 text-center">¿Aún no tienes cuenta? Pídesela a quien te ha pasado la web.</p>
                    </>)}
                    {modo === 'recuperar' && (
                        <button type="button" onClick={() => { setModo('entrar'); setAviso(''); }} className="text-sm text-gray-400 hover:text-gray-200 underline">
                            Volver
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Entrada;
