import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #f5f3ff 100%)', position: 'relative' }}>
      {/* Animation keyframes for the logo across the full viewport */}
      <style>{`
        @keyframes runAcrossViewport {
          0% { transform: translateX(-50vw); }
          100% { transform: translateX(100vw); }
        }
      `}</style>

      {/* Overlay animation container spanning the full viewport width */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '1rem', left: 0, width: '100%', overflow: 'hidden', height: 140, pointerEvents: 'none' }}>
        <img
          src="/DynaZOR.png"
          alt=""
          style={{ height: 120, objectFit: 'contain', display: 'inline-block', willChange: 'transform', animation: 'runAcrossViewport 6s linear infinite' }}
        />
      </div>
      <div style={{ maxWidth: 900, width: '100%', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Welcome to DynaZOR
          </h1>
          <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>
            Smart scheduler to manage availability and appointments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#4f46e5', color: 'white', borderRadius: 12, padding: '1.25rem', textAlign: 'center', fontWeight: 700, boxShadow: '0 10px 20px rgba(79,70,229,0.2)' }}>
              Login
            </div>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#10b981', color: 'white', borderRadius: 12, padding: '1.25rem', textAlign: 'center', fontWeight: 700, boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}>
              Register
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;