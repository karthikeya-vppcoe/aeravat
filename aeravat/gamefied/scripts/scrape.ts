const fs = require('fs').promises;
const path = require('path');

async function scrapeDevpost() {
  try {
    const response = await fetch('https://devpost.com/api/hackathons?active=true', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data.hackathons)) {
      throw new Error('Invalid response format from Devpost API');
    }

    const hackathons = data.hackathons.map((hackathon: any) => ({
      title: hackathon.title,
      link: hackathon.url,
      deadline: new Date(hackathon.submission_period_ends_at).toLocaleDateString(),
      image: hackathon.thumbnail_url || 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&q=80',
      location: hackathon.location || 'Online',
      isOnline: !hackathon.location || hackathon.location.toLowerCase().includes('online'),
      startDate: new Date(hackathon.submission_period_starts_at).toLocaleDateString(),
      endDate: new Date(hackathon.submission_period_ends_at).toLocaleDateString(),
      prize: hackathon.prize_amount ? `$${hackathon.prize_amount.toLocaleString()}` : null,
      participants: hackathon.registrations_count,
      platform: 'Devpost',
      scrapedAt: new Date().toISOString()
    }));

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    await fs.mkdir(dataDir, { recursive: true });

    // Write the results to file
    await fs.writeFile(
      path.join(dataDir, 'hackathons.json'),
      JSON.stringify(hackathons, null, 2)
    );

    console.log(`Successfully scraped ${hackathons.length} hackathons from Devpost`);
    return hackathons;
  } catch (error) {
    console.error('Error scraping Devpost:', error);
    // Return empty array instead of undefined on error
    return [];
  }
}

// Initialize with empty data file if scraping fails
async function initializeEmptyDataFile() {
  const dataDir = path.join(__dirname, '../data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, 'hackathons.json'),
    JSON.stringify([], null, 2)
  );
}

async function main() {
  try {
    const hackathons = await scrapeDevpost();
    
    if (!hackathons.length) {
      console.log('No hackathons found, initializing empty data file');
      await initializeEmptyDataFile();
    }
  } catch (error) {
    console.error('Error in main process:', error);
    await initializeEmptyDataFile();
  }
}

main();