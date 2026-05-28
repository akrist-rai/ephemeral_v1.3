import React from 'react';

interface ToastProps {
  message: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, show }) => (
  <div className={`toast ${show ? 'show' : ''}`} id="ephemeral-toast">
    {message}
  </div>
);
