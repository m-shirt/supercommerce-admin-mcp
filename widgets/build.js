const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, '../public/widgets');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Get all widget files
const widgetFiles = fs.existsSync(srcDir)
  ? fs.readdirSync(srcDir).filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'))
  : [];

if (widgetFiles.length === 0) {
  console.log('⚠️  No widget files found in src/');
  console.log('   Create .tsx or .jsx files in widgets/src/ to build');
  process.exit(0);
}

console.log(`📦 Building ${widgetFiles.length} widget(s)...\n`);

const watch = process.argv.includes('--watch');

async function buildWidget(widget) {
  const widgetName = widget.replace(/\.(tsx|jsx)$/, '');

  try {
    const buildOptions = {
      entryPoints: [path.join(srcDir, widget)],
      bundle: true,
      outfile: path.join(outDir, `${widgetName}.js`),
      format: 'esm',
      target: 'es2020',
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      jsx: 'automatic',
      minify: !watch,
      sourcemap: true,
      define: {
        'process.env.NODE_ENV': watch ? '"development"' : '"production"'
      },
      logLevel: 'error'
    };

    if (watch) {
      // Use context API for watch mode
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log(`✅ Watching ${widgetName}.js`);
      return ctx;
    } else {
      // Regular build
      await esbuild.build(buildOptions);
      console.log(`✅ Built ${widgetName}.js`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Failed to build ${widgetName}:`);
    console.error(error.message);
    return false;
  }
}

async function buildAll() {
  const results = await Promise.all(widgetFiles.map(buildWidget));
  const successCount = results.filter(Boolean).length;

  console.log(`\n📊 Build complete: ${successCount}/${widgetFiles.length} succeeded`);

  if (watch) {
    console.log('\n👀 Watching for changes...');
  }

  return successCount === widgetFiles.length;
}

buildAll().then(success => {
  if (!watch && !success) {
    process.exit(1);
  }
}).catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
