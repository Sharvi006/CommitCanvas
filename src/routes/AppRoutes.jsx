import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import ChallengeList from '../components/Challenges/ChallengeList';
import ChallengeView from '../components/Challenges/ChallengeView';
import HomeView from './HomeView';
import PlaygroundView from './PlaygroundView';
import LearningHub from '../components/Learning/LearningHub';
import Login from '../components/Login/Login';

function LoginRoute() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate('/', { replace: true })} />;
}

/**
 * AppRoutes configures top-level navigation:
 * - '/' renders HomeView
 * - '/playground' renders PlaygroundView
 * - '/learning' renders the Git Learning Hub
 * - '/challenges' renders ChallengeList under RootLayout (blobs + pill navbar)
 * - '/challenges/:id' renders ChallengeView under RootLayout (blobs + pill navbar)
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Home and Playground views manage their own interactive canvas and navbar */}
      <Route path="/" element={<HomeView />} />
      <Route path="/playground" element={<PlaygroundView />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/learning"
        element={
          <RootLayout>
            <LearningHub />
          </RootLayout>
        }
      />

      {/* Challenge subsystem wrapped in RootLayout */}
      <Route
        path="/challenges"
        element={
          <RootLayout>
            <ChallengeList />
          </RootLayout>
        }
      />
      <Route
        path="/challenges/:id"
        element={
          <RootLayout>
            <ChallengeView />
          </RootLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
