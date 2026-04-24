import { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import Toast from '../../components/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast(err.response?.data?.error || 'Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      showToast('Order status updated successfully.');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status.', 'error');
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#C8A253]">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage customer orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              tab === filter
                ? 'bg-[#C8A253]/15 text-[#C8A253] border-[#C8A253]/30'
                : 'text-gray-600 border-white/5 hover:border-[#C8A253]/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#111] p-16 flex flex-col items-center justify-center text-center">
          <p className="text-white font-semibold text-lg mb-2">No Orders Found</p>
          <p className="text-gray-500 text-sm">There are no orders matching your filter.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-[#0A0A0A]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#C8A253] uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#C8A253] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#C8A253] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#C8A253] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#C8A253] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-mono">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm text-white">{order.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-white font-semibold">₹{order.totalAmount}</td>
                  <td className="px-4 py-3 text-sm">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-[#1A1A1A] border border-[#C8A253]/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-[#C8A253]/60"
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
