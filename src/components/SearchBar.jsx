import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="d-flex search-bar" style={{ maxWidth: '400px' }}>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ borderRadius: '20px 0 0 20px' }}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        style={{ borderRadius: '0 20px 20px 0', padding: '0 15px' }}
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
