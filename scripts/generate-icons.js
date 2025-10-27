const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Icon sizes to generate
const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

async function generateIcons() {
  const inputPath = path.join(__dirname, '..', 'public', 'custom-icon.svg');
  const outputDir = path.join(__dirname, '..', 'public');

  console.log('📱 Icon Generation Script');
  console.log('========================');
  console.log('');

  try {
    // Check if input SVG exists
    if (!fs.existsSync(inputPath)) {
      console.error('❌ Input SVG file not found:', inputPath);
      return;
    }

    console.log('✅ Found input SVG:', inputPath);
    console.log('');

    // Generate PNG files for each size
    for (const icon of iconSizes) {
      const outputPath = path.join(outputDir, icon.name);

      await sharp(inputPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    console.log('');
    console.log('🎉 All PNG icons generated successfully!');
    console.log('');
    console.log('📁 Generated files:');
    iconSizes.forEach(icon => {
      console.log(`  • /public/${icon.name}`);
    });
    console.log('');
    console.log('✨ Icons are ready to use in your app!');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('  1. Make sure custom-icon.svg exists in /public/');
    console.log('  2. Check that sharp is installed: npm install sharp');
    console.log('  3. Ensure you have write permissions in /public/');
  }
}

// Run the script
generateIcons();
