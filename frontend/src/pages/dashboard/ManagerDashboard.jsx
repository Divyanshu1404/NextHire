import React from 'react';
import { useSelector } from 'react-redux';
import { Users, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

const ManagerDashboard = () => {
  const { user } = useSelector(state => state.auth);

  const stats = [
    { title: 'My Open Reqs', value: '3', icon: ClipboardList },
    { title: 'Candidates to Review', value: '15', icon: Clock },
    { title: 'Interviews Scheduled', value: '4', icon: Users },
    { title: 'Hired this Quarter', value: '2', icon: CheckCircle },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main mb-2">Manager Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.name}. Review candidates for your open positions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-main mb-4">Candidates Awaiting Review</h2>
        <div className="text-muted text-center py-8">
          Candidate list will be displayed here.
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
