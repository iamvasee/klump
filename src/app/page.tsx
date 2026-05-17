'use client';

import { 
  Building2, 
  Users, 
  Shield, 
  ArrowUp,
  ArrowDown,
  FileText
} from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
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
      </div>
    </MainLayout>
  );
}
