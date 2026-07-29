import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminVerification() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '445566') {
      localStorage.setItem('wcs_admin_access', 'true');
      navigate('/admin');
    } else {
      setError('Access Denied');
    }
  };

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-[#666666] font-normal text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-4 max-w-xs w-full text-center">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-200 rounded outline-none"
          autoFocus
        />
      </form>
    </div>
  );
}
