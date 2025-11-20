import { Link } from 'react-router-dom';

export default function LinkTable({ links, onDelete }) {
  const copyToClipboard = (code) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const url = `${API_BASE}/${code}`;
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  };

  // Format date to local timezone with better readability
  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    
    const date = new Date(dateString);
    
    // Option 1: Simple local format
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Option 2: Relative time (e.g., "2 minutes ago")
    // Uncomment if you prefer this:
    /*
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN');
    */
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Code</th>
            <th className="px-4 py-3 text-left">Target URL</th>
            <th className="px-4 py-3 text-left">Clicks</th>
            <th className="px-4 py-3 text-left">Last Clicked</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-t">
              <td className="px-4 py-3">
                <Link to={`/code/${link.code}`} className="text-blue-600 hover:underline">
                  {link.code}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="truncate max-w-md block" title={link.target_url}>
                  {link.target_url}
                </span>
              </td>
              <td className="px-4 py-3">{link.clicks}</td>
              <td className="px-4 py-3">
                {formatDate(link.last_clicked)}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDelete(link.code)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}