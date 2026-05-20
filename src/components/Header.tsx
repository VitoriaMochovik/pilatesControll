import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium"
            >
              Sair
            </button>
          )}
        </div>
        {subtitle && (
          <p className="mt-3 text-white text-xl font-semibold">{subtitle}</p>
        )}
      </div>
    </header>
  );
};
