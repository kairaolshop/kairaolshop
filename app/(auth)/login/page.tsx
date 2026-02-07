'use client';

import Image from 'next/image';
import { BiShoppingBag } from 'react-icons/bi';
import { useLogin } from '@/hooks/use-login';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignInPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLogin,
    setIsLogin,
    errors,
    setErrors,
    setTouched,
    isLoading,
    disabled,
    handleSubmit,
    handleGoogleSignIn,
    handleBlur,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center md:px-40 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Image
            alt="Lubna Fashion logo"
            className="w-10 h-auto"
            height={34}
            src="/Image/lubna.png"
            width={34}
            priority
          />
          <span className="text-[#f05a28] font-bold text-xl hidden xl:block select-none">
            Lubna Fashion
          </span>
        </div>
        <a className="text-[#f05a28] text-sm select-none" href="#">
          Butuh bantuan?
        </a>
      </header>

      {/* MAIN CONTENT */}
      <main className="bg-[#ee4d2d] flex flex-col justify-center items-center py-10 md:py-20 px-4">
        <div className="bg-transparent rounded-lg w-full max-w-5xl flex grid-col-2 gap-x-20 md:flex-row overflow-hidden">
          {/* BAGIAN KIRI - GAMBAR */}
          <section className="hidden md:flex flex-col justify-center items-center p-8 flex-1">
            <Image
              alt="Logo toko online"
              className="mb-4 w-100 h-auto drop-shadow-[0_0_8px_#ffffff]"
              height={120}
              src="/Image/lubna.png"
              width={120}
            />
            <div className="text-white flex items-center text-sm select-none text-center">
              <BiShoppingBag className="h-8 w-8 mr-4" /> Lebih Hemat Lebih Cepat
            </div>
          </section>

          {/* BAGIAN KANAN - FORM */}
          <section className="p-8 flex-1 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {isLogin ? 'Log In' : 'Sign Up'}
            </h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Nama
                  </label>
                  <input
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    id="name"
                    type="text"
                    placeholder="Nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    required={!isLogin}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  className={`w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/3 translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                className="w-full bg-[#ee4d2d] text-lg text-white p-3 rounded-md font-semibold hover:bg-[#ff8248] disabled:bg-gray-400"
                type="submit"
                disabled={isLoading || disabled}
              >
                {isLoading ? 'Memproses...' : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <div className="flex items-center justify-center my-6">
              <span className="text-lg text-gray-500">
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              </span>
              <button
                className="ml-2 text-blue-500 font-semibold hover:text-blue-700"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName('');
                  setEmail('');
                  setPassword('');
                  setErrors({});
                  setTouched({ email: false, password: false, name: false });
                }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>

            <div className="flex items-center mb-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="text-sm text-gray-400 mx-3 select-none">ATAU</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 p-3 rounded-md font-semibold hover:bg-gray-50"
            >
              <Image src="/google-icon.svg" alt="Google Icon" width={24} height={24} className="mr-2" />
              Login dengan Google
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}