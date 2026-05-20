'use client';

import {
  User,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
  Shield,
  Building2,
  Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProfileData {
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface WorkspaceData {
  name: string;
  role: string;
}

export default function ProfileMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params.workspace as string;

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        // 1. Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('full_name, email, avatar_url')
          .eq('auth_user_id', user.id)
          .single();

        if (profileError) {
          console.error('[PROFILE DEBUG] Profile fetch error:', profileError);
        } else {
          console.log('[PROFILE DEBUG] Profile data:', profileData);
          setProfile(profileData);
        }

        // 2. Fetch workspace name and user's role in it
        // We use a separate query to be absolutely sure about the workspace details
        const { data: membershipData, error: membershipError } = await supabase
          .from('workspace_members')
          .select('role, workspace_id')
          .eq('user_id', user.id)
          .single();

        if (membershipError) {
          console.error('[PROFILE DEBUG] Membership fetch error:', membershipError);
        } else if (membershipData) {
          console.log('[PROFILE DEBUG] Membership data:', membershipData);
          
          // Now get the workspace name for this specific workspace
          const { data: wsData, error: wsError } = await supabase
            .from('workspaces')
            .select('name')
            .eq('id', membershipData.workspace_id)
            .single();

          if (wsError) {
            console.error('[PROFILE DEBUG] Workspace fetch error:', wsError);
          } else if (wsData) {
            console.log('[PROFILE DEBUG] Workspace data:', wsData);
            setWorkspace({
              name: wsData.name,
              role: membershipData.role,
            });
          }
        }
      } catch (error) {
        console.error('[PROFILE DEBUG] Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (workspaceSlug) {
      fetchProfileData();
    }
  }, [workspaceSlug, router]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 p-2">
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mt-1">
            {workspace?.name || 'Workspace'}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Org Info */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider truncate max-w-[150px]">
                {workspace?.name}
              </span>
            </div>
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase">
              {workspace?.role}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
              <UserCircle className="h-4 w-4 mr-3 text-gray-400" />
              My Profile
            </button>
            <Link 
              href={`/${workspaceSlug}/settings`} 
              onClick={() => setIsUserMenuOpen(false)} 
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <Settings className="h-4 w-4 mr-3 text-gray-400" />
              Account Settings
            </Link>
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
              <Shield className="h-4 w-4 mr-3 text-gray-400" />
              Security & Privacy
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
