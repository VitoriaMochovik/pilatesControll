import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop com cor cinza bem suave */}
      <div 
        className="fixed inset-0 z-40" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        onClick={onCancel} 
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full pointer-events-auto border-2 border-black">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium disabled:opacity-50 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {isLoading ? 'Excluindo...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};