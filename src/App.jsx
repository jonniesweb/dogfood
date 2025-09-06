import React, { useState, useEffect } from "react";

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

    const daily = (raw + kibble) / 2;
    const perMeal = daily / 3;

    setResult({ raw, kibble, daily, perMeal });
  }, [weight, ageWeeks]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dog Food Calculator</h1>
      <div className="space-y-2">
        <input
          type="number"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 w-full rounded"
          min="0"
        />
        <input
          type="number"
          placeholder="Age (weeks)"
          value={ageWeeks}
          onChange={(e) => setAgeWeeks(e.target.value)}
          className="border p-2 w-full rounded"
          min="0"
        />
      </div>

      {result && (
        <div className="mt-6 space-y-2">
          <p>Raw food daily: {result.raw.toFixed(0)} g</p>
          <p>Kibble daily: {result.kibble.toFixed(0)} g</p>
          
          <p>Raw food per serving (3/day): <strong>{(result.raw / 3).toFixed(0)} g</strong></p>
          <p>Kibble per serving (3/day): <strong>{(result.kibble / 3).toFixed(0)} g</strong></p>
        </div>
      )}
    </div>
  );
}
