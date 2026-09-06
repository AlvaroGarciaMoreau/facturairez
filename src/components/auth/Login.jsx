import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpeg';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <img
            className="h-24 w-auto object-contain rounded"
            src={logo}
            alt="Facturairez Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Facturairez
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Facturación
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
