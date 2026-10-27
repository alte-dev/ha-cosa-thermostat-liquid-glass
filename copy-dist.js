import fs from 'fs';
import path from 'path';

const srcFile = path.resolve('dist/cosa-thermostat-card.js');
const targets = [
  path.resolve('cosa-thermostat-card.js'),
  path.resolve('www/cosa-thermostat-card.js'),
  path.resolve('custom_components/cosa_thermostat/frontend/cosa-thermostat-card.js'),
];

if (fs.existsSync(srcFile)) {
  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(srcFile, target);
    console.log(`✓ Copied to ${target}`);
  }
} else {
  console.error(`Source file not found: ${srcFile}`);
  process.exit(1);
}
