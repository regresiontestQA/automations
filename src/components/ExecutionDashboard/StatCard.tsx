import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`${color} overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl`}>
    <div className="px-4 py-5 sm:p-6">
      <div className="text-3xl font-bold">
        {value}
      </div>
      <p className="mt-1 text-sm text-black opacity-80">
        {title}
      </p>
    </div>
  </div>
);