// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../utils/axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import { User, Mail, Calendar, Hash } from 'lucide-react';

// export default function AdminUsers() {
//   const { user } = useAuth();
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await axiosInstance.get('/admin/users');
//         setCustomers(response.data.users || []);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch customers');
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <div className="w-8 h-8 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-2xl font-serif text-[#C8A253]">Users</h1>
//         <p className="text-gray-500 text-sm mt-1">View and manage registered customer accounts</p>
//       </div>

//       {/* Customer List */}
//       <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-zinc-400">
//             <thead className="bg-[#1A1A1A] text-xs uppercase font-medium text-zinc-500 border-b border-zinc-800">
//               <tr>
//                 <th className="px-6 py-4">Customer Name</th>
//                 <th className="px-6 py-4">Email Address</th>
//                 <th className="px-6 py-4">Customer ID</th>
//                 <th className="px-6 py-4">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-zinc-800/50">
//               {customers.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
//                     No customers found.
//                   </td>
//                 </tr>
//               ) : (
//                 customers.map((customer) => (
//                   <tr key={customer._id} className="hover:bg-zinc-800/30 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[#C8A253] font-medium text-xs">
//                           {customer.name?.charAt(0).toUpperCase() || 'U'}
//                         </div>
//                         <span className="font-medium text-white">{customer.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Mail size={14} className="text-zinc-500" />
//                         {customer.email}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Hash size={14} className="text-zinc-500" />
//                         <span className="font-mono text-xs">{customer._id.slice(-6)}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                        <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-medium uppercase tracking-wider">
//                          Active
//                        </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../utils/axiosInstance';
// import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

// ---------------------------------------------------------
// ⚠️ PREVIEW KE LIYE MOCK DATA: 
// Apne project mein inhe hata kar upar wale asli imports ko un-comment kar lein.
// ---------------------------------------------------------
const useAuth = () => {
  return { user: { name: 'Admin', role: 'super-admin' } };
};

const axiosInstance = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { 
      data: { 
        users: [
          { _id: 'd2450e', name: 'khushi', email: 'khushi@2004' },
          { _id: 'fc057d', name: 'prachi kushwaha', email: 'prachi34@gmail.com' },
          { _id: '378432', name: 'pranita kushwaha', email: 'prani@gmail.com' },
          { _id: '12b6f0', name: 'prachi', email: 'pratima@gmail.com' },
        ] 
      } 
    };
  }
};
// ---------------------------------------------------------

export default function AdminUsers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users');
        setCustomers(response.data.users || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-2 border-[#C8A253] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-serif text-[#C8A253]">Users</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage registered customer accounts</p>
      </motion.div>

      {/* Customer List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase font-medium text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <User className="w-10 h-10 text-gray-300 mb-3" />
                      No customers found.
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={customer._id} 
                    className="hover:bg-white transition-colors bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C8A253]/10 flex items-center justify-center text-[#C8A253] font-bold text-xs">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-800">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-gray-400" />
                        <span className="font-mono text-xs text-gray-500">{customer._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-wider">
                         Active
                       </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}