import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Plus, FileText } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const Navbar = ({ onNewInvoice, onNewInvoiceOcr }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto rounded"
                src={logo}
                alt="Facturairez"
              />
              <span className="ml-3 font-semibold text-xl text-gray-900 hidden sm:block">
                Facturairez
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onNewInvoiceOcr}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              Factura OCR
            </button>
            <button
              onClick={onNewInvoice}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </button>
            
            <div className="flex items-center border-l border-gray-200 pl-4">
              <div className="flex flex-col items-end mr-3 hidden sm:flex">
                <span className="text-sm font-medium text-gray-700">{user?.displayName || 'Usuario'}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              {user?.photoURL ? (
                <img className="h-8 w-8 rounded-full" src={user.photoURL} alt="Avatar" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              )}
              <button
                onClick={logout}
                className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
