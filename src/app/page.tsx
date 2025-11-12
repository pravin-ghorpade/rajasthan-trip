'use client';

import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart, Star, Send, TrendingUp, Users, ArrowUpDown, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- constants ----------
const VOTERS = [
  'Pravin',
  'Ranjeet',
  'Bharat',
  'Hiral',
  'Pranjali',
  'Pushkar',
  'Sahil',
  'Sanket',
  'Shreya',
  'Nikita'
];

// ---------- utilities ----------
const formatPrice = (n: number | null, currency: string = '₹') => (typeof n === "number" ? `${currency}${n.toLocaleString()}` : "—");

// Generate or retrieve device fingerprint
const getDeviceId = () => {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
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

const HotelCard = ({ city, hotel, hotelOccupancy, score, setScore, setHotelOccupancy, currency }:{
  city:any; hotel:any; hotelOccupancy:Record<string, 2|3>; score:number; 
  setScore:(v:number)=>void; setHotelOccupancy:(v:Record<string, 2|3>)=>void; currency:string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGooglePreview, setShowGooglePreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasRating = score > 0;
  
  // Get occupancy for this specific hotel, default to 2
  const occupancy = hotelOccupancy[hotel.id] || 2;
  
  // Set occupancy for this specific hotel
  const setOccupancy = (value: 2|3) => {
    setHotelOccupancy({ ...hotelOccupancy, [hotel.id]: value });
  };

  // Helper to format prices
  const fmt = (n: number | null) => formatPrice(n, currency);

  // Generate Google search URL for hotel
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + city.name + ' Rajasthan')}`;
  
  // Fallback image - a nice hotel/palace placeholder
  const fallbackImage = `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&q=80`;
  const displayImage = imageError || !hotel.image ? fallbackImage : hotel.image;

  return (
    <motion.div 
      initial={{opacity:0, y:20, scale: 0.95}} 
      animate={{opacity:1, y:0, scale: 1}} 
      className="w-full h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className={`group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl h-full relative border-2 ${hasRating ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
        {/* Premium Shimmer Effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10"
          animate={isHovered ? { translateX: ['100%', '200%'] } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Image Section with Overlay */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200">
          <motion.img
            src={displayImage}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
            animate={{ 
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          {hasRating && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 right-3 z-10"
            >
              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 shadow-lg px-3 py-1.5 text-sm font-semibold">
                ✓ Selected
              </Badge>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute bottom-3 left-3 z-10"
            transition={{ duration: 0.2 }}
          >
            <Button
              size="sm"
              className="rounded-full shadow-xl backdrop-blur-md bg-white/95 hover:bg-white text-gray-900 border border-white/50 font-medium"
              onClick={(e) => {
                e.preventDefault();
                setShowGooglePreview(!showGooglePreview);
              }}
            >
              <span className="mr-1">🗺️</span>
              {showGooglePreview ? 'Hide Info' : 'Quick View'}
            </Button>
          </motion.div>
        </div>
        <CardContent className="p-5 flex flex-col gap-5">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">{hotel.name}</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
                <span className="text-base">📍</span>
                <span className="text-sm font-bold text-orange-900">{city.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full">
                <span className="text-base">📅</span>
                <span className="text-sm font-semibold text-purple-900">{city.dates}</span>
              </div>
            </div>
          </div>

          {/* Google Preview Section */}
          <AnimatePresence>
            {showGooglePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-2 border-orange-200 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50 p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">🔗 Quick Links</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowGooglePreview(false)}
                      className="h-7 w-7 p-0 hover:bg-red-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-xl text-xs font-medium border-2 hover:bg-blue-50 hover:border-blue-300">
                        <span className="mr-1">🔍</span>
                        Search
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(hotel.name + ', ' + city.name + ', Rajasthan')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-xl text-xs font-medium border-2 hover:bg-green-50 hover:border-green-300">
                        <span className="mr-1">🗺️</span>
                        Maps
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + city.name + ' reviews')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full rounded-xl text-xs font-medium border-2 hover:bg-amber-50 hover:border-amber-300">
                        <span className="mr-1">⭐</span>
                        Reviews
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Room Options */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span>🏨</span>
              <span>Select Room Type</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button 
                  variant={occupancy === 2 ? "default" : "outline"} 
                  className={`w-full h-auto py-4 px-3 flex flex-col items-start relative overflow-hidden rounded-2xl border-2 transition-all ${
                    occupancy === 2 
                      ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white border-orange-500 shadow-lg shadow-orange-200' 
                      : 'bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setOccupancy(2)}
                >
                  {occupancy === 2 && (
                    <motion.div
                      layoutId={`room-selector-${city.id}-${hotel.id}`}
                      className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-pink-400/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 w-full space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold">2 Person</span>
                      {occupancy === 2 && <span className="text-xl">✓</span>}
                    </div>
                    <div className="flex flex-col items-start gap-1 w-full">
                      <span className="text-sm font-bold">{fmt(hotel.price2)}</span>
                      <span className="text-xs opacity-80">{fmt(hotel.price2 / 2)} per person</span>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button 
                  variant={occupancy === 3 ? "default" : "outline"} 
                  className={`w-full h-auto py-4 px-3 flex flex-col items-start relative overflow-hidden rounded-2xl border-2 transition-all ${
                    occupancy === 3 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg shadow-purple-200' 
                      : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setOccupancy(3)}
                >
                  {occupancy === 3 && (
                    <motion.div
                      layoutId={`room-selector-${city.id}-${hotel.id}`}
                      className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 w-full space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold">3 Person</span>
                      {occupancy === 3 && <span className="text-xl">✓</span>}
                    </div>
                    <div className="flex flex-col items-start gap-1 w-full">
                      <span className="text-sm font-bold">{fmt(hotel.price3)}</span>
                      <span className="text-xs opacity-80">{fmt(hotel.price3 / 3)} per person</span>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Notes if any */}
          {hotel.notes && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-200 italic">
              💡 {hotel.notes}
            </div>
          )}

          {/* Bottom Actions - Select Hotel */}
          <div className="flex flex-col gap-4 mt-auto pt-3 border-t-2 border-gray-100">
            <Button
              onClick={() => {
                // Toggle selection - if already selected, deselect; otherwise select this one
                if (score > 0) {
                  setScore(0);
                } else {
                  setScore(1); // Use 1 to indicate selected (vs 0 for not selected)
                }
              }}
              className={`w-full h-12 font-bold text-base rounded-xl transition-all ${
                score > 0
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300'
              }`}
            >
              {score > 0 ? '✓ Selected' : 'Select Hotel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Memoized Add Hotel Form Component
const AddHotelForm = memo(({ 
  cities, 
  currency, 
  onSubmit, 
  onCancel 
}: { 
  cities: any[]; 
  currency: string;
  onSubmit: (form: any) => void; 
  onCancel: () => void;
}) => {
  const [form, setForm] = useState({
    cityId: cities[0]?.id || '',
    name: '',
    price2: '',
    price3: '',
    image: '',
    link: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      key="add-form"
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-2xl rounded-3xl">
        <h3 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-2">
          <span>➕</span>
          <span>Add New Hotel</span>
        </h3>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>🏙️</span>
                <span>City</span>
              </label>
              <select
                value={form.cityId}
                onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-2xl font-medium focus:border-blue-400 focus:outline-none bg-white"
              >
                {cities.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>🏨</span>
                <span>Hotel Name *</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Hotel Raj Palace"
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>💰</span>
                <span>2 Person Price * ({currency})</span>
              </label>
              <Input
                type="number"
                value={form.price2}
                onChange={(e) => setForm({ ...form, price2: e.target.value })}
                placeholder="5000"
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>💰</span>
                <span>3 Person Price * ({currency})</span>
              </label>
              <Input
                type="number"
                value={form.price3}
                onChange={(e) => setForm({ ...form, price3: e.target.value })}
                placeholder="6500"
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>📷</span>
                <span>Image URL</span>
              </label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>🔗</span>
                <span>Booking Link</span>
              </label>
              <Input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                <span>📝</span>
                <span>Notes</span>
              </label>
              <Input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Special notes or instructions"
                autoComplete="off"
                className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <Button type="submit" className="rounded-2xl flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 shadow-lg border-2 border-white/50">
              <Plus className="mr-2 h-5 w-5" /> Add Hotel
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="rounded-2xl bg-white hover:bg-red-50 border-2 border-red-300 hover:border-red-400 font-bold py-6 px-8 text-lg">
              <X className="mr-2 h-5 w-5" /> Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
});

AddHotelForm.displayName = 'AddHotelForm';

// Memoized Edit Hotel Form Component
const EditHotelForm = memo(({
  hotel,
  currency,
  onSubmit,
  onCancel
}: {
  hotel: any;
  currency: string;
  onSubmit: (form: any) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState({
    name: hotel.name || '',
    price2: hotel.price2?.toString() || '',
    price3: hotel.price3?.toString() || '',
    image: hotel.image || '',
    link: hotel.link || '',
    notes: hotel.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="space-y-6">
      <h4 className="font-black text-xl text-gray-900 flex items-center gap-2">
        <span>✏️</span>
        <span>Editing: {hotel.name}</span>
      </h4>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Hotel Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">2 Person Price ({currency})</label>
            <Input
              type="number"
              value={form.price2}
              onChange={(e) => setForm({ ...form, price2: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">3 Person Price ({currency})</label>
            <Input
              type="number"
              value={form.price3}
              onChange={(e) => setForm({ ...form, price3: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Image URL</label>
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Booking Link</label>
            <Input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Notes</label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              autoComplete="off"
              className="border-2 border-gray-300 focus:border-blue-400 rounded-2xl h-12 font-medium"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button type="submit" className="rounded-2xl flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-5 shadow-lg border-2 border-white/50">
            <Save className="mr-2 h-5 w-5" /> Save Changes
          </Button>
          <Button 
            type="button"
            onClick={onCancel}
            variant="outline" 
            className="rounded-2xl bg-white hover:bg-red-50 border-2 border-red-300 hover:border-red-400 font-bold py-5 px-8"
          >
            <X className="mr-2 h-5 w-5" /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
});

EditHotelForm.displayName = 'EditHotelForm';

export default function Page() {
  const [scores, setScores] = useQueryParamScores();
  const [name, setName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [hotelOccupancy, setHotelOccupancy] = useState<Record<string, 2|3>>({});
  const [activeTab, setActiveTab] = useState<string>("hotels");
  const [realTimeVotes, setRealTimeVotes] = useState<any>({});
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'votes' | 'name'>('rating');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Admin state
  const [hotelData, setHotelData] = useState<any>({ 
    tripTitle: 'Rajasthan Trip — Dec 14–21, 2025',
    ctaNote: 'Select your preference for each hotel.',
    currency: '₹',
    cities: [],
    googleForm: { enabled: false }
  });
  const [cityId, setCityId] = useState('');
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    cityId: '',
    name: '',
    price2: '',
    price3: '',
    image: '',
    link: '',
    notes: '',
  });

  const activeCity = useMemo(()=>hotelData.cities.find((c:any)=>c.id===cityId), [cityId, hotelData]);
  const filteredHotels = useMemo(()=>{
    return activeCity?.hotels || [];
  }, [activeCity]);

  // Helper to format prices with currency - memoized
  const fmt = useCallback((n: number | null) => formatPrice(n, hotelData.currency), [hotelData.currency]);

  const getScore = (c:any, hid:string)=> (scores?.[c.id]?.[hid] || 0);
  const setScore = (c:any, hid:string, v:number)=>{
    setScores((prev:any)=>{
      if (v > 0) {
        // When selecting a hotel, clear all other selections in this city
        return {...prev, [c.id]: { [hid]: v }};
      } else {
        // When deselecting, just remove this hotel
        const cityScores = {...(prev[c.id]||{})};
        delete cityScores[hid];
        return {...prev, [c.id]: cityScores};
      }
    });
  };

  // Calculate selection progress
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

  // Calculate total trip cost based on user's selections
  const totalTripCost = useMemo(() => {
    let total = 0;
    let totalPerPerson = 0;
    let selectedCount = 0;
    
    hotelData.cities.forEach((c: any) => {
      c.hotels.forEach((h: any) => {
        const isSelected = getScore(c, h.id) > 0;
        if (isSelected) {
          selectedCount++;
          const occupancy = hotelOccupancy[h.id] || 2;
          const price = occupancy === 2 ? h.price2 : h.price3;
          total += price || 0;
          totalPerPerson += (price || 0) / occupancy;
        }
      });
    });
    
    return { total, totalPerPerson, selectedCount };
  }, [scores, hotelOccupancy, hotelData]);

  // Fetch votes from API
  const fetchVotes = useCallback(async () => {
    setIsLoadingVotes(true);
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/votes?t=${Date.now()}`, {
        cache: 'no-store'
      });
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

  // Submit a single selection to the API
  const submitVote = async (cityId: string, hotelId: string, rating: number) => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cityId,
          hotelId,
          occupancy: hotelOccupancy[hotelId] || 2,
          deviceId,
        }),
      });
      const data = await response.json();
      if (!data.success && data.message) {
        throw new Error(data.message);
      }
      return data.success;
    } catch (error) {
      console.error('Error submitting selection:', error);
      throw error;
    }
  };

  // Submit all selections
  const submitAllRatings = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    const selected: any[] = [];
    hotelData.cities.forEach((c: any) => {
      c.hotels.forEach((h: any) => {
        const v = getScore(c, h.id);
        if (v > 0) selected.push({ cityId: c.id, hotelId: h.id, rating: v });
      });
    });

    if (selected.length === 0) {
      alert("Please select at least one hotel before submitting!");
      setIsSubmitting(false);
      return;
    }

    try {
      const results = await Promise.allSettled(
        selected.map(({ cityId, hotelId, rating }) => 
          submitVote(cityId, hotelId, rating)
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0) {
        const errorMessage = failed[0].status === 'rejected' ? failed[0].reason.message : 'Unknown error';
        alert(`⚠️ ${failed.length} selection(s) failed to submit. ${errorMessage}`);
      } else if (successful === selected.length) {
        setSubmitSuccess(true);
        await fetchVotes();
        setTimeout(() => setSubmitSuccess(false), 3000);
        alert(`✅ Successfully submitted ${selected.length} selection(s)! Thank you ${name || 'for your choices'}!`);
      }
    } catch (error) {
      alert("Error submitting selections. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset all selections for the current user
  const resetSelections = async () => {
    if (!confirm(`Are you sure you want to clear all your selections? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/votes/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, deviceId }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Clear local state
        setScores({});
        setHotelOccupancy({});
        // Force refresh votes data immediately
        await fetchVotes();
        alert(`✅ Successfully cleared all your selections!`);
      } else {
        alert(`❌ Failed to reset selections: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting selections:', error);
      alert("Error resetting selections. Please try again.");
    }
  };

  // Hotel Management Functions
  const fetchHotels = useCallback(async () => {
    setIsLoadingHotels(true);
    try {
      const response = await fetch('/api/hotels');
      const data = await response.json();
      if (data.success) {
        // Sort cities by date
        const sortedData = {
          ...data.data,
          cities: [...data.data.cities].sort((a: any, b: any) => {
            // Extract start date from date string (e.g., "Dec 14–Dec 15" -> "Dec 14")
            const getStartDate = (dateStr: string) => {
              const startDateStr = dateStr.split('–')[0].trim();
              return new Date('2025 ' + startDateStr);
            };
            return getStartDate(a.dates).getTime() - getStartDate(b.dates).getTime();
          })
        };
        
        setHotelData(sortedData);
        // Set initial cityId and addForm.cityId if not set
        if (!cityId && sortedData.cities.length > 0) {
          setCityId(sortedData.cities[0].id);
          setAddForm(prev => ({ ...prev, cityId: sortedData.cities[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setIsLoadingHotels(false);
    }
  }, [cityId]);

  const addHotel = async (formData?: any) => {
    const form = formData || addForm;
    
    if (!form.name || !form.price2 || !form.price3) {
      alert('Please fill in hotel name, 2-person price, and 3-person price');
      return;
    }

    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: form.cityId,
          hotel: {
            name: form.name,
            price2: parseFloat(form.price2),
            price3: parseFloat(form.price3),
            image: form.image,
            link: form.link,
            notes: form.notes,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Hotel added successfully!');
        setShowAddForm(false);
        setAddForm({
          cityId: hotelData.cities[0]?.id || '',
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

  const updateHotel = async (cityId: string, hotelId: string, formData: any) => {
    try {
      console.log('Updating hotel:', { cityId, hotelId, formData });
      
      const response = await fetch('/api/hotels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId,
          hotelId,
          updates: {
            name: formData.name,
            price2: parseFloat(formData.price2) || null,
            price3: parseFloat(formData.price3) || null,
            image: formData.image,
            link: formData.link,
            notes: formData.notes,
          },
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);
      
      if (data.success) {
        alert('✅ Hotel updated successfully!');
        setEditingHotelId(null);
        setEditForm({});
        await fetchHotels();
      } else {
        alert('Failed to update hotel: ' + (data.error || 'Unknown error') + (data.details ? '\n' + data.details : ''));
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Error updating hotel: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  // Load hotels and device ID on mount
  useEffect(() => {
    fetchHotels();
    setDeviceId(getDeviceId());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear scores and occupancy when name changes
  useEffect(() => {
    if (name) {
      setScores({});
      setHotelOccupancy({});
    }
  }, [name, setScores]);

  // Load votes on mount and when switching to results tab
  useEffect(() => {
    if (activeTab === 'results') {
      fetchVotes();
    }
  }, [activeTab, fetchVotes]);

  // Auto-refresh votes every 30 seconds when on results tab
  useEffect(() => {
    if (activeTab === 'results') {
      const interval = setInterval(fetchVotes, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchVotes]);

  const submitToGoogleForm = async ()=>{
    await submitAllRatings();
  };

  // Use real-time votes data (now selection counts)
  const resultsData = useMemo(() => {
    const results: any = {};
    
    hotelData.cities.forEach((c: any) => {
      results[c.id] = {};
      c.hotels.forEach((h: any) => {
        const selectionData = realTimeVotes[c.id]?.[h.id];
        if (selectionData) {
          const count = selectionData.count || 0;
          const selections = selectionData.selections || [];
          results[c.id][h.id] = {
            count, // Total number of selections
            selections, // Array of selection details
          };
        } else {
          // Default empty state
          results[c.id][h.id] = {
            count: 0,
            selections: [],
          };
        }
      });
    });
    return results;
  }, [realTimeVotes, hotelData]);

  // Sort hotels by selected criteria
  const getSortedHotels = (hotels: any[], cityId: string) => {
    return [...hotels].sort((a, b) => {
      const aData = resultsData[cityId]?.[a.id] || { count: 0 };
      const bData = resultsData[cityId]?.[b.id] || { count: 0 };

      switch (sortBy) {
        case 'rating':
          // Sort by selection count (most selected first)
          return (bData.count || 0) - (aData.count || 0);
        case 'votes':
          return (bData.count || 0) - (aData.count || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const ResultsView = () => (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-30" />
          <h2 className="relative text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Group Voting Results
          </h2>
        </div>
        <p className="text-gray-600 font-medium text-lg">See what everyone thinks about each hotel</p>
        {isLoadingVotes && (
          <Badge className="animate-pulse bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-2">
            <TrendingUp className="mr-2 h-4 w-4" /> Refreshing data...
          </Badge>
        )}
      </motion.div>

      {/* Sort Controls */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-3 flex-wrap bg-white/80 backdrop-blur-lg p-4 rounded-3xl border-2 border-purple-200 shadow-xl"
      >
        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span>🔍</span>
          <span>Sort by:</span>
        </span>
        <Button 
          size="sm" 
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          onClick={() => setSortBy('rating')}
          className={`rounded-2xl font-bold border-2 transition-all ${
            sortBy === 'rating' 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg' 
              : 'hover:bg-amber-50 hover:border-amber-300'
          }`}
        >
          <Star className="mr-1 h-4 w-4" /> Selections
        </Button>
        <Button 
          size="sm" 
          variant={sortBy === 'votes' ? 'default' : 'outline'}
          onClick={() => setSortBy('votes')}
          className={`rounded-2xl font-bold border-2 transition-all ${
            sortBy === 'votes' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg' 
              : 'hover:bg-purple-50 hover:border-purple-300'
          }`}
        >
          <Users className="mr-1 h-4 w-4" /> Selections
        </Button>
        <Button 
          size="sm" 
          variant={sortBy === 'name' ? 'default' : 'outline'}
          onClick={() => setSortBy('name')}
          className={`rounded-2xl font-bold border-2 transition-all ${
            sortBy === 'name' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg' 
              : 'hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          <ArrowUpDown className="mr-1 h-4 w-4" /> Name
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={fetchVotes}
          className="rounded-2xl font-bold border-2 hover:bg-green-50 hover:border-green-300"
        >
          🔄 Refresh
        </Button>
      </motion.div>

      <Tabs value={cityId} onValueChange={setCityId} className="w-full">
        <div className="w-full bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4 sm:p-6 rounded-3xl border-2 border-purple-200 shadow-xl backdrop-blur-lg">
          <TabsList className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full h-auto bg-transparent">
            {hotelData.cities.map((c: any) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="rounded-2xl px-4 py-3 sm:px-6 sm:py-4 h-auto flex flex-col items-center justify-center gap-2 bg-white/50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 transition-all hover:scale-102 border-2 border-transparent data-[state=active]:border-white/30"
              >
                <span className="font-black text-base sm:text-lg text-center">{c.name}</span>
                <span className="text-xs font-bold opacity-90 text-center whitespace-nowrap">
                  📅 {c.dates}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {hotelData.cities.map((c: any) => {
          const sortedHotels = getSortedHotels(c.hotels, c.id);
          const winner = sortedHotels[0];
          const winnerData = resultsData[c.id]?.[winner?.id];
          const hasWinner = winnerData && winnerData.count > 0;
          
          return (
            <TabsContent key={c.id} value={c.id} className="mt-10 md:mt-12">
              {/* Winner Banner */}
              {hasWinner && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-3xl border-4 border-yellow-300 shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <span className="text-5xl">🏆</span>
                    <div className="text-center">
                      <div className="text-sm font-bold text-amber-900 uppercase tracking-wide">Most Selected for {c.name}</div>
                      <div className="text-3xl font-black text-white mt-1">{winner.name}</div>
                      <div className="text-sm font-bold text-amber-900 mt-2">
                        {winnerData.count} selection{winnerData.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className="text-5xl">🏆</span>
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2"
                >
                  {sortedHotels.map((h: any, index: number) => {
                    const result = resultsData[c.id]?.[h.id] || { count: 0, selections: [] };
                    const hasSelections = result.count > 0;
                    
                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ y: -8 }}
                      >
                        <Card className={`overflow-hidden shadow-lg hover:shadow-2xl rounded-3xl transition-all duration-300 border-2 ${
                          hasSelections ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-gray-200 bg-white hover:border-purple-300'
                        }`}>
                          <div className="relative h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${h.image || ""})` }}>
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            
                            {hasSelections && sortBy === 'rating' && index < 3 && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Badge className={`absolute top-3 right-3 border-2 border-white/50 shadow-xl px-4 py-2 text-sm font-black ${
                                  index === 0 
                                    ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 text-base'
                                    : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                }`}>
                                  {index === 0 ? '👑 MOST SELECTED' : `🏆 #${index + 1}`}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <CardContent className="p-6 space-y-5">
                            <div>
                              <h3 className="text-xl font-black mb-3 text-gray-900">{h.name}</h3>
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <Badge className="bg-purple-100 text-purple-900 font-bold border-2 border-purple-200 px-3 py-1">
                                  {c.name}
                                </Badge>
                                <span className="text-sm text-gray-600 font-semibold">{c.dates}</span>
                              </div>
                            </div>

                            <div className={`p-5 rounded-2xl text-center transition-all border-2 ${
                              hasSelections 
                                ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300' 
                                : 'bg-gray-50 border-gray-200'
                            }`}>
                              {hasSelections ? (
                                <>
                                  <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {result.count}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-2 font-bold">
                                    {result.count === 1 ? 'selection' : 'selections'}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-2xl font-black text-gray-400">No selections yet</div>
                                  <div className="text-sm text-gray-500 mt-1 font-medium">Be the first to select!</div>
                                </>
                              )}
                            </div>

                            {hasSelections && (
                              <div className="space-y-3">
                                <div className="text-sm font-black text-gray-700 flex items-center gap-2">
                                  <span>👥</span>
                                  <span>Who Selected This</span>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                  {result.selections.map((selection: any, idx: number) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors"
                                    >
                                      <span className="font-bold truncate text-gray-900">{selection.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge className="text-xs font-bold bg-blue-100 text-blue-900 border-2 border-blue-200">
                                          {selection.occupancy}p
                                        </Badge>
                                        <span className="text-green-500 font-bold">✓</span>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t-2 border-gray-200 space-y-2">
                              <div className="text-sm text-gray-700 flex justify-between font-bold">
                                <span>2 person:</span>
                                <div className="text-right">
                                  <div>{fmt(h.price2)}</div>
                                  <div className="text-xs text-gray-500">({fmt(h.price2 / 2)} pp)</div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-700 flex justify-between font-bold">
                                <span>3 person:</span>
                                <div className="text-right">
                                  <div>{fmt(h.price3)}</div>
                                  <div className="text-xs text-gray-500">({fmt(h.price3 / 3)} pp)</div>
                                </div>
                              </div>
                            </div>
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
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-30" />
          <h2 className="relative text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ⚙️ Hotel Management
          </h2>
        </div>
        <p className="text-gray-600 font-medium text-lg">Add, edit, or delete hotels</p>
        {isLoadingHotels && (
          <Badge className="animate-pulse bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-2">
            Loading hotels...
          </Badge>
        )}
      </motion.div>

      {/* Add Hotel Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <Button 
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          size="lg"
          className={`rounded-3xl px-8 py-6 text-lg font-black shadow-xl border-2 transition-all ${
            showAddForm 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-red-300' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-blue-300'
          }`}
        >
          <Plus className="mr-2 h-6 w-6" />
          {showAddForm ? 'Cancel' : 'Add New Hotel'}
        </Button>
      </motion.div>

      {/* Add Hotel Form */}
      <AnimatePresence mode="wait">
        {showAddForm && (
          <AddHotelForm
            cities={hotelData.cities}
            currency={hotelData.currency}
            onSubmit={addHotel}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Hotel List by City */}
      <Tabs value={cityId} onValueChange={setCityId} className="w-full">
        <div className="w-full bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-6 rounded-3xl border-2 border-blue-200 shadow-xl backdrop-blur-lg">
          <TabsList className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full h-auto bg-transparent">
            {hotelData.cities.map((c: any) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="rounded-2xl px-4 py-3 sm:px-6 sm:py-4 h-auto flex flex-col items-center justify-center gap-1 bg-white/50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 transition-all hover:scale-102 border-2 border-transparent data-[state=active]:border-white/30"
              >
                <span className="font-black text-base sm:text-lg text-center">{c.name}</span>
                <span className="text-xs font-bold opacity-90 text-center whitespace-nowrap">
                  📅 {c.dates}
                </span>
                <span className="text-xs font-semibold opacity-75 text-center">
                  {c.hotels.length} {c.hotels.length === 1 ? 'hotel' : 'hotels'}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {hotelData.cities.map((c: any) => (
          <TabsContent key={c.id} value={c.id} className="mt-6 sm:mt-10">
            <div className="space-y-5">
              {c.hotels.map((h: any) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all rounded-3xl border-2 border-gray-200 hover:border-blue-300 bg-white">
                    {editingHotelId === h.id ? (
                      // Edit Mode
                      <EditHotelForm
                        hotel={h}
                        currency={hotelData.currency}
                        onSubmit={(formData) => updateHotel(c.id, h.id, formData)}
                        onCancel={() => {
                          setEditingHotelId(null);
                          setEditForm({});
                        }}
                      />
                    ) : (
                      // View Mode
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        {h.image && h.image.startsWith('http') && (
                          <div 
                            className="w-full sm:w-40 h-40 sm:h-32 bg-cover bg-center rounded-2xl flex-shrink-0 border-2 border-gray-200 shadow-md"
                            style={{ backgroundImage: `url(${h.image})` }}
                          />
                        )}
                        <div className="flex-grow space-y-3 w-full">
                          <h4 className="font-black text-lg sm:text-xl text-gray-900">{h.name}</h4>
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
                            <div className="bg-orange-100 px-4 py-2 rounded-xl border-2 border-orange-200">
                              <span className="font-bold text-orange-900">2p: {fmt(h.price2)}</span>
                              <span className="text-orange-700 ml-2">({fmt(h.price2 / 2)} pp)</span>
                            </div>
                            <div className="bg-purple-100 px-4 py-2 rounded-xl border-2 border-purple-200">
                              <span className="font-bold text-purple-900">3p: {fmt(h.price3)}</span>
                              <span className="text-purple-700 ml-2">({fmt(h.price3 / 3)} pp)</span>
                            </div>
                          </div>
                          {h.notes && (
                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-200 italic font-medium">
                              💡 {h.notes}
                            </div>
                          )}
                          {h.link && (
                            <a href={h.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1">
                              View Booking Link <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                          <Button 
                            type="button"
                            onClick={() => startEditing(h)}
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 hover:border-blue-400 font-bold px-4 py-5"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => deleteHotel(c.id, h.id, h.name)}
                            variant="destructive"
                            size="sm"
                            className="flex-1 sm:flex-none rounded-2xl bg-red-500 hover:bg-red-600 border-2 border-red-300 font-bold px-4 py-5"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Animated Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Animated Gradient Base */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 176, 59, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(255, 82, 82, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(156, 39, 176, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 70%, rgba(3, 169, 244, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 176, 59, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        
        {/* Floating Shapes - More vibrant */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-2xl"
            style={{
              width: Math.random() * 400 + 150,
              height: Math.random() * 400 + 150,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4,
              background: `radial-gradient(circle, ${
                ['rgba(255, 176, 59, 0.5)', 'rgba(255, 82, 82, 0.5)', 'rgba(156, 39, 176, 0.5)', 'rgba(3, 169, 244, 0.5)'][i % 4]
              } 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, Math.random() * 150 - 75, 0],
              y: [0, Math.random() * 150 - 75, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-8 lg:p-12 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{opacity:0,y:-20, scale: 0.9}} 
          animate={{opacity:1,y:0, scale: 1}} 
          className="mb-6 sm:mb-10 text-center"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="relative inline-block">
            {/* Decorative background for title */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            
            <motion.div 
              className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent py-2"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              🏜️ {hotelData.tripTitle}
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-4 text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {hotelData.ctaNote}
          </motion.div>
        </motion.div>

        {/* Main Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-10 bg-white/80 backdrop-blur-lg p-2 rounded-3xl shadow-xl border-2 border-orange-200 h-auto">
            <TabsTrigger 
              value="hotels" 
              className="text-base font-bold rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-4"
            >
              🏨 Vote
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="text-base font-bold rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-4"
            >
              📊 Results
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="text-base font-bold rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-4"
            >
              ⚙️ Manage
            </TabsTrigger>
          </TabsList>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl shadow-xl border-2 border-orange-200">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                  <span>👤</span>
                  <span>Your Name *</span>
                </label>
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 focus:border-orange-400 rounded-2xl h-12 text-base font-medium focus:outline-none bg-white"
                  required
                >
                  <option value="">Select your name</option>
                  {VOTERS.map((voter) => (
                    <option key={voter} value={voter}>{voter}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            <Tabs value={cityId} onValueChange={setCityId} className="w-full">
          <div className="w-full bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-4 sm:p-6 rounded-3xl border-2 border-orange-200 shadow-xl backdrop-blur-lg">
            <TabsList className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full h-auto bg-transparent">
              {hotelData.cities.map((c:any)=>{
                // Check if user has selected a hotel for this city
                const hasSelection = c.hotels.some((h: any) => getScore(c, h.id) > 0);
                
                return (
                  <TabsTrigger 
                    key={c.id} 
                    value={c.id} 
                    className="rounded-2xl px-4 py-3 sm:px-6 sm:py-4 h-auto flex flex-col items-center justify-center gap-2 bg-white/50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 transition-all hover:scale-102 border-2 border-transparent data-[state=active]:border-white/30 relative"
                  >
                    {hasSelection && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="absolute -top-2 -right-2 z-10"
                      >
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-white shadow-lg px-2 py-1 text-xs font-black">
                          ✓
                        </Badge>
                      </motion.div>
                    )}
                    <span className="font-black text-base sm:text-lg text-center">{c.name}</span>
                    <span className="text-xs font-bold opacity-90 text-center whitespace-nowrap">
                      📅 {c.dates}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {hotelData.cities.map((c:any)=>(
            <TabsContent key={c.id} value={c.id} className="mt-10 md:mt-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-2"
              >
                {filteredHotels.map((h:any)=>(
                  <div key={h.id} className="flex">
                    <HotelCard 
                      city={c} 
                      hotel={h} 
                      hotelOccupancy={hotelOccupancy}
                      score={getScore(c,h.id)} 
                      setScore={(v)=>setScore(c,h.id,v)}
                      setHotelOccupancy={setHotelOccupancy}
                      currency={hotelData.currency}
                    />
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

            <div className="mt-12 flex justify-center items-center gap-6 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={submitToGoogleForm} 
                  className="rounded-3xl px-12 py-7 text-lg font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 shadow-2xl hover:shadow-3xl transition-all border-2 border-white/50 relative overflow-hidden group" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <motion.span 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.span> 
                        <span>Submitting...</span>
                      </>
                    ) : submitSuccess ? (
                      <>
                        <span>✅</span>
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Submit My Selections</span>
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={resetSelections} 
                  variant="outline"
                  className="rounded-3xl px-8 py-7 text-lg font-black bg-white hover:bg-red-50 border-2 border-red-300 hover:border-red-500 text-red-600 hover:text-red-700 shadow-xl hover:shadow-2xl transition-all" 
                  size="lg"
                >
                  <span className="flex items-center gap-3">
                    <span>🗑️</span>
                    <span>Reset Selections</span>
                  </span>
                </Button>
              </motion.div>
              
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  className="flex items-center"
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 shadow-2xl border-2 border-white/50 text-base font-bold">
                    🎉 Your selections were saved!
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Total Trip Cost Display */}
            {totalTripCost.selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-8 max-w-2xl mx-auto"
              >
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 rounded-3xl border-2 border-emerald-300 shadow-xl">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">💰</span>
                      <h3 className="text-lg font-black text-gray-800">Your Trip Cost (Per Person)</h3>
                    </div>
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatPrice(totalTripCost.totalPerPerson, hotelData.currency)}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {totalTripCost.selectedCount === hotelData.cities.length ? (
                        <span>🎯 Perfect! You've selected a hotel for each city. Ready to explore Rajasthan! 🐪</span>
                      ) : (
                        <span>📍 {totalTripCost.selectedCount} of {hotelData.cities.length} cities selected · Keep picking your favorites!</span>
                      )}
                    </p>
                    {totalTripCost.selectedCount === hotelData.cities.length && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 px-4 py-2 text-sm font-bold border-2 border-amber-300">
                          ✨ Complete itinerary ready!
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="mt-8 text-sm text-gray-600 text-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 max-w-2xl mx-auto">
              💡 <span className="font-medium">Tip:</span> Your ratings are saved automatically in your browser
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
