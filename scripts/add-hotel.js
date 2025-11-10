#!/usr/bin/env node

/**
 * Helper script to add hotels to the data file
 * Usage: node scripts/add-hotel.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const dataFilePath = path.join(__dirname, '../src/data/rajasthan_data_with_images_20251110_024141.json');

async function addHotel() {
  console.log('\n🏨 Add New Hotel to Rajasthan Trip Data\n');

  try {
    // Load existing data
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Show available cities
    console.log('Available cities:');
    data.cities.forEach((city, idx) => {
      console.log(`${idx + 1}. ${city.name} (${city.dates})`);
    });

    const cityIndex = parseInt(await question('\nSelect city number: ')) - 1;
    
    if (cityIndex < 0 || cityIndex >= data.cities.length) {
      console.log('Invalid city selection');
      rl.close();
      return;
    }

    const selectedCity = data.cities[cityIndex];
    console.log(`\nAdding hotel to: ${selectedCity.name}\n`);

    // Collect hotel information
    const hotelName = await question('Hotel name: ');
    const hotelLink = await question('Hotel link (or press Enter to skip): ');
    const price2 = parseFloat(await question('Price for 2 people: '));
    const price3 = parseFloat(await question('Price for 3 people: '));
    const imageUrl = await question('Image URL (or press Enter for default): ');
    const notes = await question('Notes (or press Enter to skip): ');

    // Create hotel ID
    const hotelId = hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Create hotel object
    const newHotel = {
      id: hotelId,
      name: hotelName,
      link: hotelLink || null,
      price2: price2,
      price3: price3,
      image: imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(selectedCity.name + ' ' + hotelName + ' hotel rajasthan')}`,
      notes: notes || ""
    };

    // Add hotel to city
    selectedCity.hotels.push(newHotel);

    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    console.log('\n✅ Hotel added successfully!');
    console.log(JSON.stringify(newHotel, null, 2));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  rl.close();
}

addHotel();
