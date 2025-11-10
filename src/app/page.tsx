'use client';

import { useMemo, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart, Star, Send, TrendingUp, Users, ArrowUpDown, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DATA_RAW from "@/data/rajasthan_data_with_images_20251110_024141.json";

// ---------- utilities ----------
const DATA = DATA_RAW as any;
const fmt = (n: number | null) => (typeof n === "number" ? `${DATA.currency}${n.toLocaleString()}` : "—");

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number)=>void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5 flex-shrink-0">
      {[1,2,3,4,5].map(i=>(
        <motion.button 
          key={i} 
          className="p-0.5 transition-all" 
          aria-label={`rate ${i}`}
          onMouseEnter={()=>setHover(i)} 
          onMouseLeave={()=>setHover(0)} 
          onClick={()=>onChange(i)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              scale: i <= (hover || value) ? 1 : 0.9,
              rotate: i <= (hover || value) ? [0, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <Star 
              className={`h-5 w-5 transition-colors ${
                i <= (hover || value) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              }`} 
            />
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
};

function useQueryParamScores() {
  const [scores, setScores] = useState<any>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const s = q.get("s");
      if (s) {
        setScores(JSON.parse(atob(decodeURIComponent(s))));
        return;
      }
    } catch {}
    const ls = localStorage.getItem("scores");
    if (ls) setScores(JSON.parse(ls));
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("scores", JSON.stringify(scores));
    }
  }, [scores, isClient]);

  return [scores, setScores] as const;
}

