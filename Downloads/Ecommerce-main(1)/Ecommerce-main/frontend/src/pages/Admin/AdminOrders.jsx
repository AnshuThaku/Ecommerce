export default function AdminOrders() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#C8A253]">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage customer orders</p>
      </div>

      {/* Status tabs (visual only) */}
      <div className="flex gap-2 mb-6">
        {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((tab) => (
          <span
            key={tab}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border cursor-default ${
              tab === 'All'
                ? 'bg-[#C8A253]/15 text-[#C8A253] border-[#C8A253]/30'
                : 'text-gray-600 border-white/5'
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Coming soon card */}
      <div className="rounded-xl border border-dashed border-white/10 bg-[#111] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2">Orders Module</p>
        <p className="text-gray-500 text-sm max-w-sm">
          Order tracking, status updates, and Razorpay payment integration will be available here.
        </p>
      </div>
    </div>
  );
}
