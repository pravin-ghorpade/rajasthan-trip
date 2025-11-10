# 🏨 Quick Start Guide - Rajasthan Hotel Picker

## For Group Members

### How to Vote on Hotels 🗳️

1. **Open the App**
   - Go to the shared URL
   - You'll see the "Vote on Hotels" tab (default view)

2. **Enter Your Name** (Optional)
   - Type your name in the "Your name" field
   - This helps identify your votes in the results

3. **Browse Hotels**
   - Click on city tabs at the top (Ranthambhore, Jaipur, Jodhpur, etc.)
   - Use the search box to find specific hotels

4. **Rate Hotels**
   - For each hotel card:
     - Select **2 Person Room** or **3 Person Room** to see prices
     - See total price and per-person cost
     - Click stars to rate (1-5 stars)
     - ⭐ = Poor, ⭐⭐⭐⭐⭐ = Excellent
   - You'll see a green badge on rated hotels

5. **Track Your Progress**
   - Look for the progress bar at the top
   - Shows how many hotels you've rated
   - Try to rate all hotels for best group decision!

6. **Submit Your Ratings**
   - Click the **"Submit My Ratings"** button at the bottom
   - Wait for the success message
   - Your votes are now saved!

### How to View Results 📊

1. **Switch to Results Tab**
   - Click "View Results" at the top of the page

2. **Explore the Data**
   - See average rating for each hotel (★ stars)
   - Check how many people voted
   - View individual ratings from each person

3. **Sort Results**
   - **By Rating**: See highest-rated hotels first
   - **By Votes**: See most popular choices
   - **By Name**: Alphabetical order

4. **Find Top Picks**
   - Look for 🏆 **#1 Top Rated** badges
   - Hotels with more votes are more reliable

5. **Refresh Data**
   - Click the 🔄 Refresh button
   - Or wait 30 seconds for auto-refresh

### Tips for Best Results 💡

✅ **Rate honestly** - Your opinion matters!
✅ **Consider both options** - Check both 2 and 3-person prices
✅ **Add notes** - If you have concerns, mention them
✅ **Check results** - See what others think before finalizing

### Common Questions ❓

**Q: Can I change my ratings after submitting?**
A: Yes! Just rate again and resubmit. Latest submission counts.

**Q: Do I need to rate all hotels?**
A: No, but rating more helps the group decide better.

**Q: Can I see who voted what?**
A: Yes! The Results tab shows individual votes with names.

**Q: How do I share my ratings?**
A: Click "Copy Share Link" and send the URL to others.

---

## For Trip Organizers

### Setting Up

1. **Deploy the App**
   ```bash
   npm install
   npm run build
   vercel deploy
   ```

2. **Share the URL**
   - Send the app URL to all group members
   - Set a deadline for voting
   - Encourage everyone to participate

3. **Monitor Results**
   - Check the Results tab regularly
   - Look for consensus on top-rated hotels
   - Download CSV for offline analysis

### Adding New Hotels

**Option 1: Use the script**
```bash
npm run add-hotel
```
Follow the prompts to add hotel details.

**Option 2: Edit data file**
Open `src/data/rajasthan_data_with_images_20251110_024141.json`

```json
{
  "id": "hotel-name-id",
  "name": "Hotel Name",
  "link": "https://booking-link.com",
  "price2": 5000,
  "price3": 7000,
  "image": "https://image-url.com",
  "notes": "Near railway station"
}
```

### Making the Final Decision

1. **Export Results**
   - Click "Export CSV" to download data
   - Open in Excel/Google Sheets
   - Sort by rating and votes

2. **Analyze**
   - Hotels with 4+ stars and multiple votes are safest
   - Consider price vs rating trade-offs
   - Check individual comments

3. **Discuss**
   - Share top 3 choices per city with group
   - Have final vote if needed
   - Book the winners!

### Production Setup

**For Google Sheets Integration:**
1. Create a Google Sheet for storing votes
2. Set up Google Sheets API
3. Update API route in `src/app/api/votes/route.ts`
4. Add credentials to environment variables

**For Better Performance:**
- Enable caching
- Add rate limiting
- Set up monitoring
- Configure CDN

---

## 📱 Mobile Tips

- **Tap** to select room type
- **Swipe** between city tabs
- **Pinch-zoom** on hotel images
- **Scroll** through individual votes
- Works great on all devices!

## 🎯 Success Tips

1. **Start Early**: Give everyone time to research
2. **Be Thorough**: Rate based on reviews, location, amenities
3. **Communicate**: Discuss preferences before voting
4. **Check Prices**: Consider budget vs quality
5. **Look at Results Together**: Make final decision as a group

---

## 🆘 Troubleshooting

**Ratings not saving?**
- Check internet connection
- Clear browser cache
- Try incognito mode

**App not loading?**
- Refresh the page
- Check URL is correct
- Try different browser

**Can't see results?**
- Click "View Results" tab
- Hit refresh button
- Wait for auto-refresh

---

## 🎉 Happy Trip Planning!

This tool is designed to make group hotel decisions easy and fun!

**Remember:**
- Everyone's opinion matters
- Honest ratings help the whole group
- Have fun exploring options!

Enjoy your Rajasthan adventure! 🏜️✨

---

**Need Help?**
Contact the organizer or check the full documentation in `HOTEL_PICKER_README.md`
