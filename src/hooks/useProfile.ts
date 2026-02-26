'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_PASSWORD_HASH } from '@/lib/cryptoUtils';

export interface Profile {
    name: string;
    title: string;
    bio: string;
    photoUrl: string;
    email: string;
    password: string; // stored as SHA-256 hex hash, NEVER plain text
}

const DEFAULT_PROFILE: Profile = {
    name: 'Muntasir Mahmud Amit',
    title: 'SQA Engineer · CS Graduate · Data Science Enthusiast',
    bio: "CS graduate from BRAC University & SQA Engineer at Tekarsh. I'm passionate about software quality, test automation, and the cutting edge of Data Science and Machine Learning. When I'm not debugging code, I'm out exploring the world — I love adventure, discovering new places, and experiencing cultures that broaden my perspective. This blog is where tech meets travel.",
    photoUrl: '',
    email: 'muntasir145@gmail.com',
    password: DEFAULT_PASSWORD_HASH, // SHA-256 of 'admin123'
};

export function useProfile() {
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('admin_profile');
        if (stored) {
            try {
                setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
            } catch {
                // ignore parse errors, keep defaults
            }
        }
        setReady(true);
    }, []);

    const saveProfile = (updates: Partial<Profile>) => {
        const updated = { ...profile, ...updates };
        try {
            localStorage.setItem('admin_profile', JSON.stringify(updated));
            setProfile(updated);
        } catch (e: any) {
            if (e?.name === 'QuotaExceededError') {
                // Profile photo base64 might be too large — save without photo
                const withoutPhoto = { ...updated, photoUrl: '' };
                localStorage.setItem('admin_profile', JSON.stringify(withoutPhoto));
                setProfile(withoutPhoto);
                alert('Profile saved, but the photo was too large to store (max ~3MB). Try a smaller image.');
            } else {
                alert('Failed to save profile: ' + e?.message);
            }
        }
    };

    return { profile, saveProfile, ready };
}
