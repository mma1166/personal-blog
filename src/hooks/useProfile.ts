'use client';

import { useState, useEffect } from 'react';

export interface Profile {
    id?: string;
    name: string;
    bio: string;
    profile_url: string;
    email: string;
}

const DEFAULT_PROFILE: Profile = {
    name: 'Md Muntasir Mahmud Amit',
    bio: "CS graduate from BRAC University & SQA Engineer at Tekarsh. tech meets travel.",
    profile_url: '',
    email: 'muntasir145@gmail.com',
};

export function useProfile() {
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else if (res.status === 404) {
                // Initial user doesn't exist yet - setup logic in login will handle this
                setProfile(DEFAULT_PROFILE);
            }
        } catch (err: any) {
            console.error("Profile fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const saveProfile = async (updates: Partial<Profile> & { current_password?: string; new_password?: string }) => {
        try {
            setLoading(true);
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save profile');

            setProfile(data.user);
            return { success: true };
        } catch (err: any) {
            console.error('Error saving profile:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { profile, saveProfile, loading, error, refreshProfile: fetchProfile };
}
