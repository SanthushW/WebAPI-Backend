import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { } from '@/types/shared';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { login, isLoading, loginError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ username: formData.username, password: formData.password });
      toast({
        title: "Login successful",
        description: "Welcome to the bus tracking system!",
      });
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-white text-2xl">directions_bus</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">BusTracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            National Transport Commission
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Sign in to your operator account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginError && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-md">
              <p className="text-sm text-error-600">{loginError.message}</p>
            </div>
          )}

          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            data-testid="button-login"
          >
            {isLoading ? (
              <LoadingSpinner className="w-5 h-5" />
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-medium text-primary-600 hover:text-primary-500"
                data-testid="link-register"
              >
                Contact your administrator
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
