'use client';

import { 
  Building2, 
  Users, 
  Shield, 
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  FileText
} from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import { PrimaryButton } from '@/components/ui/Button/index';
import { db } from '@/lib/mockdb';

export default function DashboardPage() {
  const entities = db.getEntities();
  const people = db.getPeople();
  const relationships = db.getRelationships();

  const stats = [
    {
      title: "Total Entities",
      value: entities.length.toString(),
      change: "+1",
      changeType: "positive",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Stakeholders",
      value: people.length.toString(),
      change: "+2",
      changeType: "positive",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Relationships",
      value: relationships.length.toString(),
      change: "+3",
      changeType: "positive",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Compliance Health",
      value: "85%",
      change: "-2%",
      changeType: "negative",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentEntities = entities.slice(0, 3).map(e => ({
    id: e.id,
    name: e.short_name || e.legal_name,
    date: new Date(e.created_at).toLocaleDateString(),
    type: e.entity_type.replace('_', ' ').toUpperCase(),
    status: e.status.toUpperCase()
  }));

  const activities = [
    {
      id: 1,
      type: "Entity Created",
      description: `New entity ${entities[0].legal_name} added to portfolio`,
      time: "2 hours ago",
      user: "JD"
    },
    {
      id: 2,
      type: "KYC Completed",
      description: `KYC for ${people[0].full_name} has been verified`,
      time: "5 hours ago",
      user: "SA"
    },
    {
      id: 3,
      type: "Filing Due",
      description: "Annual return filing for Acme Pvt Ltd is due in 10 days",
      time: "Yesterday",
      user: "SYS"
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    {stat.changeType === 'positive' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entity Distribution Chart (Mock) */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Entity Growth</h3>
              <span className="text-2xl font-bold text-gray-900">2 New</span>
            </div>
              <div className="space-y-4">
              <div className="flex items-end space-x-2 h-32">
                {[
                  { month: 'Jan', height: 'h-8' },
                  { month: 'Feb', height: 'h-12' },
                  { month: 'Mar', height: 'h-10' },
                  { month: 'Apr', height: 'h-16' },
                  { month: 'May', height: 'h-24' }
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${item.height} ${
                        item.month === 'May' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance Alert Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                ALERT
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Upcoming Compliance Deadlines</h3>
              <p className="text-blue-100 mb-4">You have 3 entities with filings due in the next 30 days. Action required.</p>
              <PrimaryButton size="sm" className="bg-white text-blue-700 hover:bg-blue-50 border-none">
                Review Deadlines
              </PrimaryButton>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{activity.user}</span>
                      </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

          {/* Recent Entities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entities</h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentEntities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entity.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {entity.date}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {entity.type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entity.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>
        </div>
    </div>
    </MainLayout>
  );
}
