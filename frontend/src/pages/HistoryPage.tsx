export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Extraction History</h1>
      <p className="text-gray-500 mb-6">Previous skill extractions.</p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Timestamp', 'CV File', 'IFU File', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">
                No extractions yet. API integration pending.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
