import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";

const GoMapsAutocomplete = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  const API_KEY = `${import.meta.env.VITE_Api_key}`;
  const SESSION_TOKEN = "123456"; // You can use UUID here
  const COUNTRY_RESTRICTIONS = "country:us|country:pk"; // customize this
  const LOCATION = "24.9263,67.0824"; // near NED Karachi, if needed

  const fetchSuggestions = async (query) => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${API_KEY}&sessiontoken=${SESSION_TOKEN}&components=${COUNTRY_RESTRICTIONS}&location=${LOCATION}&radius=2000`
      );

      const data = await res.json();
      if (data.status === "OK") {
        setSuggestions(data.predictions);
      } else {
        console.warn("Autocomplete error:", data.status);
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Debounce the fetchSuggestions function
  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedFetch(value);
  };

  const handleSelect = (place) => {
    setSelected(place);
    setInput(place.description);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        value={input}
        onChange={handleChange}
        placeholder="Search location..."
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 999,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div style={{ marginTop: "10px", color: "green" }}>
          Selected: {selected.description}
        </div>
      )}
    </div>
  );
};

export default GoMapsAutocomplete;
