import { toast, ToasterProps } from 'sonner';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions extends Omit<ToasterProps, 'children'> {
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const showToast = (message: string, options?: ToastOptions) => {
    const { description, variant = 'default', ...rest } = options || {};
    
    if (variant === 'success') {
      toast.success(message, { description, ...rest });
    } else if (variant === 'destructive') {
      toast.error(message, { description, ...rest });
    } else {
      toast(message, { description, ...rest });
    }
  };

  return { toast: showToast };
}