import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, DollarSign, MapPin, List, Eye, Sparkles, ChevronDown, ChevronUp, ChevronRight, Train, Plane, Car, Bus, Ship, Tag, CheckCircle2, Bookmark, Printer, Filter } from 'lucide-react';
import { Trip, Stop, Activity } from '../types/travel';

interface ItineraryDisplayViewProps {
  trip: Trip;
  onOpenOptimizer: () => void;
  onOpenBuilder: () => void;
  onOpenChat: () => void;
}

export const ItineraryDisplayView: React.FC<ItineraryDisplayViewProps> = ({
  trip,
  onOpenOptimizer,
  onOpenBuilder,
  onOpenChat,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Generate an array of all distinct dates across the trip
  const stops = trip.stops || [];
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  const allDates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    allDates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }

  // Map each date to: which stop(s) it belongs to, and activities occurring on that date
  const dayPlan = allDates.map((dateStr, idx) => {
    // Find active stop for this date
    const activeStop = stops.find(s => dateStr >= s.start_date && dateStr <= s.end_date) || stops[0] || null;

    // Activities for this date across all stops
    const dayActivities: Activity[] = [];
    stops.forEach(s => {
      s.activities?.forEach(act => {
        if (act.date === dateStr) {
          dayActivities.push(act);
        }
      });
    });

    const dayCost = dayActivities.reduce((acc, a) => acc + (a.cost || 0), 0);

    return {
      dayNumber: idx + 1,
      date: dateStr,
      stop: activeStop,
      activities: dayActivities,
      totalCost: dayCost,
    };
  });

  const toggleDay = (dateStr: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dateStr]: prev[dateStr] === false ? true : false,
    }));
  };

  const isDayExpanded = (dateStr: string) => expandedDays[dateStr] !== false; // default true

  const toggleAll = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    allDates.forEach(d => {
      updated[d] = expand;
    });
    setExpandedDays(updated);
  };

  const filteredDays = dayPlan.filter(d => {
    if (selectedCityFilter === 'all') return true;
    return d.stop?.city_name === selectedCityFilter;
  });

  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getTimeSlotBadge = (slot: string) => {
    switch (slot) {
      case 'morning':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">Morning</span>;
      case 'afternoon':
        return <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase">Afternoon</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">Evening</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wide">
              Itinerary View & Calendar
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {allDates.length} Days • {stops.length} Cities
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-slate-900 mt-1">
            {trip.name} Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Day-by-day visual layout with scheduled time blocks, locations, and daily cost totals.
          </p>
        </div>

        {/* View Mode Switcher and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-emerald-600" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={onOpenOptimizer}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Optimizer</span>
          </button>

          <button
            onClick={onOpenChat}
            className="px-3.5 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Chat Assistant</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar: City Filter & Expand/Collapse */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* City Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            onClick={() => setSelectedCityFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              selectedCityFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cities
          </button>
          {stops.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedCityFilter(s.city_name)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                selectedCityFilter === s.city_name
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.city_name}
            </button>
          ))}
        </div>

        {/* Expand / Collapse Controls */}
        <div className="flex items-center space-x-2 self-end sm:self-auto text-xs text-slate-500 font-medium">
          <button
            onClick={() => toggleAll(true)}
            className="hover:text-slate-900 transition-colors"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={() => toggleAll(false)}
            className="hover:text-slate-900 transition-colors"
          >
            Collapse All
          </button>
          <span>•</span>
          <button
            onClick={() => window.print()}
            className="hover:text-slate-900 flex items-center space-x-1"
            title="Print Itinerary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: VERTICAL EXPANDABLE TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200/80 before:z-0">
          {filteredDays.map((day) => {
            const isExpanded = isDayExpanded(day.date);
            const isCityFirstDay = day.stop?.start_date === day.date;

            return (
              <div key={day.date} className="relative z-10 pl-12">
                {/* Day Marker Dot on Left Line */}
                <div
                  onClick={() => toggleDay(day.date)}
                  className="absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-sky-600 shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <span className="text-[10px] font-bold text-sky-700">{day.dayNumber}</span>
                </div>

                {/* Day Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all overflow-hidden">
                  {/* Day Header */}
                  <div
                    onClick={() => toggleDay(day.date)}
                    className="p-4 bg-slate-50/70 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">
                            Day {day.dayNumber} • {formatDateHeader(day.date)}
                          </span>
                          {day.stop && (
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{day.stop.city_name}</span>
                            </span>
                          )}
                          {isCityFirstDay && day.stop && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                              Arrival in {day.stop.city_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right text-xs">
                        <span className="font-semibold text-slate-700">
                          {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                        </span>
                        {day.totalCost > 0 && (
                          <span className="ml-2 font-bold text-emerald-600">
                            ${day.totalCost}
                          </span>
                        )}
                      </div>
                      <div className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Day Expanded Activities Timeline Content */}
                  {isExpanded && (
                    <div className="p-5 space-y-3">
                      {day.activities.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500 italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                          Free leisure day in {day.stop?.city_name || 'destination'}. No scheduled activities booked.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {day.activities.map((act) => (
                            <div
                              key={act.id}
                              className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="shrink-0 mt-0.5">
                                  {getTimeSlotBadge(act.time_slot)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                                    {act.title}
                                  </h4>
                                  {act.description && (
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                      {act.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                                    {act.location && (
                                      <span className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        <span>{act.location}</span>
                                      </span>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>{act.duration_hours} hrs</span>
                                    </span>
                                    <span>•</span>
                                    <span className="capitalize">{act.category}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                                {act.booking_status === 'booked' && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                    Confirmed
                                  </span>
                                )}
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-xl">
                                  {act.cost > 0 ? `$${act.cost}` : 'Free'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDays.map((day) => (
              <div
                key={day.date}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition-all flex flex-col justify-between min-h-[180px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {formatDateHeader(day.date)}
                    </span>
                  </div>

                  {day.stop && (
                    <div className="mt-2 text-xs font-bold text-sky-700 flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{day.stop.city_name}</span>
                    </div>
                  )}

                  {/* Activity Titles */}
                  <div className="mt-2 space-y-1.5">
                    {day.activities.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No activities</p>
                    ) : (
                      day.activities.map(act => (
                        <div
                          key={act.id}
                          className="p-1.5 rounded-lg bg-white border border-slate-100 text-[11px] font-medium text-slate-700 truncate"
                          title={act.title}
                        >
                          {act.title} (${act.cost})
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-2 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{day.activities.length} sights</span>
                  <span className="font-bold text-emerald-600">${day.totalCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: COMPACT LIST TABLE */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Day & Date</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Activity Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDays.flatMap((day) => {
                  if (day.activities.length === 0) {
                    return (
                      <tr key={day.date} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          Day {day.dayNumber} ({formatDateHeader(day.date)})
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{day.stop?.city_name || '-'}</td>
                        <td colSpan={5} className="py-3 px-4 text-slate-400 italic">
                          Leisure / Transit day
                        </td>
                      </tr>
                    );
                  }

                  return day.activities.map((act, actIdx) => (
                    <tr key={act.id} className="hover:bg-slate-50/50">
                      {actIdx === 0 ? (
                        <td rowSpan={day.activities.length} className="py-3 px-4 font-semibold text-slate-800 align-top border-r border-slate-100">
                          Day {day.dayNumber} ({formatDateHeader(day.date)})
                        </td>
                      ) : null}
                      {actIdx === 0 ? (
                        <td rowSpan={day.activities.length} className="py-3 px-4 text-slate-700 font-medium align-top border-r border-slate-100">
                          {day.stop?.city_name || '-'}
                        </td>
                      ) : null}
                      <td className="py-3 px-4 capitalize font-medium text-slate-600">{act.time_slot}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{act.title}</td>
                      <td className="py-3 px-4 capitalize text-slate-500">{act.category}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">
                        {act.cost > 0 ? `$${act.cost}` : 'Free'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.booking_status === 'booked' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {act.booking_status}
                        </span>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
