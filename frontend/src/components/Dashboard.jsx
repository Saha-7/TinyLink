import { useState, useEffect } from 'react';
import { api } from '../services/api';
import LinkForm from './LinkForm';
import LinkTable from './LinkTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLinks();
      setLinks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Delete this link?')) return;
    
    try {
      await api.deleteLink(code);
      fetchLinks();
    } catch (err) {
      alert('Failed to delete link', console.log(err));
    }
  };

  const filteredLinks = links.filter(link =>
     link.code.toLowerCase().includes(searchTerm.toLowerCase()) 
    // ||
    // link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">TinyLink Dashboard</h1>
        
        <LinkForm onSuccess={fetchLinks} />
        
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search by code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && filteredLinks.length === 0 && (
          <p className="text-gray-500">No links found</p>
        )}
        {!loading && filteredLinks.length > 0 && (
          <LinkTable links={filteredLinks} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}