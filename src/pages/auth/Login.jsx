import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/apiService';
import { notificationHelpers } from '../../utils/notifications';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signIn(email, password);
      notificationHelpers.success('Login successful! Welcome back.');
      navigate('/dashboard-overview');
    } catch (err) {
      setError(err.message);
      notificationHelpers.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary rounded-xl mb-4">
            <Icon name="Package" size={24} color="white" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to continue managing your business.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          
          <Button type="submit" fullWidth size="lg" loading={loading} disabled={loading}>
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;