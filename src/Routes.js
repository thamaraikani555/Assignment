import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load the components
const NotFound = lazy(() => import('./components/NotFound'));
const LoginScreen = lazy(() => import('./components/Login'));
const GenerateLink = lazy(() => import('./components/Home'));

const RoutesModule = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/generate-link" element={<GenerateLink />} />
          <Route path="/404" element={<NotFound />} />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RoutesModule;
