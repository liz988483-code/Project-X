export default function DashboardStats() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Conversion Rate</div>
          <div className="text-2xl font-bold">3.2%</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Avg. Order Value</div>
          <div className="text-2xl font-bold">$45.60</div>
        </div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Analytics Chart - Integration with chart library would go here</p>
      </div>
    </div>
  )
}