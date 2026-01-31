import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { Mail, Eye, EyeOff } from 'lucide-react';

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentEmail?: string;
}

export default function ChangeEmailDialog({ isOpen, onClose, onSuccess, currentEmail }: ChangeEmailDialogProps) {
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Валидация
    if (!newEmail || !password) {
      setError(t('settings.errors.allFieldsRequired'));
      return;
    }

    if (!validateEmail(newEmail)) {
      setError(t('settings.errors.invalidEmail'));
      return;
    }

    if (newEmail === currentEmail) {
      setError(t('settings.errors.sameEmail'));
      return;
    }

    setIsLoading(true);

    try {
      await authService.changeEmail(newEmail, password);
      setSuccessMessage(t('settings.success.emailChanged'));
      setNewEmail('');
      setPassword('');
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error changing email:', err);
      setError(err.response?.data?.message || t('settings.errors.emailChangeFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('settings.changeEmail')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          {currentEmail && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-sm">
              <p className="text-gray-600">{t('settings.currentEmail')}: <span className="font-medium text-gray-900">{currentEmail}</span></p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newEmail">{t('settings.newEmail')}</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.email@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('settings.passwordConfirm')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('settings.enterPasswordToConfirm')}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
