'use client';

import {
  Building2,
  ChevronDown,
  Settings,
  ArrowLeftRight,
  Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface WorkspaceData {
  name: string;
  role: string;
}

export default function WorkspaceMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    async function fetchWorkspaceData() {
      if (!workspaceSlug) {
        setLoading(false);
        return;
      }
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: membershipData } = await supabase
          .from('workspace_members')
          .select('role, workspace_id')
          .eq('user_id', user.id)
          .single();

        if (membershipData) {
          const { data: wsData } = await supabase
            .from('workspaces')
            .select('name')
            .eq('id', membershipData.workspace_id)
            .single();

          if (wsData) {
            setWorkspace({
              name: wsData.name,
              role: membershipData.role,
            });
          }
        }
      } catch (error) {
        console.error('[WORKSPACE DEBUG] Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspaceData();
  }, [workspaceSlug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!workspaceSlug) return null;

  if (loading) {
    return (
      <div className="flex items-center p-2">
        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
      >
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="hidden md:block text-left mr-1">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
            {workspace?.name || 'Workspace'}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm font-bold text-gray-900 truncate">
              {workspace?.name}
            </span>
            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded uppercase">
              {workspace?.role}
            </span>
          </div>

          <div className="py-2 border-b border-gray-100">
            <Link
              href={`/${workspaceSlug}/settings`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3 text-gray-400" />
              Workspace Settings
            </Link>
          </div>

          <div className="py-2">
            <Link
              href="/workspaces"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4 mr-3 text-gray-400" />
              Switch Workspace
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
