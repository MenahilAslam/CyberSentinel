import React, { useState } from 'react';
import { ScanResult, UserProfile } from '../types';
import { storage } from '../utils/storage';
import { RiskBadge } from '../components/RiskBadge';
import {
  User,
  ShieldCheck,
  Award,
  Flame,
  Activity,
  Key,
  Save,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Edit2,
  Check,
} from 'lucide-react';

interface ProfilePageProps {
  scans: ScanResult[];
  onSelectScanDetails: (scan: ScanResult) => void;
  onProfileUpdated: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  scans,
  onSelectScanDetails,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editRole, setEditRole] = useState<string>(profile.role);
  const [editOrg, setEditOrg] = useState<string>(profile.organization);

  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...profile,
      name: editName,
      role: editRole,
      organization: editOrg,
    };
    setProfile(updated);
    storage.saveProfile(updated);
    onProfileUpdated(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Profile Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black font-mono text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="space-y-1">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-100 font-sans">{profile.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-slate-400 hover:text-cyan-400 rounded-md"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-cyan-400">
                    {profile.role} • {profile.organization}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-100 px-3 py-1 rounded text-sm font-sans"
                    placeholder="Full Name"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-100 px-2 py-1 rounded text-xs font-mono"
                      placeholder="Role"
                    />
                    <input
                      type="text"
                      value={editOrg}
                      onChange={(e) => setEditOrg(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-100 px-2 py-1 rounded text-xs font-mono"
                      placeholder="Organization"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1 rounded bg-cyan-500 text-slate-950 text-xs font-bold font-mono"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Security Rating</span>
              <p className="text-2xl font-black font-mono text-emerald-400">{profile.securityScore} / 100</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Active Streak
              </span>
              <p className="text-lg font-black font-mono text-amber-400">{profile.streakDays} Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" /> Total Audits Executed
          </span>
          <p className="text-2xl font-black font-mono text-slate-100">{scans.length}</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> High-Risk Threats Detected
          </span>
          <p className="text-2xl font-black font-mono text-rose-400">
            {scans.filter((s) => s.riskScore >= 60).length}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" /> Academy Quizzes Passed
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400">{profile.quizzesCompleted}</p>
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Earned Cybersecurity Achievements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-start gap-3"
            >
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200 text-sm">{badge.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                {badge.unlockedAt && (
                  <span className="text-[10px] font-mono text-slate-500 block">Unlocked {badge.unlockedAt}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Saved Security History */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-base font-sans">Security Audit Archives</h3>
          <span className="text-xs font-mono text-slate-400">{scans.length} Records</span>
        </div>

        {scans.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono py-4 text-center">No saved scan records in database.</p>
        ) : (
          <div className="space-y-2">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => onSelectScanDetails(scan)}
                className="cursor-pointer p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200 uppercase">{scan.type}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-300 font-mono truncate">{scan.target}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{scan.summary}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <RiskBadge level={scan.riskLevel} size="sm" />
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
