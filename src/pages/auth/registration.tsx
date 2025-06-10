import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch,useSelector } from 'react-redux';
import type { RootState , AppDispatch } from '@/REDUX/store';
import { register } from '@/REDUX/reducers/authSlice';


const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

type FormValues = z.infer<typeof registrationSchema>;

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <Field name={name}>
        {({ field, meta }: any) => (
          <input
            {...field}
            id={name}
            type={showPasswordToggle && showPassword ? 'text' : type}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'pl-3'} ${showPasswordToggle ? 'pr-10' : 'pr-3'} py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              meta.touched && meta.error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
          />
        )}
      </Field>
      {showPasswordToggle && (
        <Button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      )}
    </div>
    <ErrorMessage name={name}>
      {(msg) => <p className="text-sm text-red-600 mt-1">{msg}</p>}
    </ErrorMessage>
  </div>
);

const RegistrationForm: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  

    const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);



  const initialValues: FormValues = {
    username: '',
    email: '',
    password: ''
  };

  const validateForm = (values: FormValues) => {
    try {
      registrationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        return errors;
      }
      return {};
    }
  };

const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
  try {
    const response = await dispatch(register({
      name: values.username,
      email: values.email,
      password: values.password
    }));

    if (register.fulfilled.match(response)) {
      console.log('Registration successful:', response.payload);
      setIsSubmitted(true);
      navigate('/'); 
    } else {
      console.error('Registration failed:', response.payload);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your details to create your new account
          </CardDescription>
        </CardHeader>
        <CardContent>
                      <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, handleSubmit: formikHandleSubmit }) => (
              <div className="space-y-4">
                <FormField
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  icon={<User size={20} />}
                />

                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={<Mail size={20} />}
                />

                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  icon={<Lock size={20} />}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                {/* Password strength indicator */}
                {values.password && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center space-x-2 ${values.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${values.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>At least 6 characters</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/[A-Z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/[a-z]/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${/\d/.test(values.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/\d/.test(values.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    formikHandleSubmit();
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 py-2 px-4 rounded-lg text-white font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Button
                    variant={"link"}
                      onClick={() => navigate('/login')}
                      type="button"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign in
                    </Button>
                  </p>
                </div>
              </div>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;