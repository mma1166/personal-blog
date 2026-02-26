'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Resize to max 1200×675 preserving aspect ratio
                const MAX_W = 1200;
                const MAX_H = 675;
                let { width, height } = img;

                if (width > MAX_W) { height = Math.round(height * MAX_W / width); width = MAX_W; }
                if (height > MAX_H) { width = Math.round(width * MAX_H / height); height = MAX_H; }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx!.drawImage(img, 0, 0, width, height);

                // Encode as JPEG @ 80% quality — typically 50–200 KB
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                onChange(dataUrl);
                setUploading(false);
            };
            img.onerror = () => {
                alert('Could not load image. Please try another file.');
                setUploading(false);
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            alert('Failed to read image. Please try another file.');
            setUploading(false);
        };
        reader.readAsDataURL(file);
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
