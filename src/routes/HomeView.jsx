import React from 'react';
// HomeView renders the existing CommitCanvas landing page content
// The existing App.jsx CommitCanvas component handles its own state including tab switching
// We'll render it in 'home' tab mode
import LegacyApp from '../App';

/**
 * HomeView wraps the legacy CommitCanvas app that manages its own tab state.
 * When routed here, it shows the home landing page.
 */
export default function HomeView() {
  return <LegacyApp forcedTab="home" />;
}
