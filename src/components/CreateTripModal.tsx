import React, { useState } from 'react';
import { X, Calendar, DollarSign, Image as ImageIcon, Sparkles, Check, AlertCircle, Globe } from 'lucide-react';
import { Trip } from '../types/travel';
import { api } from '../lib/api';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: Trip) => void;
  tripToEdit?: Trip | null;
}

const PRESET_COVERS = [
  { label: 'European Architecture', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tokyo Skyline & Mount Fuji', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Italian Coastal Village', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Swiss Alpine Panorama', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tropical Island Paradise', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'New York City Lights', url: 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=1200&q=80' },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
  tripToEdit,
}) => {
  const isEditing = Boolean(tripToEdit);

  const [name, setName] = useState(tripToEdit?.name || '');
  const [startDate, setStartDate] = useState(tripToEdit?.start_date || '');
  const [endDate, setEndDate] = useState(tripToEdit?.end_date || '');
  const [description, setDescription] = useState(tripToEdit?.description || '');
  const [budgetTotal, setBudgetTotal] = useState<number | string>(tripToEdit?.budget_total ?? 75000);
  const [coverImage, setCoverImage] = useState(tripToEdit?.cover_image || PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [isPublic, setIsPublic] = useState(tripToEdit?.is_public ?? false);
  const [loading, setLoading] = useState(false);

  // Field-specific validation errors for clean inline text in red
  const [nameError, setNameError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate day difference
  let durationDays: number | null = null;
  if (startDate && endDate && startDate <= endDate) {
    const diff = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1;
    durationDays = diff > 0 ? diff : null;
  }

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(null);
    setStartDateError(null);
    setEndDateError(null);
    setGeneralError(null);

    if (!name.trim()) {
      setNameError('Trip title cannot be left blank.');
      isValid = false;
    }

    if (!startDate) {
      setStartDateError('Start date is required.');
      isValid = false;
    }

    if (!endDate) {
      setEndDateError('End date is required.');
      isValid = false;
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      setEndDateError('End date cannot be earlier than the start date.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing && tripToEdit) {
        const res = await api.updateTrip(tripToEdit.id, {
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          description: description.trim(),
          cover_image: coverImage,
          budget_total: Number(budgetTotal) || 0,
          is_public: isPublic,
        });
        onTripCreated(res.trip);
      } else {
        const res = await api.createTrip({
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          description: description.trim(),
          cover_image: coverImage,
          budget_total: Number(budgetTotal) || 0,
          is_public: isPublic,
        });
        onTripCreated(res.trip);
      }
      onClose();
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to save trip. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
              {isEditing ? 'Edit Trip Itinerary' : 'Plan a New Trip'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the destination title, schedule timeline, and budget parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          {generalError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Trip Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError(null);
              }}
              placeholder="e.g. Autumn in Japan & South Korea"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all font-medium ${
                nameError
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 text-rose-900 bg-rose-50/20'
                  : 'border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-900'
              }`}
            />
            {nameError && (
              <p className="text-xs text-rose-600 font-medium mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          {/* Date range with inline validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Start Date *</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value) setStartDateError(null);
                  if (endDate && new Date(endDate) >= new Date(e.target.value)) {
                    setEndDateError(null);
                  }
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                  startDateError
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 text-rose-900 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800'
                }`}
              />
              {startDateError && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{startDateError}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>End Date *</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (e.target.value) {
                    if (startDate && new Date(e.target.value) < new Date(startDate)) {
                      setEndDateError('End date cannot be earlier than start date.');
                    } else {
                      setEndDateError(null);
                    }
                  }
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-all ${
                  endDateError
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 text-rose-900 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800'
                }`}
              />
              {endDateError && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{endDateError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Duration Indicator */}
          {durationDays !== null && !endDateError && (
            <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-sky-800">
              <span className="font-medium">Calculated Schedule:</span>
              <span className="font-bold">{durationDays} Days / {durationDays - 1} Nights</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Trip Description & Travel Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of the vibe, companions, or main bucket-list milestones..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 transition-all resize-none"
            />
          </div>

          {/* Budget Total */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <span className="font-bold text-emerald-600 text-sm">₹</span>
                <span>Target Budget Goal (INR - ₹) *</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Powers Budget Meter
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base select-none">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(e.target.value)}
                placeholder="75000"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 font-bold"
              />
            </div>
            {/* Quick preset chips */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-semibold text-slate-600">Quick set:</span>
              {[25000, 50000, 75000, 100000, 200000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setBudgetTotal(preset)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    Number(budgetTotal) === preset
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Your Budget Meter will remain <strong className="text-emerald-700">Green</strong> while within budget, switch to <strong className="text-amber-700">Yellow</strong> when approaching your limit (&ge;80%), and turn <strong className="text-rose-700">Red</strong> if exceeded.
            </p>
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cover Photo</span>
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {PRESET_COVERS.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => setCoverImage(preset.url)}
                  className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === preset.url
                      ? 'border-sky-600 ring-2 ring-sky-600/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {coverImage === preset.url && (
                    <div className="absolute inset-0 bg-sky-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom URL or file input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Or paste custom image URL..."
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value);
                  if (e.target.value.startsWith('http')) {
                    setCoverImage(e.target.value);
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl cursor-pointer text-center transition-colors">
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleCustomPhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Public Shareability Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Globe className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Public Shared Itinerary</p>
                <p className="text-[11px] text-slate-500">Allow friends to view and copy this trip with a shareable URL</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/20 active:scale-98 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create & Build Itinerary'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
