import { Link } from 'react-router-dom';

export default function LinkTable({ links, onDelete }) {
  const copyToClipboard = (code) => {
    // Use backend URL for redirects
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const url = `${API_BASE}/${code}`;
  navigator.clipboard.writeText(url);
  alert('Copied to clipboard!');
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
                {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}
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