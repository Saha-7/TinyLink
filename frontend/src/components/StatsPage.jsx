import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.getLinkStats(code);
      setLink(response.data);
      setError(null);
    } catch (err) {
      setError('Link not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-4 block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Link Statistics</h1>
          
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Short Code:</label>
              <p className="text-lg">{link.code}</p>
            </div>
            
            <div>
              <label className="font-semibold">Target URL:</label>
              <p className="text-blue-600 break-all">{link.target_url}</p>
            </div>
            
            <div>
              <label className="font-semibold">Total Clicks:</label>
              <p className="text-2xl font-bold">{link.clicks}</p>
            </div>
            
            <div>
              <label className="font-semibold">Last Clicked:</label>
              <p>{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}</p>
            </div>
            
            <div>
              <label className="font-semibold">Created:</label>
              <p>{new Date(link.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}