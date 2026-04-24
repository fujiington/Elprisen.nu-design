'use client';

// Disable FontAwesome's automatic CSS injection – CSS is imported in globals.css instead.
// This prevents duplicate style tags on SSR.
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function FontAwesomeSetup() {
  return null;
}
