import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Itinerary, DayPlan } from '../../types';
import { DESTINATIONS } from '../../data/destinations';
import { MapPin, Navigation, Eye, Calendar, Sparkles } from 'lucide-react';

interface InteractiveItineraryMapProps {
  itinerary: Itinerary;
  selectedDayNumber?: number | null;
  onSelectDay?: (dayNumber: number) => void;
  highlightedPlace?: string | null;
}

interface MapMarkerPoint {
  dayNumber: number;
  placeName: string;
  phase: 'Morning' | 'Afternoon' | 'Evening';
  description: string;
  lat: number;
  lng: number;
  order: number;
}

export const InteractiveItineraryMap: React.FC<InteractiveItineraryMapProps> = ({
  itinerary,
  selectedDayNumber,
  onSelectDay,
  highlightedPlace
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>(
    selectedDayNumber || 'all'
  );

  useEffect(() => {
    if (selectedDayNumber) {
      setActiveDayFilter(selectedDayNumber);
    }
  }, [selectedDayNumber]);

  // Base destination coordinates from database
  const destMatch = DESTINATIONS.find(d => 
    d.name.toLowerCase().includes(itinerary.destination.toLowerCase()) ||
    itinerary.destination.toLowerCase().includes(d.name.toLowerCase()) ||
    itinerary.tripTitle.toLowerCase().includes(d.name.toLowerCase())
  );

  const baseLat = destMatch?.coordinates.lat || 28.6139;
  const baseLng = destMatch?.coordinates.lng || 77.2090;

  // Compute geocoded points
  const mapPoints: MapMarkerPoint[] = [];
  itinerary.days.forEach((day, dayIdx) => {
    const angleOffset = (dayIdx * (Math.PI / 3));

    if (day.morning) {
      const pName = day.places?.[0] || 'Morning Sights';
      mapPoints.push({
        dayNumber: day.dayNumber,
        placeName: pName,
        phase: 'Morning',
        description: day.morning,
        lat: baseLat + Math.sin(angleOffset) * 0.035,
        lng: baseLng + Math.cos(angleOffset) * 0.035,
        order: 1
      });
    }

    if (day.afternoon) {
      const pName = day.places?.[1] || day.places?.[0] || 'Afternoon Cultural Stop';
      mapPoints.push({
        dayNumber: day.dayNumber,
        placeName: pName,
        phase: 'Afternoon',
        description: day.afternoon,
        lat: baseLat + Math.sin(angleOffset + 0.6) * 0.05,
        lng: baseLng + Math.cos(angleOffset + 0.6) * 0.05,
        order: 2
      });
    }

    if (day.evening) {
      const pName = day.places?.[2] || day.places?.[1] || 'Evening Gathering';
      mapPoints.push({
        dayNumber: day.dayNumber,
        placeName: pName,
        phase: 'Evening',
        description: day.evening,
        lat: baseLat + Math.sin(angleOffset + 1.2) * 0.04,
        lng: baseLng + Math.cos(angleOffset + 1.2) * 0.04,
        order: 3
      });
    }
  });

  const displayedPoints = activeDayFilter === 'all'
    ? mapPoints
    : mapPoints.filter(p => p.dayNumber === activeDayFilter);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [baseLat, baseLng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (displayedPoints.length === 0) return;

    const dayColors = ['#2563EB', '#7C3AED', '#EC4899', '#06B6D4', '#8B5CF6', '#F59E0B'];
    const latLngs: L.LatLngExpression[] = [];

    displayedPoints.forEach((point) => {
      const color = dayColors[(point.dayNumber - 1) % dayColors.length];
      const isHighlighted = highlightedPlace && point.placeName.toLowerCase().includes(highlightedPlace.toLowerCase());

      const iconHtml = `
        <div style="
          background-color: ${isHighlighted ? '#F43F5E' : color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 11px;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
          border: 2px solid white;
          cursor: pointer;
          transform: ${isHighlighted ? 'scale(1.25)' : 'scale(1)'};
          transition: transform 0.2s;
        ">
          ${point.dayNumber}.${point.order}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-travillo-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; padding: 4px; max-width: 220px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
              Day ${point.dayNumber} · ${point.phase}
            </span>
          </div>
          <strong style="font-size: 13px; color: #0F172A; display: block; margin-bottom: 4px;">${point.placeName}</strong>
          <p style="font-size: 11px; color: #475569; margin: 0; line-height: 1.4;">${point.description}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      if (isHighlighted) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
      latLngs.push([point.lat, point.lng]);
    });

    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#7C3AED',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [activeDayFilter, highlightedPlace, itinerary]);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden flex flex-col h-[520px] lg:h-[620px]">
      {/* Map Control Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Interactive Route Map
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {itinerary.destination} · {displayedPoints.length} Waypoints
            </p>
          </div>
        </div>

        {/* Day Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveDayFilter('all');
              if (onSelectDay) onSelectDay(0);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeDayFilter === 'all'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Days
          </button>
          {itinerary.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setActiveDayFilter(day.dayNumber);
                if (onSelectDay) onSelectDay(day.dayNumber);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeDayFilter === day.dayNumber
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Element */}
      <div className="flex-1 w-full relative">
        <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
      </div>
    </div>
  );
};
