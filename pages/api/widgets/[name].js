/**
 * Dynamic Widget Bundle API
 * Serves widget JSX files for OpenAI Apps SDK with Babel standalone compilation
 */

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { name } = req.query;

  // Remove .jsx or .js extension if present
  const widgetName = name.replace(/\.(jsx|js)$/, '');

  // Map widget names to file names
  const widgetFiles = {
    'product-creation': 'product-creation.jsx',
    'order-list': 'order-list.jsx',
    'product-grid': 'product-grid.jsx',
    'shopping-cart': 'shopping-cart.jsx',
    'order-status': 'order-status.jsx',
    'product-card': 'product-card.jsx',
    'checkout-form': 'checkout-form.jsx'
  };

  const fileName = widgetFiles[widgetName];

  if (!fileName) {
    return res.status(404).json({ error: 'Widget not found' });
  }

  // Read JSX file from lib/widget-jsx
  const filePath = path.join(process.cwd(), 'lib', 'widget-jsx', fileName);

  try {
    const jsxContent = fs.readFileSync(filePath, 'utf-8');

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(jsxContent);
  } catch (error) {
    console.error('Error reading widget file:', error);
    res.status(500).json({ error: 'Failed to load widget' });
  }
}
