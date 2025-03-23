import { Card } from "@/components/ui/card";
import { Calendar, Trophy, Users, MapPin, Globe } from "lucide-react";
import { promises as fs } from 'fs';
import path from 'path';

async function getHackathons() {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data/hackathons.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading hackathons:', error);
    return [];
  }
}

export default async function Home() {
  const hackathons = await getHackathons();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Upcoming Hackathons
        </h1>
        
        {hackathons.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-xl">No hackathons found at the moment.</p>
            <p className="mt-2">Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon: { image: string; title: string; platform: string; deadline: string; prize?: string; participants?: number; isOnline: boolean; location: string; link: string }, index: number) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={hackathon.image}
                    alt={hackathon.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                    {hackathon.platform}
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {hackathon.title}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Deadline: {hackathon.deadline}</span>
                    </div>
                    
                    {hackathon.prize && (
                      <div className="flex items-center text-gray-600">
                        <Trophy className="w-5 h-5 mr-2" />
                        <span>{hackathon.prize}</span>
                      </div>
                    )}
                    
                    {hackathon.participants && (
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2" />
                        <span>{hackathon.participants} participants</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      {hackathon.isOnline ? (
                        <Globe className="w-5 h-5 mr-2" />
                      ) : (
                        <MapPin className="w-5 h-5 mr-2" />
                      )}
                      <span>{hackathon.location}</span>
                    </div>
                  </div>
                  
                  <a
                    href={hackathon.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Learn More
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}