import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import validator from 'validator';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import PasswordStrength from '@/components/PasswordStrength';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, loginUser, registerUser } = useAuthStore();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!validator.isEmail(email)) errors.email = 'Please enter a valid email.';
    if (!isLogin && name.trim().length < 3) errors.name = 'Name must be at least 3 characters.';
    if (!isLogin && !role) errors.role = 'Please select a role.';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (isLogin) {
        await loginUser({ email, password });
        toast.success('Login successful!');
        navigate('/');
      } else {
        await registerUser({ name, email, password, role });
        toast.success('Registration successful!');
        setIsLogin(true);
      }
    } catch (error) {
      const message = (error as any)?.response?.data?.message || 'Authentication failed';
      toast.error(message);
    }
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setFormErrors({});
    setEmail('');
    setName('');
    setPassword('');
    setRole('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <Input
                  autoFocus
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <Input
                autoFocus={isLogin}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>

            {!isLogin && (
              <div className="relative">
                <MdWork className="absolute top-3 left-3 text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
                {formErrors.role && <p className="text-red-500 text-sm">{formErrors.role}</p>}
              </div>
            )}

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
              {!isLogin && password && <PasswordStrength password={password} />}
            </div>

            <Button
              type="submit"
              disabled={Object.keys(validateForm()).length > 0 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={toggleFormMode}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              Continue with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
