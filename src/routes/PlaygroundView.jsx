import React from 'react';
import LegacyApp from '../App';

/**
 * PlaygroundView wraps the legacy CommitCanvas app forced into the playground tab.
 */
export default function PlaygroundView() {
  return <LegacyApp forcedTab="playground" />;
}
