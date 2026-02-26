'use client';

import { useState, useEffect } from 'react';

export interface Profile {
    name: string;
    title: string;
    bio: string;
    photoUrl: string;
    password: string;
}

const DEFAULT_PROFILE: Profile = {
    name: 'Muntasir Mahmud Amit',
    title: 'SQA Engineer · CS Graduate · Data Science Enthusiast',
    bio: "CS graduate from BRAC University & SQA Engineer at Tekarsh. I'm passionate about software quality, test automation, and the cutting edge of Data Science and Machine Learning. When I'm not debugging code, I'm out exploring the world — I love adventure, discovering new places, and experiencing cultures that broaden my perspective. This blog is where tech meets travel.",
    photoUrl: '',
    password: 'admin123',
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
        localStorage.setItem('admin_profile', JSON.stringify(updated));
        setProfile(updated);
    };

    return { profile, saveProfile, ready };
}
