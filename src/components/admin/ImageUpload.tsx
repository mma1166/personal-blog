'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Camera, Loader2, X, Upload } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!supabase) {
            // Mock upload
            const mockUrl = URL.createObjectURL(file);
            onChange(mockUrl);
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `featured-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `featured-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Upload failed. Ensure "images" bucket exists in Supabase.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-wrapper">
            <label className="upload-label">{label}</label>

            {value ? (
                <div className="preview-container glass">
                    <img src={value} alt="Preview" className="preview-img" />
                    <button className="remove-btn" onClick={() => onChange('')}>
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div
                    className="upload-dropzone glass"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="status">
                            <Loader2 className="animate-spin" size={24} />
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <div className="status">
                            <Camera size={32} />
                            <span>Click to upload image</span>
                            <p>or drag and drop</p>
                        </div>
                    )}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <style jsx>{`
                .image-upload-wrapper {
                    margin-bottom: 1.5rem;
                }
                .upload-label {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .preview-container {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    aspect-ratio: 16 / 9;
                }
                .preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    backdrop-filter: blur(4px);
                    transition: all 0.2s;
                }
                .remove-btn:hover {
                    background: #ef4444;
                    transform: scale(1.1);
                }
                .upload-dropzone {
                    aspect-ratio: 16 / 9;
                    border: 2px dashed var(--glass-border);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .upload-dropzone:hover {
                    border-color: var(--accent);
                    background: rgba(124, 58, 237, 0.05);
                }
                .status {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-muted);
                }
                .status span {
                    font-weight: 600;
                    color: var(--foreground);
                }
                .status p {
                    font-size: 0.8rem;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
