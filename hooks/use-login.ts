'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { validate } from 'email-validator';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean; name: boolean }>({
    email: false,
    password: false,
    name: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      toast.success(`Selamat datang, ${session.user.name || 'User'}!`);
      const role = session.user.role;
      if (role === 'ADMIN') router.push('/dashboard');
      else if (role === 'USER') router.push('/');
      else router.push('/');
    }
  }, [status, session, router]);

  const handleValidation = useCallback(() => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    let isValid = true;

    // Validasi email jika sudah touched
    if (touched.email && !validate(email)) {
      newErrors.email = 'Email tidak valid.';
      isValid = false;
    }

    // Validasi password jika sudah touched
    if (touched.password) {
      const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
      if (password.length < 7) {
        newErrors.password = 'Password harus minimal 7 karakter.';
        isValid = false;
      } else if (!validPassword) {
        newErrors.password = 'Password harus mengandung huruf dan angka.';
        isValid = false;
      }
    }

    // Validasi name jika signup dan sudah touched
    if (!isLogin && touched.name && name.length < 3) {
      newErrors.name = 'Nama harus minimal 3 karakter.';
      isValid = false;
    }

    setErrors(newErrors);
    setDisabled(!isValid);
  }, [email, password, name, isLogin, touched]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  const handleBlur = (field: 'email' | 'password' | 'name') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrors({});

    // Validasi sebelum submit
    const newErrors: { email?: string; password?: string; name?: string } = {};
    if (!validate(email)) newErrors.email = 'Email tidak valid.';
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    if (password.length < 7) newErrors.password = 'Password harus minimal 7 karakter.';
    else if (!validPassword) newErrors.password = 'Password harus mengandung huruf dan angka.';
    if (!isLogin && name.length < 3) newErrors.name = 'Nama harus minimal 3 karakter.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error(jsonError);
        throw new Error(`Server returned invalid response: ${res.statusText}`);
      }

      if (!res.ok) {
        toast.error(data.error || 'Signup gagal');
        throw new Error(data.error || 'Signup gagal');
      }

      toast.success('Pendaftaran berhasil! Silakan login.');
      await handleLogin();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal.';
      setErrors({ email: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});

    // Validasi sebelum submit
    const newErrors: { email?: string; password?: string } = {};
    if (!validate(email)) newErrors.email = 'Email tidak valid.';
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    if (password.length < 7) newErrors.password = 'Password harus minimal 7 karakter.';
    else if (!validPassword) newErrors.password = 'Password harus mengandung huruf dan angka.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error || !result?.ok) {
      let message = 'Login gagal. Periksa email dan password.';
      if (result?.error === 'CredentialsSignin') {
        message = 'Email atau password salah.';
      }
      setErrors({ email: message });
      toast.error(message);
    } else {
      toast.success(`Selamat datang, ${email}!`);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  const handleGoogleSignIn = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrors({});
    setTouched({ email: false, password: false, name: false });
    signIn('google', { callbackUrl: '/' });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    setTouched,
    name,
    setName,
    isLogin,
    setIsLogin,
    errors, setErrors,
    isLoading,
    disabled,
    handleSubmit,
    handleGoogleSignIn,
    handleBlur,
  };
};