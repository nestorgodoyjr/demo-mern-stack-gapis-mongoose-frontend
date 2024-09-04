import React, { useState } from 'react';
import axios from 'axios';

const BusinessSearch = () => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchPlaces = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/places`, {
        params: { type, location, page },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setResults(response.data.data);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
        setCurrentPage(page);
        setSearched(true);
      } else {
        setResults([]);
        setSearched(false);
      }
    } catch (error) {
      setError('Error fetching places');
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchPlaces(newPage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !location) {
      alert('Please enter both type and location!');
      return;
    }
    fetchPlaces(1); // Start from page 1 on new search
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxPagesToShow = 5;

    if (searched && currentPage > 1) {
      buttons.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={loading}>
          Previous
        </button>
      );
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (searched && startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => handlePageChange(1)} disabled={loading}>
          1
        </button>
      );

      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageChange(i)} disabled={i === currentPage || loading}>
          {i}
        </button>
      );
    }

    if (searched && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end">...</span>);
      }

      buttons.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} disabled={loading}>
          {totalPages}
        </button>
      );
    }

    if (searched && currentPage < totalPages) {
      buttons.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={loading}>
          Next
        </button>
      );
    }

    return buttons;
  };

  const downloadCSV = () => {
    if (results.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = ['Place ID', 'Name', 'Address', 'Rating', 'Website', 'Phone Number', 'User Ratings Total', 'Open Now'];
    const rows = results.map(business => [
      business.place_id || '',
      business.name || '',
      business.formatted_address || '',
      business.rating || '',
      business.website || '',
      business.formatted_phone_number || '',
      business.user_ratings_total || '',
      business.opening_hours?.open_now ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'businesses.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <button onClick={downloadCSV} disabled={loading}>
          Download CSV
        </button>
      )}
      <ul>
        {results.length > 0 ? (
          results.map((business) => (
            <li key={business.place_id}>
              <h2><strong>Business Name: </strong>{business.name}</h2>
              <p><strong>Address: </strong>{business.formatted_address}</p>
              <p><strong>Rating: </strong>{business.rating}</p>
              <p><strong>Website: </strong><a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
              <p><strong>Phone Number: </strong>{business.formatted_phone_number}</p>
              <p><strong>Total User Ratings: </strong>{business.user_ratings_total}</p>
              <p><strong>Open Now: </strong>{business.opening_hours?.open_now ? 'Yes' : 'No'}</p>
            </li>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </ul>
      {searched && (
        <div className="pagination">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default BusinessSearch;
