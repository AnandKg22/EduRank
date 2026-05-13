import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useToast } from '../../../components/ui/Toast';

/**
 * Enterprise Administration Operations Gateway
 * Conditionally mounts dynamic role workflows directly inside the strategic battle dashboard.
 */
export const AdminManagementPanel = () => {
  const profile = useAuthStore((s) => s.profile);
  const { showToast } = useToast();

  // ── States ──
  const [organizations, setOrganizations] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // SuperAdmin: Create Org Form
  const [orgName, setOrgName] = useState('');
  const [orgColor, setOrgColor] = useState('#6D28D9');
  const [creatingOrg, setCreatingOrg] = useState(false);

  // SuperAdmin: Assign TenantAdmin Form
  const [targetUserAdmin, setTargetUserAdmin] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [assigningAdmin, setAssigningAdmin] = useState(false);

  // TenantAdmin: Assign Faculty Form
  const [targetUserFaculty, setTargetUserFaculty] = useState('');
  const [assigningFaculty, setAssigningFaculty] = useState(false);

  // Faculty: Question Ingestion Form
  const [subject, setSubject] = useState('Computer Science');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('0');
  const [ingestingQuestion, setIngestingQuestion] = useState(false);

  // Initial lookup fetch
  useEffect(() => {
    const fetchOrgs = async () => {
      setLoadingList(true);
      const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        setOrganizations(data);
        if (data.length > 0) setSelectedOrgId(data[0].id);
      }
      setLoadingList(false);
    };

    if (profile?.role === 'SuperAdmin') {
      fetchOrgs();
    }
  }, [profile?.role]);

  if (!profile || profile.role === 'Student') return null;

  // ── Handlers ──

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setCreatingOrg(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert([{ name: orgName.trim(), branding_color: orgColor }])
        .select()
        .single();

      if (error) throw error;
      setOrganizations((prev) => [...prev, data]);
      setOrgName('');
      showToast('Institution registered successfully! 🏛️', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleAssignTenantAdmin = async (e) => {
    e.preventDefault();
    if (!targetUserAdmin.trim() || !selectedOrgId) return;
    setAssigningAdmin(true);
    try {
      // Find user by username
      const { data: users, error: findErr } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', targetUserAdmin.trim());

      if (findErr) throw findErr;
      if (!users || users.length === 0) {
        throw new Error(`Account matching "${targetUserAdmin}" not found.`);
      }

      const targetId = users[0].id;
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: 'TenantAdmin', organization_id: selectedOrgId })
        .eq('id', targetId);

      if (updateErr) throw updateErr;
      showToast(`Elevated ${users[0].username} to TenantAdmin! 🛡️`, 'success');
      setTargetUserAdmin('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAssigningAdmin(false);
    }
  };

  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    if (!targetUserFaculty.trim()) return;
    setAssigningFaculty(true);
    try {
      const { data: users, error: findErr } = await supabase
        .from('profiles')
        .select('id, username, organization_id')
        .ilike('username', targetUserFaculty.trim());

      if (findErr) throw findErr;
      if (!users || users.length === 0) {
        throw new Error(`Account matching "${targetUserFaculty}" not found.`);
      }

      const targetUser = users[0];
      if (targetUser.organization_id !== profile.organization_id) {
        throw new Error('Target account belongs to a different institutional boundary.');
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: 'Faculty' })
        .eq('id', targetUser.id);

      if (updateErr) throw updateErr;
      showToast(`Assigned Faculty status to ${targetUser.username}! 🎓`, 'success');
      setTargetUserFaculty('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAssigningFaculty(false);
    }
  };

  const handleIngestQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      showToast('Please complete all question option parameter fields.', 'error');
      return;
    }
    setIngestingQuestion(true);
    try {
      const payload = {
        organization_id: profile.organization_id,
        subject,
        department: 'General Science',
        difficulty: 'medium',
        question_text: questionText.trim(),
        options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
        correct_answer: parseInt(correctAnswer, 10),
      };

      const { error } = await supabase.from('questions').insert([payload]);
      if (error) throw error;

      showToast('Trivia challenge safely ingested into bank! 🧠', 'success');
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectAnswer('0');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIngestingQuestion(false);
    }
  };

  return (
    <div className="glass rounded-2xl border border-primary/20 p-6 space-y-6 mb-8">
      <div className="flex items-center gap-3 border-b border-surface-lighter/30 pb-4">
        <span className="text-2xl">⚡</span>
        <div>
          <h2 className="text-lg font-bold font-display text-text-primary">
            Strategy Brain Administrative Gateway
          </h2>
          <p className="text-xs text-text-secondary">
            Current clearance capability level:{' '}
            <span className="text-primary font-semibold">{profile.role}</span>
          </p>
        </div>
      </div>

      {/* ── 1. SUPER ADMIN TOOLS ── */}
      {profile.role === 'SuperAdmin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Institution Form */}
          <form onSubmit={handleCreateOrg} className="bg-surface-card p-4 rounded-xl border border-surface-lighter/20 space-y-3">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <span>🏛️</span> Provision Institution
            </h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">College/University Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g., Harvard University"
                className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-text-muted mb-1">Branding Vector</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={orgColor}
                    onChange={(e) => setOrgColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-text-secondary">{orgColor}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={creatingOrg}
                className="mt-4 px-4 py-2 bg-primary text-text-primary text-xs font-semibold rounded-lg hover:bg-primary-light transition disabled:opacity-50 self-end"
              >
                {creatingOrg ? 'Provisioning...' : 'Register'}
              </button>
            </div>
          </form>

          {/* Assign TenantAdmin Form */}
          <form onSubmit={handleAssignTenantAdmin} className="bg-surface-card p-4 rounded-xl border border-surface-lighter/20 space-y-3">
            <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
              <span>🛡️</span> Assign Tenant Administrator
            </h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Target Account Username</label>
              <input
                type="text"
                value={targetUserAdmin}
                onChange={(e) => setTargetUserAdmin(e.target.value)}
                placeholder="Target profile username"
                className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Select Target Domain</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-accent"
              >
                {loadingList && <option>Loading records...</option>}
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={assigningAdmin || !selectedOrgId}
              className="w-full py-2 bg-accent text-text-primary text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {assigningAdmin ? 'Authorizing...' : 'Elevate Clearance'}
            </button>
          </form>
        </div>
      )}

      {/* ── 2. TENANT ADMIN TOOLS ── */}
      {profile.role === 'TenantAdmin' && (
        <form onSubmit={handleAssignFaculty} className="bg-surface-card p-4 rounded-xl border border-surface-lighter/20 space-y-3 max-w-md">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <span>🎓</span> Assign Organization Faculty Clearance
          </h3>
          <p className="text-xs text-text-muted">
            Allows selected institution member to securely ingest battle questions directly into the scoped domain database trivia bank.
          </p>
          <div>
            <label className="block text-xs text-text-muted mb-1">Target Account Username</label>
            <input
              type="text"
              value={targetUserFaculty}
              onChange={(e) => setTargetUserFaculty(e.target.value)}
              placeholder="Enter matching local profile username"
              className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={assigningFaculty}
            className="w-full py-2 bg-primary text-text-primary text-xs font-semibold rounded-lg hover:bg-primary-light transition disabled:opacity-50"
          >
            {assigningFaculty ? 'Processing...' : 'Authorize Faculty Status'}
          </button>
        </form>
      )}

      {/* ── 3. FACULTY TOOLS ── */}
      {profile.role === 'Faculty' && (
        <form onSubmit={handleIngestQuestion} className="bg-surface-card p-4 rounded-xl border border-surface-lighter/20 space-y-4">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <span>🧠</span> Bank Ingestion Gateway (Add Combat Trivia)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Subject Area</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-primary"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Question Body Text</label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g., What is the baseline execution pattern?"
                className="w-full bg-surface px-3 py-2 rounded-lg border border-surface-lighter text-xs text-text-primary focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-surface-lighter/10">
            <div>
              <label className="block text-[10px] text-text-muted mb-1">Option A (Index 0)</label>
              <input
                type="text"
                value={optA}
                onChange={(e) => setOptA(e.target.value)}
                className="w-full bg-surface px-3 py-1.5 rounded-md border border-surface-lighter text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted mb-1">Option B (Index 1)</label>
              <input
                type="text"
                value={optB}
                onChange={(e) => setOptB(e.target.value)}
                className="w-full bg-surface px-3 py-1.5 rounded-md border border-surface-lighter text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted mb-1">Option C (Index 2)</label>
              <input
                type="text"
                value={optC}
                onChange={(e) => setOptC(e.target.value)}
                className="w-full bg-surface px-3 py-1.5 rounded-md border border-surface-lighter text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-muted mb-1">Option D (Index 3)</label>
              <input
                type="text"
                value={optD}
                onChange={(e) => setOptD(e.target.value)}
                className="w-full bg-surface px-3 py-1.5 rounded-md border border-surface-lighter text-xs text-text-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label className="text-xs text-text-secondary">Correct Answer Index:</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="bg-surface px-2 py-1 rounded border border-surface-lighter text-xs text-text-primary"
              >
                <option value="0">Option A (0)</option>
                <option value="1">Option B (1)</option>
                <option value="2">Option C (2)</option>
                <option value="3">Option D (3)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={ingestingQuestion}
              className="px-5 py-2 bg-primary text-text-primary text-xs font-semibold rounded-lg hover:bg-primary-light transition disabled:opacity-50"
            >
              {ingestingQuestion ? 'Ingesting...' : 'Push Challenge'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminManagementPanel;
