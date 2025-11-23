import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";

const AutoPlaceInput = ({ label, value, onChange, id, required, name }) => {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  const API_KEYS = [
    import.meta.env.VITE_Api_key,
    import.meta.env.VITE_Api_key2,
  ];

  const SESSION_TOKEN = "123456";
  const COUNTRY_RESTRICTIONS = "country:pk|country:us";
  const LOCATION = "24.9263,67.0824";

  const fetchSuggestions = async (query) => {
    if (!query) return;

    try {
      const key = API_KEYS[currentKeyIndex];
      const res = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${key}&sessiontoken=${SESSION_TOKEN}&components=${COUNTRY_RESTRICTIONS}&location=${LOCATION}&radius=2000`
      );
      const data = await res.json();
      if (data.status === "OK") {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
        // If the error message includes "over query limit" or any other API error, switch key
        if (data.error_message || data.status !== "OK") {
          setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
        }
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      // If any error occurs (network, API failure, etc.), switch to the next key
      setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), [
    currentKeyIndex,
  ]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    onChange(val);
    debouncedFetch(val);
  };

  const handleSelect = (suggestion) => {
    setInput(suggestion.description);
    onChange(suggestion.description);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        id={id}
        required={required}
        name={name}
        value={input}
        onChange={handleChange}
        placeholder={`Enter ${label.toLowerCase()} location`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg max-h-40 overflow-y-auto shadow-md mt-1 text-sm">
          {suggestions.map((sugg) => (
            <li
              key={sugg.place_id}
              onClick={() => handleSelect(sugg)}
              className="px-3 py-2 hover:bg-rose-100 cursor-pointer"
            >
              {sugg.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoPlaceInput;
