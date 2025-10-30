// hooks/useNotification.js
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotification = () => {
  const notify = useCallback((message, type = 'info') => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastConfig);
        break;
      case 'warning':
        toast.warning(message, toastConfig);
        break;
      case 'error':
        toast.error(message, toastConfig);
        break;
      case 'info':
        toast.info(message, toastConfig);
        break;
      default:
        toast(message, toastConfig);
    }
  }, []);

  const notifyAndDelay = useCallback(async (message, type = 'info', delay = 1500) => {
    notify(message, type);
    await new Promise(resolve => setTimeout(resolve, delay));
  }, [notify]);

  return { notify, notifyAndDelay };
};