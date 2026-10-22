import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, IndianRupee, Clock, Star, Plus, Check, Compass, AlertCircle, X, ChevronDown, CheckCircle2, Globe2, Layers, LayoutGrid, Sparkles } from 'lucide-react';
import { CatalogItem, Trip, Stop } from '../types/travel';
import { api } from '../lib/api';
import { Interactive3DGlobe } from './Interactive3DGlobe';
import { AddCityToTripModal } from './AddCityToTripModal';
import { GlobeCity } from '../data/globeCities';

interface CatalogSearchViewProps {
  trips: Trip[];
  onActivityAddedToTrip: (updatedTrip: Trip) => void;
  initialQuery?: string;
  onOpenCreateTrip: () => void;
}

export const CatalogSearchView: React.FC<CatalogSearchViewProps> = ({
  trips,
  onActivityAddedToTrip,
  initialQuery = '',
  onOpenCreateTrip,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState('all');
  const [category, setCategory] = useState('all');
  const [costIndex, setCostIndex] = useState('all');
  const [maxDuration, setMaxDuration] = useState<number>(5);

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3D Globe & View Layout State
  const [viewMode, setViewMode] = useState<'split' | 'globe' | 'cards'>('split');
  const [selectedCityForAdd, setSelectedCityForAdd] = useState<GlobeCity | null>(null);
  const [activeGlobeCity, setActiveGlobeCity] = useState<string>(initialQuery || 'Paris');

  // "Add to Trip" Modal State
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<CatalogItem | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<number | ''>('');
  const [selectedStopId, setSelectedStopId] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [adding, setAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGlobeSelectCity = (cityName: string) => {
    setActiveGlobeCity(cityName);
    setQuery(cityName);
    setCountry('all');
    setToastMessage(`Focused on ${cityName}. Experiences updated below!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGlobeAddCity = (city: GlobeCity) => {
    setSelectedCityForAdd(city);
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.searchCatalog({
        query: query.trim() || undefined,
        country: country !== 'all' ? country : undefined,
        category: category !== 'all' ? category : undefined,
        cost_index: costIndex !== 'all' ? costIndex : undefined,
        max_duration: maxDuration < 5 ? maxDuration : undefined,
      });
      setItems(res.items);
      setCountries(res.countries);
    } catch (err: any) {
      setError(err.message || 'Failed to search catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [country, category, costIndex, maxDuration]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const openAddToTripModal = (item: CatalogItem) => {
    setSelectedItemToAdd(item);
    setSelectedTimeSlot(item.recommended_time);

    // Pick first trip if available
    if (trips.length > 0) {
      const firstTrip = trips[0];
      setSelectedTripId(firstTrip.id);

      // Check if any stop matches item city
      const matchingStop = firstTrip.stops?.find(s => s.city_name.toLowerCase() === item.city_name.toLowerCase());
      if (matchingStop) {
        setSelectedStopId(matchingStop.id);
        setSelectedDate(matchingStop.start_date);
      } else if (firstTrip.stops && firstTrip.stops.length > 0) {
        setSelectedStopId(firstTrip.stops[0].id);
        setSelectedDate(firstTrip.stops[0].start_date);
      } else {
        setSelectedStopId('');
        setSelectedDate(firstTrip.start_date);
      }
    } else {
      setSelectedTripId('');
      setSelectedStopId('');
    }
  };

  const handleTripChange = (tripId: number) => {
    setSelectedTripId(tripId);
    const chosenTrip = trips.find(t => t.id === tripId);
    if (chosenTrip && chosenTrip.stops && chosenTrip.stops.length > 0) {
      const matchingStop = chosenTrip.stops.find(s =>
        s.city_name.toLowerCase() === selectedItemToAdd?.city_name.toLowerCase()
      );
      const chosenStop = matchingStop || chosenTrip.stops[0];
      setSelectedStopId(chosenStop.id);
      setSelectedDate(chosenStop.start_date);
    } else {
      setSelectedStopId('');
      if (chosenTrip) setSelectedDate(chosenTrip.start_date);
    }
  };

  const handleConfirmAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToAdd || !selectedTripId) return;

    setAdding(true);
    try {
      const targetTrip = trips.find(t => t.id === Number(selectedTripId));
      let stopId = selectedStopId;

      // If no stop exists, automatically create a stop for this city!
      if (!stopId && targetTrip) {
        const newStopRes = await api.addStop(targetTrip.id, {
          city_name: selectedItemToAdd.city_name,
          country: selectedItemToAdd.country,
          start_date: targetTrip.start_date,
          end_date: targetTrip.end_date,
          transport_mode: 'flight',
        });
        stopId = newStopRes.stop.id;
      }

      const res = await api.addActivity(Number(selectedTripId), {
        stop_id: Number(stopId),
        title: selectedItemToAdd.title,
        description: selectedItemToAdd.description,
        date: selectedDate || targetTrip?.start_date || '2026-06-10',
        time_slot: selectedTimeSlot,
        category: selectedItemToAdd.category,
        cost: Math.round(selectedItemToAdd.cost * 85),
        duration_hours: selectedItemToAdd.duration_hours,
        location: `${selectedItemToAdd.city_name}, ${selectedItemToAdd.country}`,
        booking_status: 'planned',
      });

      onActivityAddedToTrip(res.trip);
      setSelectedItemToAdd(null);
      setToastMessage(`Added "${selectedItemToAdd.title}" to ${targetTrip?.name}!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to add activity to trip');
    } finally {
      setAdding(false);
    }
  };

  const currentChosenTrip = trips.find(t => t.id === Number(selectedTripId));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with 3D Globe View Switcher */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wide">
              Global Discovery
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {items.length} Curated Experiences & Landmarks
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-slate-900 mt-1">
            Destination & City Discovery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spin the 3D globe to discover live hotspots, inspect city pins, and attach destinations or sights directly to your travel itinerary.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Split Explorer</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('globe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewMode === 'globe'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>3D Globe Only</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
            <span>Card Catalog</span>
          </button>
        </div>
      </div>

      {/* 3D Globe Visualization (Snapchat Style Location Radar) */}
      {(viewMode === 'split' || viewMode === 'globe') && (
        <div className="space-y-3">
          <Interactive3DGlobe
            onSelectCity={handleGlobeSelectCity}
            onAddCityToTrip={handleGlobeAddCity}
            selectedCityName={activeGlobeCity}
          />
        </div>
      )}

      {/* Search & Multi-Filters Toolbar (Hidden in 3D Globe Only mode) */}
      {viewMode !== 'globe' && (
        <>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city (e.g. Paris, Tokyo, Rome), sight name, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Country */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
            >
              <option value="all">All Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Activity Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Activity Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="culture">Culture & Museums</option>
              <option value="food">Food & Dining</option>
              <option value="adventure">Nature & Adventure</option>
              <option value="relaxation">Relaxation & Wellness</option>
            </select>
          </div>

          {/* Cost Index */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Cost Index
            </label>
            <select
              value={costIndex}
              onChange={(e) => setCostIndex(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
            >
              <option value="all">All Price Ranges</option>
              <option value="budget">Budget (Free to Low - under ₹2,500)</option>
              <option value="moderate">Moderate (Mid-Range - ₹2,500 to ₹7,500)</option>
              <option value="luxury">Luxury (Premium - over ₹7,500)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
              <span>Max Duration</span>
              <span className="text-sky-600 font-bold">{maxDuration >= 5 ? 'Any' : `${maxDuration}h`}</span>
            </label>
            <input
              type="range"
              min="1.5"
              max="5"
              step="0.5"
              value={maxDuration}
              onChange={(e) => setMaxDuration(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* Catalog Results Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-sky-600/30 border-t-sky-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Searching destination database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No activities match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your price range, duration slider, or searching for other global destinations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span>{item.city_name}, {item.country}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold flex items-center space-x-1 shadow-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.popularity}/100</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-white">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold font-serif-heading leading-tight mt-1 drop-shadow">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration_hours}h duration</span>
                    </span>
                    <span className="capitalize font-medium text-slate-700">
                      Best: {item.recommended_time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Cost & Add to Trip CTA */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Est. Cost</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-sm font-bold text-emerald-600">
                      {item.cost > 0 ? `₹${item.cost.toLocaleString('en-IN')}` : 'Free Entrance'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAddToTripModal(item)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Trip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )}

      {/* "Add to Trip" Configuration Modal */}
      {selectedItemToAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif-heading">
                  Add to Itinerary
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[260px]">
                  {selectedItemToAdd.title} • {selectedItemToAdd.cost > 0 ? `₹${Math.round(selectedItemToAdd.cost * 85).toLocaleString('en-IN')}` : 'Free Entrance'}
                </p>
              </div>
              <button
                onClick={() => setSelectedItemToAdd(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-xs text-slate-600">You don't have any trips created yet.</p>
                <button
                  onClick={() => {
                    setSelectedItemToAdd(null);
                    onOpenCreateTrip();
                  }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
                >
                  Create a Trip First
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmAddActivity} className="p-5 space-y-4">
                {/* Select Trip */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Trip *
                  </label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => handleTripChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.start_date})</option>
                    ))}
                  </select>
                </div>

                {/* Select Stop within Trip */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select City Stop
                  </label>
                  {currentChosenTrip?.stops && currentChosenTrip.stops.length > 0 ? (
                    <select
                      value={selectedStopId}
                      onChange={(e) => {
                        const sId = Number(e.target.value);
                        setSelectedStopId(sId);
                        const found = currentChosenTrip.stops?.find(s => s.id === sId);
                        if (found) setSelectedDate(found.start_date);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    >
                      {currentChosenTrip.stops.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.city_name}, {s.country} ({s.start_date} to {s.end_date})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-sky-700 bg-sky-50 p-2.5 rounded-xl border border-sky-100">
                      A new stop for <strong>{selectedItemToAdd.city_name}</strong> will automatically be created in this trip.
                    </p>
                  )}
                </div>

                {/* Scheduled Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedItemToAdd(null)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    {adding ? (
                      <span>Adding...</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm & Add</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3D Globe Direct Add City Stop Modal */}
      {selectedCityForAdd && (
        <AddCityToTripModal
          city={selectedCityForAdd}
          trips={trips}
          onClose={() => setSelectedCityForAdd(null)}
          onTripUpdated={(updatedTrip) => {
            onActivityAddedToTrip(updatedTrip);
            setToastMessage(`Added ${selectedCityForAdd.name} to itinerary!`);
            setTimeout(() => setToastMessage(null), 3500);
          }}
          onOpenCreateTrip={onOpenCreateTrip}
        />
      )}
    </div>
  );
};
