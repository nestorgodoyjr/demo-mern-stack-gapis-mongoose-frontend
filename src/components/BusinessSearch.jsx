import React, { useState } from 'react';
import axios from 'axios';

const BusinessSearch = () => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!type || !location){
      alert('Please Enter Type and Location!');
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/places`, {
        params: { type, location },
      });
      
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <div>
      <h2>Business Search</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Type (e.g., restaurant)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (e.g., New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((business) => (
          <li key={business.place_id}>
            <h2><strong>Business Name: </strong>{business.name}</h2>
                        <p><strong>Address: </strong>{business.formatted_address}</p>
                        <p><strong>Rating: </strong>{business.rating}</p>
                        <p><strong>Website: </strong><a href={business.website}>{business.website}</a></p>
                        <p><strong>Phone Number: </strong>{business.formatted_phone_number}</p>
                        <p><strong>Total User Ratings: </strong>{business.user_ratings_total}</p>
                        <p><strong>Open Now: </strong>{business.opening_hours?.open_now? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessSearch;
