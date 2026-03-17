/**
 * Migration Script: Move Images from File Storage to Database
 * 
 * This script migrates all existing images from the file system to the database.
 * It processes:
 * - Building hero images
 * - Unit images (multiple per unit)
 * 
 * Usage: node backend/scripts/migrateImagesToDatabase.js
 */

const fs = require('fs');
const path = require('path');
const { promisePool } = require('../config/database');

// Base paths
const UPLOADS_BASE = path.join(__dirname, '../uploads');
const BUILDINGS_DIR = path.join(UPLOADS_BASE, 'buildings');
const UNITS_DIR = path.join(UPLOADS_BASE, 'units');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../../public/images');

async function migrateImages() {
  console.log('🚀 Starting image migration from files to database...\n');

  try {
    // Step 1: Migrate building images
    console.log('📦 Step 1: Migrating building images...');
    await migrateBuildingImages();

    // Step 2: Migrate unit images
    console.log('\n📦 Step 2: Migrating unit images...');
    await migrateUnitImages();

    console.log('\n✅ Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: Please verify the migration before deleting old image files.');
    console.log('   You can keep the old files as backup until you confirm everything works.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function migrateBuildingImages() {
  const connection = await promisePool.getConnection();
  
  try {
    // Get all buildings with file-based images
    const [buildings] = await connection.query(
      'SELECT id, hero_image FROM buildings WHERE image_storage_type = "file" OR image_storage_type IS NULL'
    );

    console.log(`   Found ${buildings.length} buildings to migrate`);

    for (const building of buildings) {
      if (!building.hero_image) {
        console.log(`   ⚠️  Building ${building.id}: No hero image to migrate`);
        continue;
      }

      try {
        // Determine the full path to the image file
        let imagePath;
        if (building.hero_image.startsWith('/uploads/')) {
          // Image is in uploads folder
          imagePath = path.join(__dirname, '../', building.hero_image);
        } else if (building.hero_image.startsWith('/images/')) {
          // Image is in public/images folder
          imagePath = path.join(__dirname, '../../public', building.hero_image);
        } else {
          console.log(`   ⚠️  Building ${building.id}: Unknown image path format: ${building.hero_image}`);
          continue;
        }

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.log(`   ⚠️  Building ${building.id}: Image file not found: ${imagePath}`);
          continue;
        }

        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        const filename = path.basename(building.hero_image);
        const ext = path.extname(filename).toLowerCase();
        
        // Determine mimetype
        let mimetype = 'image/jpeg';
        if (ext === '.png') mimetype = 'image/png';
        else if (ext === '.gif') mimetype = 'image/gif';
        else if (ext === '.webp') mimetype = 'image/webp';

        // Insert image into database
        const [result] = await connection.query(
          'INSERT INTO images (filename, mimetype, size, data, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)',
          [filename, mimetype, imageBuffer.length, imageBuffer, 'building', building.id]
        );

        const imageId = result.insertId;

        // Create entity_images mapping
        await connection.query(
          'INSERT INTO entity_images (entity_type, entity_id, image_id, is_primary) VALUES (?, ?, ?, true)',
          ['building', building.id, imageId]
        );

        // Update building to use database storage
        await connection.query(
          'UPDATE buildings SET image_storage_type = "database" WHERE id = ?',
          [building.id]
        );

        console.log(`   ✅ Building ${building.id}: Migrated ${filename} (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

      } catch (error) {
        console.error(`   ❌ Building ${building.id}: Failed to migrate - ${error.message}`);
      }
    }

  } finally {
    connection.release();
  }
}

async function migrateUnitImages() {
  const connection = await promisePool.getConnection();
  
  try {
    // Get all units with file-based images
    const [units] = await connection.query(
      'SELECT id, image, images FROM units WHERE image_storage_type = "file" OR image_storage_type IS NULL'
    );

    console.log(`   Found ${units.length} units to migrate`);

    for (const unit of units) {
      try {
        let imagePaths = [];
        
        // Parse the images JSON field
        if (unit.images) {
          try {
            const parsedImages = JSON.parse(unit.images);
            if (Array.isArray(parsedImages)) {
              imagePaths = parsedImages;
            }
          } catch (e) {
            console.log(`   ⚠️  Unit ${unit.id}: Failed to parse images JSON`);
          }
        }

        // If no images in array, try the single image field
        if (imagePaths.length === 0 && unit.image) {
          imagePaths = [unit.image];
        }

        if (imagePaths.length === 0) {
          console.log(`   ⚠️  Unit ${unit.id}: No images to migrate`);
          continue;
        }

        const migratedImageIds = [];

        for (let i = 0; i < imagePaths.length; i++) {
          const imagePath = imagePaths[i];
          
          try {
            // Determine the full path to the image file
            let fullPath;
            if (imagePath.startsWith('/uploads/')) {
              fullPath = path.join(__dirname, '../', imagePath);
            } else if (imagePath.startsWith('/images/')) {
              fullPath = path.join(__dirname, '../../public', imagePath);
            } else {
              console.log(`   ⚠️  Unit ${unit.id}: Unknown image path format: ${imagePath}`);
              continue;
            }

            // Check if file exists
            if (!fs.existsSync(fullPath)) {
              console.log(`   ⚠️  Unit ${unit.id}: Image file not found: ${fullPath}`);
              continue;
            }

            // Read the image file
            const imageBuffer = fs.readFileSync(fullPath);
            const filename = path.basename(imagePath);
            const ext = path.extname(filename).toLowerCase();
            
            // Determine mimetype
            let mimetype = 'image/jpeg';
            if (ext === '.png') mimetype = 'image/png';
            else if (ext === '.gif') mimetype = 'image/gif';
            else if (ext === '.webp') mimetype = 'image/webp';

            // Insert image into database
            const [result] = await connection.query(
              'INSERT INTO images (filename, mimetype, size, data, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)',
              [filename, mimetype, imageBuffer.length, imageBuffer, 'unit', unit.id]
            );

            const imageId = result.insertId;
            migratedImageIds.push(imageId);

            // Create entity_images mapping
            await connection.query(
              'INSERT INTO entity_images (entity_type, entity_id, image_id, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
              ['unit', unit.id, imageId, i, i === 0]
            );

          } catch (error) {
            console.error(`   ❌ Unit ${unit.id}: Failed to migrate image ${imagePath} - ${error.message}`);
          }
        }

        if (migratedImageIds.length > 0) {
          // Update unit to use database storage
          await connection.query(
            'UPDATE units SET image_storage_type = "database" WHERE id = ?',
            [unit.id]
          );

          console.log(`   ✅ Unit ${unit.id}: Migrated ${migratedImageIds.length} image(s)`);
        }

      } catch (error) {
        console.error(`   ❌ Unit ${unit.id}: Failed to migrate - ${error.message}`);
      }
    }

  } finally {
    connection.release();
  }
}

// Run the migration
migrateImages()
  .then(() => {
    console.log('\n🎉 All done! Closing database connection...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
