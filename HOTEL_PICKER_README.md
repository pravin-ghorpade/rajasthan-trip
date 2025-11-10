# 🏜️ Rajasthan Hotel Picker

A beautiful, interactive hotel rating and comparison tool built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### For Voters
- **Interactive Rating System**: Rate hotels with an intuitive 5-star rating interface
- **Room Type Selection**: Compare prices for 2-person and 3-person rooms
- **Progress Tracking**: See how many hotels you've rated at a glance
- **Real-time Feedback**: Smooth animations and visual feedback for all interactions
- **Share Your Ratings**: Copy a shareable link with your ratings encoded in the URL
- **Export to CSV**: Download your ratings as a CSV file
- **Persistent Ratings**: Your ratings are saved in the browser automatically

### For Groups
- **Results Dashboard**: View aggregated ratings from all group members
- **Sorting Options**: Sort hotels by average rating, number of votes, or name
- **Individual Votes**: See who voted for what with detailed breakdowns
- **Auto-refresh**: Results update automatically every 30 seconds
- **Top Rated Badges**: Highlight the most popular hotels
- **Price Comparison**: See prices for both 2 and 3-person occupancy

### Design Features
- **Smooth Animations**: Delightful motion design using Framer Motion
- **Responsive Layout**: Perfect on mobile, tablet, and desktop
- **Modern UI**: Clean, beautiful interface using shadcn/ui components
- **Dark Mode Ready**: Theming support built-in
- **Accessible**: ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd rajasthan-picker
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

\`\`\`
rajasthan-picker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── votes/
│   │   │       └── route.ts          # API endpoint for voting
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main application
│   ├── components/
│   │   └── ui/                       # shadcn/ui components
│   ├── data/
│   │   └── rajasthan_data_with_images_20251110_024141.json
│   └── lib/
│       └── utils.ts                  # Utility functions
├── public/                           # Static assets
├── package.json
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## 🎨 Customization

### Adding Hotels
Edit \`src/data/rajasthan_data_with_images_20251110_024141.json\`:

\`\`\`json
{
  "cities": [
    {
      "id": "city-id",
      "name": "City Name",
      "dates": "Dec 14–Dec 15",
      "hotels": [
        {
          "id": "hotel-id",
          "name": "Hotel Name",
          "link": "https://hotel-website.com",
          "price2": 5000,
          "price3": 7000,
          "image": "https://image-url.com",
          "notes": "Additional notes"
        }
      ]
    }
  ]
}
\`\`\`

### Styling
- Colors and theme: Edit \`src/app/globals.css\`
- Component styles: Modify files in \`src/components/ui/\`
- Layout spacing: Adjust Tailwind classes in \`src/app/page.tsx\`

## 🔧 API Integration

The app currently uses an in-memory store for voting data. To integrate with a real backend:

1. **Google Sheets API**:
   - Set up a Google Cloud project
   - Enable Google Sheets API
   - Update \`src/app/api/votes/route.ts\` to use the Sheets API

2. **Database**:
   - Connect to PostgreSQL, MongoDB, or your preferred database
   - Update the API route to store/retrieve data from your DB

3. **Serverless Functions**:
   - Deploy to Vercel, Netlify, or AWS Lambda
   - Configure environment variables for API keys

## 📊 Data Flow

1. User rates hotels → Stored in browser localStorage
2. User clicks "Submit" → POST to \`/api/votes\`
3. Results tab loads → GET from \`/api/votes\`
4. Auto-refresh every 30s when on Results tab
5. Sorting/filtering happens client-side for instant feedback

## 🚢 Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Other Platforms
\`\`\`bash
npm run build
npm run start
\`\`\`

## 🎯 Future Enhancements

- [ ] Real Google Sheets integration
- [ ] User authentication
- [ ] Comments on hotels
- [ ] Photo uploads
- [ ] Email notifications for new votes
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] PWA support for offline access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for your own trips!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ for amazing group trips!
