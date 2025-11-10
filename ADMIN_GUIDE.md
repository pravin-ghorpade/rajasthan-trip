# Admin Guide - Hotel Management

## Overview
Anyone with the link can now manage hotels directly from the web interface! A new **⚙️ Manage** tab has been added to allow full CRUD operations on hotels.

## Features

### 🏨 Add New Hotels
1. Click the **⚙️ Manage** tab
2. Click **Add New Hotel** button
3. Fill in the form:
   - **City**: Select from dropdown (Jaipur, Jaisalmer, Udaipur)
   - **Hotel Name** *: Required
   - **2 Person Price** *: Required (in ₹)
   - **3 Person Price** *: Required (in ₹)
   - **Image URL**: Optional - direct link to hotel image
   - **Booking Link**: Optional - link to booking page
   - **Notes**: Optional - any additional info
4. Click **Save Hotel**
5. New hotel appears immediately in all tabs

### ✏️ Edit Existing Hotels
1. Go to **⚙️ Manage** tab
2. Select the city containing the hotel
3. Click the **Edit** (pencil) button on any hotel card
4. Modify any field:
   - Hotel name
   - Prices (2-person and 3-person)
   - Image URL
   - Booking link
   - Notes
5. Click **Save Changes** or **Cancel**
6. Changes reflect immediately across all tabs

### 🗑️ Delete Hotels
1. Go to **⚙️ Manage** tab
2. Select the city containing the hotel
3. Click the **Delete** (trash) button
4. Confirm the deletion in the popup
5. Hotel is permanently removed from the database

## Real-Time Updates
- All changes (add/edit/delete) are saved to the JSON file
- Changes are immediately visible on:
  - ✅ Hotels voting tab
  - ✅ Results tab
  - ✅ Admin tab
- No page refresh needed!

## Technical Details

### API Endpoints
All hotel management operations use the `/api/hotels` endpoint:

- **GET** `/api/hotels` - Fetch all hotels
- **POST** `/api/hotels` - Add new hotel
  ```json
  {
    "cityId": "jaipur",
    "hotel": {
      "name": "Hotel Name",
      "price2": 5000,
      "price3": 6500,
      "image": "https://...",
      "link": "https://...",
      "notes": "Near City Palace"
    }
  }
  ```
- **PUT** `/api/hotels` - Update existing hotel
  ```json
  {
    "cityId": "jaipur",
    "hotelId": "hotel_12345",
    "updates": {
      "name": "Updated Name",
      "price2": 5500,
      ...
    }
  }
  ```
- **DELETE** `/api/hotels?cityId=jaipur&hotelId=hotel_12345` - Delete hotel

### Data Persistence
- Changes are written to: `src/data/rajasthan_data_with_images_20251110_024141.json`
- File is automatically updated on the server
- No database setup required
- Backup your JSON file before making bulk changes!

## Best Practices

### 🎯 Before Adding Hotels
- Have all information ready (name, prices, images, links)
- Verify prices are accurate for 2-person and 3-person occupancy
- Use high-quality image URLs that won't expire
- Test booking links to ensure they work

### 🔍 Data Quality
- Use consistent naming conventions
- Double-check prices before saving
- Add meaningful notes (location, amenities, etc.)
- Keep image URLs publicly accessible

### 🛡️ Safety
- **Backup the JSON file regularly** - especially before bulk operations
- Test edits on one hotel before making many changes
- Verify deletions - they cannot be undone!
- Consider creating a copy of the data file before major changes

## Troubleshooting

### Hotel Not Appearing?
- Refresh the page
- Check if you selected the correct city
- Verify the hotel was saved successfully (look for success message)

### Can't Edit/Delete?
- Make sure you clicked the correct button
- Check browser console for errors
- Ensure you have write permissions to the data file

### Changes Not Persisting?
- Check file system permissions
- Verify the JSON file path is correct
- Look for API errors in browser console

## Security Note
⚠️ **Important**: This admin interface is accessible to anyone with the link. For production use, consider:
- Adding authentication (password protection)
- Implementing user roles (admin vs viewer)
- Adding audit logging
- Creating backups before edits
- Rate limiting API calls

## Command Line Alternative
You can still use the CLI tool for adding hotels:
```bash
npm run add-hotel
```

## Need Help?
- Check browser console for errors (F12 → Console)
- Review the JSON data file for structure
- Ensure dev server is running (`npm run dev`)
- Check API route logs in terminal
