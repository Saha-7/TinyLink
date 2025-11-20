import { useState } from 'react';
import { api } from '../services/api';

export default function LinkForm({ onSuccess }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!targetUrl) {
      setError('URL is required');
      return;
    }

    setLoading(true);
    try {
      const data = { target_url: targetUrl };
      if (customCode) data.code = customCode;
      
      await api.createLink(data);
      setSuccess('Link created successfully!');
      setTargetUrl('');
      setCustomCode('');
      onSuccess();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Code already exists');
      } else {
        setError(err.response?.data?.error || 'Failed to create link');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target URL *</label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Custom Code (optional 6-8 characters)
          </label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="mycode"
            pattern="[A-Za-z0-9]{6,8}"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </form>
    </div>
  );
}