const HotelCard = ({ city, hotel, occupancy, score, setScore, setOccupancy }:{
  city:any; hotel:any; occupancy:number; score:number; 
  setScore:(v:number)=>void; setOccupancy:(v:2|3)=>void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGooglePreview, setShowGooglePreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasRating = score > 0;

  // Generate Google search URL for hotel
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + city.name + ' Rajasthan')}`;
  
  // Fallback image - a nice hotel/palace placeholder
  const fallbackImage = `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&q=80`;
  const displayImage = imageError || !hotel.image ? fallbackImage : hotel.image;

  return (
    <motion.div 
      initial={{opacity:0, y:12}} 
      animate={{opacity:1, y:0}} 
      className="w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`overflow-hidden shadow-md hover:shadow-xl transition-all rounded-2xl h-full ${hasRating ? 'ring-2 ring-primary/30' : ''}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100">
          <img
            src={displayImage}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease' }}
          />
          {hasRating && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2"
            >
              <Badge className="bg-green-500">
                ⭐ {score} stars
              </Badge>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute bottom-2 left-2"
          >
            <Button
              size="sm"
              variant="secondary"
              className="rounded-lg shadow-lg backdrop-blur-sm bg-white/90"
              onClick={(e) => {
                e.preventDefault();
                setShowGooglePreview(!showGooglePreview);
              }}
            >
              🗺️ {showGooglePreview ? 'Hide' : 'View on'} Google
            </Button>
          </motion.div>
        </div>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="text-lg font-semibold">{hotel.name}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {city.name}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">
                {city.dates}
              </span>
            </div>
          </div>

          {/* Google Preview Section */}
          <AnimatePresence>
            {showGooglePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border rounded-lg overflow-hidden bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quick Links:</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowGooglePreview(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px]"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-lg text-xs">
                        🔍 Google Search
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(hotel.name + ', ' + city.name + ', Rajasthan')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px]"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-lg text-xs">
                        🗺️ Google Maps
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + city.name + ' reviews')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px]"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-lg text-xs">
                        ⭐ Reviews
                      </Button>
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground text-center pt-1">
                    Click to open in new tab
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Room Options */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Select room type:</div>
            <div className="grid grid-cols-2 gap-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  variant={occupancy === 2 ? "default" : "outline"} 
                  className={`w-full h-auto py-3 flex flex-col items-start relative overflow-hidden ${occupancy === 2 ? 'shadow-lg' : ''}`}
                  onClick={() => setOccupancy(2)}
                >
                  {occupancy === 2 && (
                    <motion.div
                      layoutId="room-selector"
                      className="absolute inset-0 bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-sm font-semibold">2 Person Room</span>
                      {occupancy === 2 && <span className="text-lg">✓</span>}
                    </div>
                    <div className="flex flex-col items-start gap-0.5 w-full">
                      <span className="text-xs font-medium">{fmt(hotel.price2)} / night</span>
                      <span className="text-[10px] opacity-70">{fmt(hotel.price2 / 2)} per person</span>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  variant={occupancy === 3 ? "default" : "outline"} 
                  className={`w-full h-auto py-3 flex flex-col items-start relative overflow-hidden ${occupancy === 3 ? 'shadow-lg' : ''}`}
                  onClick={() => setOccupancy(3)}
                >
                  {occupancy === 3 && (
                    <motion.div
                      layoutId="room-selector"
                      className="absolute inset-0 bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-sm font-semibold">3 Person Room</span>
                      {occupancy === 3 && <span className="text-lg">✓</span>}
                    </div>
                    <div className="flex flex-col items-start gap-0.5 w-full">
                      <span className="text-xs font-medium">{fmt(hotel.price3)} / night</span>
                      <span className="text-[10px] opacity-70">{fmt(hotel.price3 / 3)} per person</span>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Notes if any */}
          {hotel.notes && (
            <div className="text-sm text-muted-foreground">{hotel.notes}</div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 mt-auto pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <StarRating value={score} onChange={setScore} />
            </div>
            
            {hotel.link && (
              <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="rounded-xl w-full">
                  View Hotel <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Page() {
  const [scores, setScores] = useQueryParamScores();
  const [name, setName] = useState("");
  const [occupancy, setOccupancy] = useState<2|3>(2);
  const [activeTab, setActiveTab] = useState<string>("hotels");
  const [search, setSearch] = useState("");
  const [realTimeVotes, setRealTimeVotes] = useState<any>({});
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'votes' | 'name'>('rating');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Admin state
  const [hotelData, setHotelData] = useState<any>(DATA);
  const [cityId, setCityId] = useState(DATA.cities[0].id as string);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    cityId: DATA.cities[0].id,
    name: '',
    price2: '',
    price3: '',
    image: '',
    link: '',
    notes: '',
  });

  const activeCity = useMemo(()=>hotelData.cities.find((c:any)=>c.id===cityId), [cityId, hotelData]);
  const filteredHotels = useMemo(()=>{
    const q = search.trim().toLowerCase();
    if (!q) return activeCity.hotels;
    return activeCity.hotels.filter((h:any)=>h.name.toLowerCase().includes(q) || (h.notes||"").toLowerCase().includes(q));
  }, [search, activeCity]);

  const getScore = (c:any, hid:string)=> (scores?.[c.id]?.[hid] || 0);
  const setScore = (c:any, hid:string, v:number)=>{
    setScores((prev:any)=>({...prev, [c.id]:{...(prev[c.id]||{}), [hid]:v}}));
  };

  // Calculate rating progress
  const ratingProgress = useMemo(() => {
    let totalHotels = 0;
    let ratedHotels = 0;
    hotelData.cities.forEach((c: any) => {
      c.hotels.forEach((h: any) => {
        totalHotels++;
        if (getScore(c, h.id) > 0) ratedHotels++;
      });
    });
    return { total: totalHotels, rated: ratedHotels, percentage: Math.round((ratedHotels / totalHotels) * 100) };
  }, [scores, hotelData]);

  // Fetch votes from API
  const fetchVotes = useCallback(async () => {
    setIsLoadingVotes(true);
    try {
      const response = await fetch('/api/votes');
      const data = await response.json();
      if (data.success) {
        setRealTimeVotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    } finally {
      setIsLoadingVotes(false);
    }
  }, []);

  // Submit a single vote to the API
  const submitVote = async (cityId: string, hotelId: string, rating: number) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cityId,
          hotelId,
          rating,
          occupancy,
        }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error submitting vote:', error);
      return false;
    }
  };

  // Submit all ratings
  const submitAllRatings = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    const rated: any[] = [];
    hotelData.cities.forEach((c: any) => {
      c.hotels.forEach((h: any) => {
        const v = getScore(c, h.id);
        if (v > 0) rated.push({ cityId: c.id, hotelId: h.id, rating: v });
      });
    });

    if (rated.length === 0) {
      alert("Please rate at least one hotel before submitting!");
      setIsSubmitting(false);
      return;
    }

    try {
      const results = await Promise.all(
        rated.map(({ cityId, hotelId, rating }) => 
          submitVote(cityId, hotelId, rating)
        )
      );

      if (results.every(r => r)) {
        setSubmitSuccess(true);
        await fetchVotes();
        setTimeout(() => setSubmitSuccess(false), 3000);
        alert(`✅ Successfully submitted ${rated.length} ratings! Thank you ${name || 'for your feedback'}!`);
      } else {
        alert("Some ratings failed to submit. Please try again.");
      }
    } catch (error) {
      alert("Error submitting ratings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hotel Management Functions
  const fetchHotels = async () => {
    setIsLoadingHotels(true);
    try {
      const response = await fetch('/api/hotels');
      const data = await response.json();
      if (data.success) {
        setHotelData(data.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const addHotel = async () => {
    if (!addForm.name || !addForm.price2 || !addForm.price3) {
      alert('Please fill in hotel name, 2-person price, and 3-person price');
      return;
    }

    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: addForm.cityId,
          hotel: {
            name: addForm.name,
            price2: parseFloat(addForm.price2) || null,
            price3: parseFloat(addForm.price3) || null,
            image: addForm.image,
            link: addForm.link,
            notes: addForm.notes,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Hotel added successfully!');
        setShowAddForm(false);
        setAddForm({
          cityId: hotelData.cities[0].id,
          name: '',
          price2: '',
          price3: '',
          image: '',
          link: '',
          notes: '',
        });
        await fetchHotels();
      } else {
        alert('Failed to add hotel: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel');
    }
  };

  const updateHotel = async (cityId: string, hotelId: string) => {
    try {
      const response = await fetch('/api/hotels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId,
          hotelId,
          updates: {
            name: editForm.name,
            price2: parseFloat(editForm.price2) || null,
            price3: parseFloat(editForm.price3) || null,
            image: editForm.image,
            link: editForm.link,
            notes: editForm.notes,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Hotel updated successfully!');
        setEditingHotelId(null);
        setEditForm({});
        await fetchHotels();
      } else {
        alert('Failed to update hotel: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Error updating hotel');
    }
  };

  const deleteHotel = async (cityId: string, hotelId: string, hotelName: string) => {
    if (!confirm(`Are you sure you want to delete "${hotelName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/hotels?cityId=${cityId}&hotelId=${hotelId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Hotel deleted successfully!');
        await fetchHotels();
      } else {
        alert('Failed to delete hotel: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Error deleting hotel');
    }
  };

  const startEditing = (hotel: any) => {
    setEditingHotelId(hotel.id);
    setEditForm({
      name: hotel.name,
      price2: hotel.price2?.toString() || '',
      price3: hotel.price3?.toString() || '',
      image: hotel.image || '',
      link: hotel.link || '',
      notes: hotel.notes || '',
    });
  };

  // Load votes on mount and when switching to results tab
  useEffect(() => {
    if (activeTab === 'results') {
      fetchVotes();
    } else if (activeTab === 'admin') {
      fetchHotels();
    }
  }, [activeTab, fetchVotes]);

  // Auto-refresh votes every 30 seconds when on results tab
  useEffect(() => {
    if (activeTab === 'results') {
      const interval = setInterval(fetchVotes, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchVotes]);

  const copyShareLink = async ()=>{
    const payload = encodeURIComponent(btoa(JSON.stringify(scores)));
    const url = `${window.location.origin}${window.location.pathname}?s=${payload}`;
    await navigator.clipboard.writeText(url);
    alert("Share link copied");
  };

  const exportCSV = ()=>{
    const rows = [["Name","City","Hotel","Score","Occupancy","Price/night","Link"]];
    hotelData.cities.forEach((c:any)=>{
      c.hotels.forEach((h:any)=>{
        const v = getScore(c, h.id);
        if (v>0) rows.push([name, c.name, h.name, v, occupancy, occupancy===3?h.price3:h.price2, h.link||""]);
      });
    });
    const csv = rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hotel_votes.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const submitToGoogleForm = async ()=>{
    await submitAllRatings();
  };

  // Use real-time votes data
  const resultsData = useMemo(() => {
    const results: any = {};
    hotelData.cities.forEach((c: any) => {
      results[c.id] = {};
      c.hotels.forEach((h: any) => {
        const voteData = realTimeVotes[c.id]?.[h.id];
        if (voteData) {
          results[c.id][h.id] = {
            avgRating: voteData.avgRating || 0,
            numVotes: voteData.count || 0,
            votes: voteData.votes || [],
          };
        } else {
          // Default empty state
          results[c.id][h.id] = {
            avgRating: 0,
            numVotes: 0,
            votes: [],
          };
        }
      });
    });
    return results;
  }, [realTimeVotes, hotelData]);

  // Sort hotels by selected criteria
  const getSortedHotels = (hotels: any[], cityId: string) => {
    return [...hotels].sort((a, b) => {
      const aData = resultsData[cityId]?.[a.id] || { avgRating: 0, numVotes: 0 };
      const bData = resultsData[cityId]?.[b.id] || { avgRating: 0, numVotes: 0 };

      switch (sortBy) {
        case 'rating':
          return (bData.avgRating || 0) - (aData.avgRating || 0);
        case 'votes':
          return (bData.numVotes || 0) - (aData.numVotes || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const ResultsView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">📊 Group Voting Results</h2>
        <p className="text-muted-foreground">See what everyone thinks about each hotel</p>
        {isLoadingVotes && (
          <Badge variant="secondary" className="animate-pulse">
            <TrendingUp className="mr-1 h-3 w-3" /> Refreshing data...
          </Badge>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button 
          size="sm" 
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          onClick={() => setSortBy('rating')}
          className="rounded-full"
        >
          <Star className="mr-1 h-3 w-3" /> Rating
        </Button>
        <Button 
          size="sm" 
          variant={sortBy === 'votes' ? 'default' : 'outline'}
          onClick={() => setSortBy('votes')}
          className="rounded-full"
        >
          <Users className="mr-1 h-3 w-3" /> Votes
        </Button>
        <Button 
          size="sm" 
          variant={sortBy === 'name' ? 'default' : 'outline'}
          onClick={() => setSortBy('name')}
          className="rounded-full"
        >
          <ArrowUpDown className="mr-1 h-3 w-3" /> Name
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={fetchVotes}
          className="rounded-full"
        >
          🔄 Refresh
        </Button>
      </div>

      <Tabs value={cityId} onValueChange={setCityId} className="w-full">
        <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-xl">
          {hotelData.cities.map((c: any) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="rounded-lg px-4 py-2 min-w-[140px] flex items-center justify-center gap-2"
            >
              <span className="font-medium">{c.name}</span>
              <Badge variant="secondary" className="text-xs font-normal">
                {c.dates}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {hotelData.cities.map((c: any) => {
          const sortedHotels = getSortedHotels(c.hotels, c.id);
          return (
            <TabsContent key={c.id} value={c.id} className="mt-8 md:mt-12">
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-4"
                >
                  {sortedHotels.map((h: any, index: number) => {
                    const result = resultsData[c.id]?.[h.id] || { avgRating: 0, numVotes: 0, votes: [] };
                    const hasVotes = result.numVotes > 0;
                    
                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`overflow-hidden shadow-md rounded-2xl transition-all ${hasVotes ? 'ring-2 ring-primary/20' : ''}`}>
                          <div className="relative h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${h.image || ""})` }}>
                            {hasVotes && sortBy === 'rating' && index < 3 && (
                              <Badge className="absolute top-2 right-2 bg-yellow-500">
                                #{index + 1} Top Rated
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4 space-y-4">
                            <div>
                              <div className="text-lg font-semibold mb-2">{h.name}</div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="font-medium">{c.name}</Badge>
                                <span className="text-sm text-muted-foreground font-medium">{c.dates}</span>
                              </div>
                            </div>

                            <div className={`p-4 rounded-lg text-center transition-colors ${hasVotes ? 'bg-primary/10' : 'bg-muted/30'}`}>
                              {hasVotes ? (
                                <>
                                  <div className="text-3xl font-bold text-primary">{result.avgRating.toFixed(1)} ★</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {result.numVotes} {result.numVotes === 1 ? 'vote' : 'votes'}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-2xl font-bold text-muted-foreground">No votes yet</div>
                                  <div className="text-sm text-muted-foreground mt-1">Be the first to rate!</div>
                                </>
                              )}
                            </div>

                            {hasVotes && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Individual Ratings:</div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {result.votes.map((vote: any, idx: number) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="flex items-center justify-between text-sm bg-muted/20 p-2 rounded"
                                    >
                                      <span className="font-medium truncate">{vote.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{vote.occupancy}p</Badge>
                                        <span className="text-yellow-500">{'★'.repeat(vote.rating)}</span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-2 border-t space-y-1">
                              <div className="text-xs text-muted-foreground flex justify-between">
                                <span>2 person: {fmt(h.price2)}</span>
                                <span>({fmt(h.price2 / 2)} pp)</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex justify-between">
                                <span>3 person: {fmt(h.price3)}</span>
                                <span>({fmt(h.price3 / 3)} pp)</span>
                              </div>
                            </div>

                            {h.link && (
                              <a href={h.link} target="_blank" rel="noopener noreferrer" className="w-full block">
                                <Button variant="outline" className="rounded-xl w-full">
                                  View Hotel <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">⚙️ Hotel Management</h2>
        <p className="text-muted-foreground">Add, edit, or delete hotels</p>
        {isLoadingHotels && (
          <Badge variant="secondary" className="animate-pulse">
            Loading hotels...
          </Badge>
        )}
      </div>

      {/* Add Hotel Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          size="lg"
          className="rounded-full"
        >
          <Plus className="mr-2 h-5 w-5" />
          {showAddForm ? 'Cancel' : 'Add New Hotel'}
        </Button>
      </div>

      {/* Add Hotel Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-4">Add New Hotel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <select
                    value={addForm.cityId}
                    onChange={(e) => setAddForm({ ...addForm, cityId: e.target.value })}
                    className="w-full p-2 border rounded-lg mt-1"
                  >
                    {hotelData.cities.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Hotel Name *</label>
                  <Input
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Hotel Raj Palace"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">2 Person Price * ({hotelData.currency})</label>
                  <Input
                    type="number"
                    value={addForm.price2}
                    onChange={(e) => setAddForm({ ...addForm, price2: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">3 Person Price * ({hotelData.currency})</label>
                  <Input
                    type="number"
                    value={addForm.price3}
                    onChange={(e) => setAddForm({ ...addForm, price3: e.target.value })}
                    placeholder="6500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={addForm.image}
                    onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Booking Link</label>
                  <Input
                    value={addForm.link}
                    onChange={(e) => setAddForm({ ...addForm, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={addForm.notes}
                    onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                    placeholder="Near City Palace..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addHotel} className="rounded-xl">
                  <Save className="mr-2 h-4 w-4" /> Save Hotel
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="rounded-xl">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel List by City */}
      <Tabs value={cityId} onValueChange={setCityId} className="w-full">
        <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-xl">
          {hotelData.cities.map((c: any) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="rounded-lg px-4 py-2 min-w-[140px] flex items-center justify-center gap-2"
            >
              <span className="font-medium">{c.name}</span>
              <Badge variant="secondary" className="text-xs font-normal">
                {c.hotels.length} hotels
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {hotelData.cities.map((c: any) => (
          <TabsContent key={c.id} value={c.id} className="mt-8">
            <div className="space-y-4">
              {c.hotels.map((h: any) => (
                <Card key={h.id} className="p-4">
                  {editingHotelId === h.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <h4 className="font-semibold">Editing: {h.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Hotel Name</label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">2 Person Price ({hotelData.currency})</label>
                          <Input
                            type="number"
                            value={editForm.price2}
                            onChange={(e) => setEditForm({ ...editForm, price2: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">3 Person Price ({hotelData.currency})</label>
                          <Input
                            type="number"
                            value={editForm.price3}
                            onChange={(e) => setEditForm({ ...editForm, price3: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Image URL</label>
                          <Input
                            value={editForm.image}
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Booking Link</label>
                          <Input
                            value={editForm.link}
                            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <Input
                            value={editForm.notes}
                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => updateHotel(c.id, h.id)} className="rounded-xl">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                        <Button 
                          onClick={() => {
                            setEditingHotelId(null);
                            setEditForm({});
                          }} 
                          variant="outline" 
                          className="rounded-xl"
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start gap-4">
                      {h.image && (
                        <div 
                          className="w-32 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(${h.image})` }}
                        />
                      )}
                      <div className="flex-grow">
                        <h4 className="font-semibold text-lg">{h.name}</h4>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>2p: {fmt(h.price2)} ({fmt(h.price2 / 2)} pp)</span>
                          <span>3p: {fmt(h.price3)} ({fmt(h.price3 / 3)} pp)</span>
                        </div>
                        {h.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{h.notes}</p>
                        )}
                        {h.link && (
                          <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">
                            View Booking Link →
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          onClick={() => startEditing(h)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteHotel(c.id, h.id, h.name)}
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-6">
          <div className="text-2xl md:text-3xl font-bold">🏜️ {hotelData.tripTitle}</div>
          <div className="opacity-80 mt-2">{hotelData.ctaNote}</div>
        </motion.div>

        {/* Main Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="hotels" className="text-base">Vote on Hotels</TabsTrigger>
            <TabsTrigger value="results" className="text-base">View Results</TabsTrigger>
            <TabsTrigger value="admin" className="text-base">⚙️ Manage</TabsTrigger>
          </TabsList>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="space-y-6">
            {/* Progress Indicator */}
            {ratingProgress.rated > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 p-4 rounded-xl border border-primary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <Badge variant="default">
                    {ratingProgress.rated} / {ratingProgress.total} hotels rated
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ratingProgress.percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-sm opacity-70">Search</label>
                <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search hotels or notes…" />
              </div>
              <div>
                <label className="text-sm opacity-70">Your name (optional)</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Pravin" />
              </div>
            </div>

            <Tabs value={cityId} onValueChange={setCityId} className="w-full">
          <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-xl">
            {hotelData.cities.map((c:any)=>(
              <TabsTrigger 
                key={c.id} 
                value={c.id} 
                className="rounded-lg px-4 py-2 min-w-[140px] flex items-center justify-center gap-2"
              >
                <span className="font-medium">{c.name}</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {c.dates}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {hotelData.cities.map((c:any)=>(
            <TabsContent key={c.id} value={c.id} className="mt-8 md:mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-4">
                {filteredHotels.map((h:any)=>(
                  <div key={h.id} className="flex">
                    <HotelCard 
                      city={c} 
                      hotel={h} 
                      occupancy={occupancy}
                      score={getScore(c,h.id)} 
                      setScore={(v)=>setScore(c,h.id,v)}
                      setOccupancy={setOccupancy}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Button onClick={copyShareLink} className="rounded-2xl" variant="outline">
                Copy Share Link <Heart className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={exportCSV} className="rounded-2xl">
                Export CSV <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={submitToGoogleForm} 
                className="rounded-2xl" 
                disabled={isSubmitting}
                variant={submitSuccess ? "default" : "default"}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Submitting...
                  </>
                ) : submitSuccess ? (
                  <>
                    ✅ Submitted!
                  </>
                ) : (
                  <>
                    Submit My Ratings <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="default" className="bg-green-500">
                    Your ratings were saved!
                  </Badge>
                </motion.div>
              )}
            </div>        <div className="mt-6 text-xs opacity-70">
          Tip: ratings persist in your browser; "Copy Share Link" encodes them in the URL.
        </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <ResultsView />
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin">
            <AdminView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
