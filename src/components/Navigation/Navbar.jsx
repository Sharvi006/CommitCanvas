import React from 'react';
import { PillNavbar } from '../../routes/RootLayout';

/**
 * Re-export the shared PillNavbar to ensure full backwards compatibility
 * with any components importing Navbar from Navigation/Navbar.
 */
export default function Navbar() {
  return <PillNavbar />;
}
