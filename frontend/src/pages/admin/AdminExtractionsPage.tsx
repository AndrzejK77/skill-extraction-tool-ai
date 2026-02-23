export default function AdminExtractionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">All Extractions</h1>
      <p className="text-gray-500 mb-6">Manage and review all extraction results.</p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Timestamp', 'CV File', 'IFU File', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400 italic">
                No extractions yet. API integration pending.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
