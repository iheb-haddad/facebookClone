import React , { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const signIn = async () => {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: 'omarmechi22@gmail.com',
        password: 'Omarmechi123',
      });

      if (error) {
        console.error('Error signing in:', error);
      } else {
        console.log('Signed in as:', user?.email);
      }
    };

    signIn();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:userId" element={<Profile />} />
    </Routes>
  );
}

export default App;