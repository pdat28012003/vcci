"use client";

import React from 'react';
import Layout from '../components/Layout';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

export default function Home() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ToastProvider>
  );
}

