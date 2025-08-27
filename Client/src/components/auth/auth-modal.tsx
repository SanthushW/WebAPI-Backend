import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { } from '@/types/shared';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultMode !== 'register');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'operator' as const,
  });

  const { login, register, isLoading, loginError, registerError } = useAuth();
  const { toast } = useToast();

  // Keep tab in sync with requested default when reopened or changed
  if (!isLogin && defaultMode === 'login' && isOpen) {
    // no-op state sync is fine; avoid extra effects
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = formData.username.trim();
    const password = formData.password.trim();

    if (username.length < 3 || password.length < 6) {
      toast({
        title: 'Invalid credentials',
        description: 'Username must be at least 3 chars and password at least 6 chars.',
        variant: 'destructive' as any,
      });
      return;
    }

    try {
      if (isLogin) {
        await login({ username, password });
        toast({
          title: "Login successful",
          description: "Welcome to the bus tracking system!",
        });
      } else {
        await register({ username, password, role: formData.role });
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully!",
        });
      }
      onClose();
    } catch (error) {
      // Error handling is done by the mutations
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  const currentError = isLogin ? loginError : registerError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Operator Authentication</h2>
          <p className="text-sm text-gray-600 mt-1">Access the bus tracking system</p>
        </div>

        <div className="p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center border-b-2 font-medium transition-colors ${
                isLogin 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              data-testid="tab-login"
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center border-b-2 font-medium transition-colors ${
                !isLogin 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              data-testid="tab-register"
            >
              Register
            </button>
          </div>

          {currentError && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
              <p className="text-sm text-error-600">{currentError.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* No name fields required */}

            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent peer"
                placeholder=" "
                required
                data-testid="input-username"
              />
              <label className="absolute text-sm text-gray-500 transform -translate-y-4 scale-75 top-2 left-3 bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-primary-600 transition-all">
                Username
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent peer"
                placeholder=" "
                required
                minLength={6}
                data-testid="input-password"
              />
              <label className="absolute text-sm text-gray-500 transform -translate-y-4 scale-75 top-2 left-3 bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-primary-600 transition-all">
                Password
              </label>
            </div>

            {!isLogin && (
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  data-testid="select-role"
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || formData.username.trim().length < 3 || formData.password.trim().length < 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              data-testid="button-submit"
            >
              {isLoading ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
