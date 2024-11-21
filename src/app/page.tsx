"use client";

import { useState } from "react";
import { Search, Music, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Song {
  name: string;
  artist: string;
  url: string;
}

export default function MoodMusicRecommender() {
  const [mood, setMood] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await fetch(
        `http://localhost:5000/recommend?mood=${encodeURIComponent(mood)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommendations");
      }

      if (Array.isArray(data.songs)) {
        setRecommendations(data.songs);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="py-6 border-b">
        <h1 className="text-2xl font-bold text-center">moodify</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your mood (happy, sad, relax, or angry)..."
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="pr-12"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {isLoading && (
              <p className="mt-4 text-center">
                Finding the perfect songs for your mood...
              </p>
            )}
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

            {recommendations.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Recommended Songs
                </h2>
                <ul className="space-y-4">
                  {recommendations.map((song, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
                    >
                      <Music className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="font-medium truncate">{song.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {song.artist}
                        </p>
                      </div>
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:underline"
                      >
                        <span className="text-sm">Open</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        © 2023 moodify. All rights reserved.
      </footer>
    </div>
  );
}
