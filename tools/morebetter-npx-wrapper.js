#!/usr/bin/env node

/**
 * MoreBetter CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub or npm registry
 */

const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

if (isNpxExecution) {
  // Running via npx - spawn child process to preserve user's working directory
  const args = process.argv.slice(2);
  const morebetterCliPath = path.join(__dirname, 'cli', 'morebetter-cli.js');

  if (!fs.existsSync(morebetterCliPath)) {
    console.error('Error: Could not find morebetter-cli.js at', morebetterCliPath);
    console.error('Current directory:', __dirname);
    process.exit(1);
  }

  try {
    // Execute CLI from user's working directory (process.cwd()), not npm cache
    execSync(`node "${morebetterCliPath}" ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: process.cwd(), // This preserves the user's working directory
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Local execution - use require
  require('./cli/morebetter-cli.js');
}
