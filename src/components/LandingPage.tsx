import React from 'react';
import { Activity, Heart, Brain, Settings as Lungs, Apple, Moon, Watch, Coffee, Cigarette, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const healthTips = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Pantau Tekanan Darah',
      description: 'Periksa tekanan darah secara teratur dan catat hasilnya',
    },
    {
      icon: <Apple className="h-8 w-8 text-green-500" />,
      title: 'Pola Makan Sehat',
      description: 'Kurangi garam, konsumsi banyak sayur dan buah',
    },
    {
      icon: <Watch className="h-8 w-8 text-blue-500" />,
      title: 'Olahraga Teratur',
      description: '30 menit aktivitas fisik sedang setiap hari',
    },
    {
      icon: <Moon className="h-8 w-8 text-purple-500" />,
      title: 'Istirahat Cukup',
      description: 'Tidur 7-8 jam setiap malam untuk kesehatan optimal',
    },
    {
      icon: <Brain className="h-8 w-8 text-yellow-500" />,
      title: 'Kelola Stres',
      description: 'Praktikkan teknik relaksasi dan meditasi',
    },
    {
      icon: <Cigarette className="h-8 w-8 text-gray-500" />,
      title: 'Hindari Rokok',
      description: 'Berhenti merokok untuk kesehatan jantung',
    },
  ];

  const lifestyleChanges = [
    {
      icon: <Coffee className="h-6 w-6 text-brown-600" />,
      title: 'Batasi Kafein',
      description: 'Kurangi konsumsi kopi dan minuman berkafein',
    },
    {
      icon: <Wine className="h-6 w-6 text-purple-600" />,
      title: 'Hindari Alkohol',
      description: 'Batasi atau hindari konsumsi alkohol',
    },
    {
      icon: <Lungs className="h-6 w-6 text-blue-600" />,
      title: 'Pernapasan Dalam',
      description: 'Latihan pernapasan untuk menurunkan tekanan darah',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">IMO MANTAP</span>
                  <span className="block text-blue-900 mt-2">
                    Solusi Pintar Kepatuhan Minum Obat
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Aplikasi yang membantu Anda mengelola pengobatan hipertensi dengan lebih baik.
                  Pantau, catat, dan tingkatkan kepatuhan minum obat Anda bersama tim kesehatan.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 md:py-4 md:text-lg md:px-10"
                    >
                      Masuk
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Health Tips Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-900 font-semibold tracking-wide uppercase">
              Tips Kesehatan
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Hidup Sehat dengan Hipertensi
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Ikuti tips-tips berikut untuk mengelola tekanan darah Anda dengan lebih baik
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {healthTips.map((tip, index) => (
                <div
                  key={index}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                    {tip.icon}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                      {tip.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lifestyle Changes Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Perubahan Gaya Hidup
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Langkah-langkah kecil menuju hidup yang lebih sehat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifestyleChanges.map((change, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {change.icon}
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    {change.title}
                  </h3>
                </div>
                <p className="text-gray-500">{change.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Fitur Utama
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Berbagai fitur yang memudahkan pengelolaan pengobatan Anda
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-blue-50 rounded-lg p-6">
                <Activity className="h-8 w-8 text-blue-900" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Pengingat Minum Obat
                </h3>
                <p className="mt-2 text-gray-500">
                  Dapatkan pengingat tepat waktu untuk minum obat Anda
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <Heart className="h-8 w-8 text-blue-900" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Pantau Kepatuhan
                </h3>
                <p className="mt-2 text-gray-500">
                  Lacak dan evaluasi kepatuhan minum obat Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;