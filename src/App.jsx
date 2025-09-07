import React, { useState, useEffect } from "react";
import poppyFace from "./poppy-face.png";

// Custom hook for localStorage with useState-like syntax
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? savedValue : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

// weight in lbs to grams of food
const rawTable = [
  { min: 0, max: 5, puppy: [36, 73], adult: [50, 60] },
  { min: 5, max: 10, puppy: [91, 182], adult: [60, 100] },
  { min: 10, max: 25, puppy: [182, 454], adult: [100, 275] },
  { min: 25, max: 50, puppy: [454, 908], adult: [275, 550] },
  { min: 50, max: 75, puppy: [908, 1362], adult: [550, 800] },
  { min: 75, max: 100, puppy: [1362, 1816], adult: [800, 1000] },
  { min: 100, max: 125, puppy: [1816, 2270], adult: [1000, 1200] },
];

// age in months to cups
const kibbleTable = [
  { weight: 3, cups: { "2-4": 0.66, "4-8": 0.5, "8-12": 0.5, adult: 0.33 } },
  { weight: 5, cups: { "2-4": 1, "4-8": 0.75, "8-12": 0.66, adult: 0.5 } },
  { weight: 10, cups: { "2-4": 1.5, "4-8": 1.33, "8-12": 1.25, adult: 0.75 } },
  { weight: 20, cups: { "2-4": 2.75, "4-8": 2.25, "8-12": 1.75, adult: 1.33 } },
  { weight: 30, cups: { "2-4": 3.66, "4-8": 3, "8-12": 2.33, adult: 2 } },
  { weight: 40, cups: { "2-4": 4.5, "4-8": 3.75, "8-12": 3, adult: 2.33 } },
  { weight: 60, cups: { "4-8": 5.25, "8-12": 4.25, adult: 3.25 } },
  { weight: 80, cups: { "4-8": 6.25, "8-12": 5, adult: 4 } },
  { weight: 100, cups: { "8-12": 6, adult: 4.75 } },
  { weight: 125, cups: { "8-12": 7, adult: 5.66 } },
  { weight: 150, cups: { adult: 6.33 } },
  { weight: 175, cups: { adult: 7.25 } },
];

const CUP_TO_GRAMS = 112;

function interpolate(table, weight, isRaw, ageWeeks) {
  if (isRaw) {
    // Determine if puppy or adult
    const isAdult = ageWeeks >= 44;
    
    // Find the weight range that contains our dog's weight
    const range = table.find(r => weight >= r.min && weight <= r.max);
    
    if (!range) return 0;
    
    // Get the appropriate food amounts for puppy or adult
    const foodAmounts = isAdult ? range.adult : range.puppy;
    const [minFood, maxFood] = foodAmounts;
    
    // Linear interpolation within the weight range
    // t represents how far through the range our weight is (0 to 1)
    const t = (weight - range.min) / (range.max - range.min);
    
    // Interpolate between min and max food amounts
    return minFood + t * (maxFood - minFood);
    
  } else {
    // kibble interpolation
    const months = ageWeeks / 4.345;
    let ageKey = "adult";
    if (months < 4) ageKey = "2-4";
    else if (months < 8) ageKey = "4-8";
    else if (months < 12) ageKey = "8-12";

    const lower = [...table].reverse().find((r) => r.weight <= weight);
    const upper = table.find((r) => r.weight >= weight);

    if (!lower || !upper) return 0;
    if (lower.weight === upper.weight)
      return (lower.cups[ageKey] || 0) * CUP_TO_GRAMS;

    const t = (weight - lower.weight) / (upper.weight - lower.weight);
    const lowerVal = (lower.cups[ageKey] || 0) * CUP_TO_GRAMS;
    const upperVal = (upper.cups[ageKey] || 0) * CUP_TO_GRAMS;
    return lowerVal + t * (upperVal - lowerVal);
  }
}

// Component for animated background Poppy faces
function AnimatedPoppyBackground() {
  const [poppyFaces, setPoppyFaces] = useState([]);

  useEffect(() => {
    // Generate random positions and animation properties for Poppy faces
    const faces = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      centerX: 20 + Math.random() * 60, // Center point for orbit (20-80%)
      centerY: 20 + Math.random() * 60, // Center point for orbit (20-80%)
      radius: 50 + Math.random() * 100, // Orbit radius in pixels
      size: 120 + Math.random() * 80, // Random size between 120-200px
      orbitDuration: 15 + Math.random() * 25, // Random orbit duration 15-40s
      spinDuration: 3 + Math.random() * 7, // Random self-spin duration 3-10s
      delay: 0, // Random delay 0-10s
      opacity: 0.15 + Math.random() * 0.25, // Random opacity 0.15-0.4
      clockwise: Math.random() > 0.5, // Random direction
    }));
    setPoppyFaces(faces);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes orbit-clockwise {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(var(--radius)) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(var(--radius)) rotate(-360deg);
          }
        }
        @keyframes orbit-counterclockwise {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(var(--radius)) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-360deg) translateX(var(--radius)) rotate(360deg);
          }
        }
        @keyframes self-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {poppyFaces.map((face) => (
        <div
          key={face.id}
          className="absolute"
          style={{
            left: `${face.centerX}%`,
            top: `${face.centerY}%`,
            '--radius': `${face.radius}px`,
            animation: `${face.clockwise ? 'orbit-clockwise' : 'orbit-counterclockwise'} ${face.orbitDuration}s linear infinite`,
            animationDelay: `${face.delay}s`,
          }}
        >
          <img
            src={poppyFace}
            alt=""
            className="block"
            style={{
              width: `${face.size}px`,
              height: `${face.size}px`,
              opacity: face.opacity,
              animation: `self-spin ${face.spinDuration}s linear infinite`,
              animationDelay: `${face.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [weight, setWeight] = useLocalStorage("dogWeight", "10");
  const [ageWeeks, setAgeWeeks] = useLocalStorage("dogAgeWeeks", "9");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const _weight = parseFloat(weight);
    const _ageWeeks = parseFloat(ageWeeks);
    if (!_weight || !_ageWeeks) {
      setResult(null);
      return;
    }

    const raw = interpolate(rawTable, _weight, true, _ageWeeks);
    const kibble = interpolate(kibbleTable, _weight, false, _ageWeeks);

    setResult({ raw, kibble });
  }, [weight, ageWeeks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <AnimatedPoppyBackground />
      <div className="relative z-10 p-6 max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Dog Food Calculator</h1>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <div className="relative">
            <input
              id="weight"
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border p-2 pr-12 w-full rounded"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              lbs
            </span>
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <div className="relative">
            <input
              id="age"
              type="number"
              placeholder="Enter age"
              value={ageWeeks}
              onChange={(e) => setAgeWeeks(e.target.value)}
              className="border p-2 pr-16 w-full rounded"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              weeks
            </span>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-2">
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Subtotals</p>
            <p>Raw food daily: {result.raw.toFixed(0)} g</p>
            <p>Kibble daily: {result.kibble.toFixed(0)} g</p>
            
            <p>Raw food per serving (3/day): <strong>{(result.raw / 3).toFixed(0)} g</strong></p>
            <p>Kibble per serving (3/day): <strong>{(result.kibble / 3).toFixed(0)} g</strong></p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Feed your dog this for 50% of each food type:</p>
            <p>Raw food (50%): <strong>{(result.raw / 3 / 2).toFixed(0)} g</strong></p>
            <p>Kibble (50%): <strong>{(result.kibble / 3 / 2).toFixed(0)} g</strong></p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
