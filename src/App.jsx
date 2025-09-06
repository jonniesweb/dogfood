import React, { useState, useEffect } from "react";

// --- Data tables simplified to grams only ---
const rawTable = [
  { min: 0, max: 5, puppy: [36, 73], adult: [50, 60] },
  { min: 5, max: 10, puppy: [91, 182], adult: [60, 100] },
  { min: 10, max: 25, puppy: [182, 454], adult: [140, 275] },
  { min: 25, max: 50, puppy: [454, 908], adult: [275, 550] },
  { min: 50, max: 75, puppy: [908, 1362], adult: [550, 800] },
  { min: 75, max: 100, puppy: [1362, 1816], adult: [800, 1000] },
  { min: 100, max: 125, puppy: [1816, 2270], adult: [1000, 1200] },
];

const kibbleTable = [
  { weight: 3, cups: { "2-4": 0.33, "4-8": 0.33, "8-12": 0.33, adult: 0.33 } },
  { weight: 5, cups: { "2-4": 1, "4-8": 0.5, "8-12": 0.5, adult: 0.33 } },
  { weight: 10, cups: { "2-4": 1.33, "4-8": 0.75, "8-12": 0.75, adult: 0.66 } },
  { weight: 20, cups: { "2-4": 2.75, "4-8": 1.33, "8-12": 1.33, adult: 1.33 } },
  { weight: 30, cups: { "2-4": 3.33, "4-8": 2.25, "8-12": 2.25, adult: 2 } },
  { weight: 40, cups: { "2-4": 4.33, "4-8": 3, "8-12": 2.66, adult: 2.5 } },
  { weight: 60, cups: { "4-8": 3.75, "8-12": 3, adult: 3.25 } },
  { weight: 80, cups: { "4-8": 5.33, "8-12": 4.25, adult: 4 } },
  { weight: 100, cups: { "4-8": 6.25, "8-12": 5, adult: 4.75 } },
  { weight: 125, cups: { adult: 6 } },
  { weight: 150, cups: { adult: 6.5 } },
  { weight: 175, cups: { adult: 7.5 } },
];

// assume 1 cup kibble = 100g (adjust if needed)
const CUP_TO_GRAMS = 100;

function interpolate(table, weight, isRaw, ageWeeks) {
  if (isRaw) {
    const entry = table.find((r) => weight >= r.min && weight <= r.max);
    if (!entry) return 0;

    const range = ageWeeks < 44 ? entry.puppy : entry.adult;
    // take midpoint of range
    return (range[0] + range[1]) / 2;
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
  const [weight, setWeight] = useState("10");
  const [ageWeeks, setAgeWeeks] = useState("9");
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
        />
        <input
          type="number"
          placeholder="Age (weeks)"
          value={ageWeeks}
          onChange={(e) => setAgeWeeks(e.target.value)}
          className="border p-2 w-full rounded"
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
