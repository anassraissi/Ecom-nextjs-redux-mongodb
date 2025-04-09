"use client";
import React from 'react';
import { 
  HiOutlineCurrencyDollar, 
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineChartBar
} from 'react-icons/hi';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardSection = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value="$24,780" 
          change={12.5} 
          icon={<HiOutlineCurrencyDollar className="h-6 w-6" />}
        />
        <KPICard 
          title="Total Orders" 
          value="1,248" 
          change={8.2} 
          icon={<HiOutlineShoppingCart className="h-6 w-6" />}
        />
        <KPICard 
          title="Products" 
          value="356" 
          change={-2.1} 
          icon={<HiOutlineChartBar className="h-6 w-6" />}
        />
        <KPICard 
          title="Active Users" 
          value="892" 
          change={5.7} 
          icon={<HiOutlineUsers className="h-6 w-6" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Sales Performance</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md">This Year</button>
              <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-md">Last Year</button>
            </div>
          </div>
          <div className="h-80">
            <LineChart />
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Customer Acquisition</h3>
          <div className="h-80">
            <PieChart />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  );
};

// Sub-components
const KPICard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <div className={`mt-4 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
        <span className="ml-1 font-medium">
          {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
        </span>
      </div>
    </div>
  );
};

const LineChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: '2023 Sales',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
};

const PieChart = () => {
  const data = {
    labels: ['Direct', 'Organic', 'Referral', 'Social'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
    },
    maintainAspectRatio: false,
  };

  return <Pie data={data} options={options} />;
};

const RecentOrdersTable = () => {
  const orders = [
    { id: '#3456', customer: 'John Smith', date: '2023-06-15', amount: '$125.00', status: 'Delivered' },
    { id: '#3455', customer: 'Sarah Johnson', date: '2023-06-14', amount: '$89.99', status: 'Shipped' },
    { id: '#3454', customer: 'Michael Brown', date: '2023-06-14', amount: '$234.50', status: 'Processing' },
    { id: '#3453', customer: 'Emily Davis', date: '2023-06-13', amount: '$56.75', status: 'Delivered' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                <div className="text-sm text-gray-500">{order.date}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardSection;