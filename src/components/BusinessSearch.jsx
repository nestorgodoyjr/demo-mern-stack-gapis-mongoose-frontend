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

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/all-data`);

      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
        setTotalPages(1); // All data is in a single page
        setCurrentPage(1);
        setSearched(true);
      } else {
        setResults([]);
        setSearched(false);
      }
    } catch (error) {
      setError('Error fetching all data');
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
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading}
          className={currentPage === 1 ? 'disabled' : ''}
        >
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
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          disabled={loading}
          className={currentPage === 1 ? 'active' : ''}
        >
          1
        </button>
      );
  
      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start">...</span>);
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage || loading}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
  
    if (searched && endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end">...</span>);
      }
  
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
          className={currentPage === totalPages ? 'active' : ''}
        >
          {totalPages}
        </button>
      );
    }
  
    if (searched && currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading}
          className={currentPage === totalPages ? 'disabled' : ''}
        >
          Next
        </button>
      );
    }
  
    return buttons;
  };
  

  const downloadCSV = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/export`, {
        responseType: 'blob' // Ensure the response is treated as a file (blob)
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'businesses.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV');
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
      <h3>Type and Location</h3>
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
      <button onClick={fetchAllData} disabled={loading}>
        See All Existing Data
      </button>
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <button onClick={downloadCSV} disabled={loading}>
          Download All Data as CSV
        </button>
      )}
      {results.length > 0 && (
        <table id="list">
          <thead>
            <tr>
              {/* <th>#</th> */}
              <th>Business Name</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Website</th>
              <th>Phone Number</th>
              <th>Total User Ratings</th>
              <th>Open Now</th>
            </tr>
          </thead>
          <tbody>
            {results.map((business, index) => (
              <tr key={business.place_id}>
                {/* <td className='gapi__font-size'>{business.place_id}</td> */}
                <td className='gapi__font-size'>{business.name}</td>
                <td className='gapi__font-size'>{business.formatted_address}</td>
                <td className='gapi__font-size'>{business.rating}</td>
                <td className='gapi__font-size'>
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    {business.website}
                  </a>
                </td>
                <td className='gapi__font-size'>
                  {business.formatted_phone_number ? (
                    <a href={`tel:${business.formatted_phone_number.replace(/\s+/g, '')}`}>
                      {business.formatted_phone_number}
                    </a>
                  ) : 'N/A'}
                </td>
                <td className='gapi__font-size'>{business.user_ratings_total}</td>
                <td className='gapi__font-size'>
        {business.opening_hours && business.opening_hours.open_now ? 'Yes' : 'No'}
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {searched && (
        <div className="pagination">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default BusinessSearch;
