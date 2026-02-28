'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Camera, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import ImageUpload from '@/components/admin/ImageUpload';
import { hashPassword, DEFAULT_PASSWORD_HASH } from '@/lib/cryptoUtils';

export default function SettingsPage() {
    const { profile, saveProfile, loading } = useProfile();

    // Profile state
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [profileUrl, setProfileUrl] = useState('');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Feedback
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Sync form once profile data is ready from API
    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setBio(profile.bio || '');
            setProfileUrl(profile.profile_url || '');
        }
    }, [profile]);


    const handleSaveProfile = async () => {
        if (!name.trim()) {
            setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
            return;
        }
        const res = await saveProfile({ name: name.trim(), bio: bio.trim(), profile_url: profileUrl });
        if (res.success) {
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
        }
        setTimeout(() => setProfileMsg(null), 3000);
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            setPwMsg({ type: 'error', text: 'Enter current password.' });
            return;
        }
        if (newPassword.length < 6) {
            setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwMsg({ type: 'error', text: "Passwords don't match." });
            return;
        }

        const res = await saveProfile({
            current_password: currentPassword,
            new_password: newPassword
        });

        if (res.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPwMsg({ type: 'success', text: 'Password changed successfully!' });
        } else {
            setPwMsg({ type: 'error', text: res.error || 'Failed to change password.' });
        }
        setTimeout(() => setPwMsg(null), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-page"
        >
            <header className="settings-header">
                <div>
                    <h1 className="gradient-text">Settings</h1>
                    <p className="text-muted">Manage your profile and security preferences.</p>
                </div>
            </header>

            <div className="settings-grid">
                {/* ── Profile ── */}
                <section className="settings-section glass">
                    <div className="section-header">
                        <User size={20} className="accent-icon" />
                        <h2>Profile</h2>
                    </div>

                    <div className="photo-row">
                        <div className="photo-preview">
                            {profileUrl ? (
                                <img src={profileUrl} alt="Profile" />
                            ) : (
                                <div className="photo-placeholder">
                                    <Camera size={32} />
                                </div>
                            )}
                        </div>
                        <div className="photo-upload-wrapper">
                            <p className="upload-hint">This photo appears on your homepage.</p>
                            <ImageUpload value={profileUrl} onChange={setProfileUrl} label="Profile Photo" />
                        </div>
                    </div>

                    <div className="settings-form">
                        <div className="form-group">
                            <label>Display Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="form-group">
                            <label>Professional Title / Tagline</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SQA Engineer · CS Graduate" />
                        </div>
                        <div className="form-group">
                            <label>Short Bio (shown on homepage)</label>
                            <textarea rows={5} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world about yourself..." />
                        </div>

                        {profileMsg && (
                            <div className={`feedback-msg ${profileMsg.type}`}>
                                {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                {profileMsg.text}
                            </div>
                        )}

                        <button className="btn primary" onClick={handleSaveProfile}>
                            <Save size={18} /> Save Profile
                        </button>
                    </div>
                </section>

                {/* ── Password ── */}
                <section className="settings-section glass">
                    <div className="section-header">
                        <Shield size={20} className="accent-icon" />
                        <h2>Change Password</h2>
                    </div>

                    <div className="settings-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <div className="pw-input-wrap">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                                <button type="button" className="pw-toggle" onClick={() => setShowCurrent(v => !v)}>
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <div className="pw-input-wrap">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                />
                                <button type="button" className="pw-toggle" onClick={() => setShowNew(v => !v)}>
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <div className="pw-input-wrap">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                />
                                <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)}>
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {pwMsg && (
                            <div className={`feedback-msg ${pwMsg.type}`}>
                                {pwMsg.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                {pwMsg.text}
                            </div>
                        )}

                        <button className="btn primary" onClick={handleChangePassword}>
                            <Shield size={18} /> Update Password
                        </button>
                    </div>
                </section>
            </div>

            <style jsx>{`
                .settings-header {
                    margin-bottom: 2.5rem;
                }
                .settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 2rem;
                    align-items: start;
                }
                .settings-section {
                    padding: 2rem;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--glass-border);
                }
                .section-header h2 { font-size: 1.1rem; font-weight: 700; }
                .accent-icon { color: var(--accent); }
                .photo-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .photo-preview {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid var(--glass-border);
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--glass);
                }
                .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
                .photo-placeholder { color: var(--text-muted); }
                .photo-upload-wrapper { flex: 1; }
                .upload-hint {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }
                .settings-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                input, textarea {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                    width: 100%;
                    font-family: inherit;
                    resize: vertical;
                }
                input:focus, textarea:focus { border-color: var(--accent); }
                .pw-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .pw-input-wrap input { padding-right: 3rem; }
                .pw-toggle {
                    position: absolute;
                    right: 0.75rem;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0;
                }
                .pw-toggle:hover { color: white; }
                .feedback-msg {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .feedback-msg.success {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #4ade80;
                }
                .feedback-msg.error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                }
                .btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                    border: none;
                }
                .btn.primary {
                    background: var(--accent);
                    color: white;
                }
                .btn.primary:hover { opacity: 0.9; transform: translateY(-1px); }
                @media (max-width: 1024px) {
                    .settings-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </motion.div>
    );
}
