'use client';

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import EditorToolbar from './EditorToolbar';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Maximize, Crop } from 'lucide-react';
import { Extension } from '@tiptap/core';

const Indent = Extension.create({
    name: 'indent',
    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            minIndent: 0,
            maxIndent: 8,
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: element => parseInt(element.style.paddingLeft, 10) / 40 || 0,
                        renderHTML: attributes => {
                            if (!attributes.indent) return {};
                            return { style: `padding-left: ${attributes.indent * 40}px` };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            indent: () => ({ tr, state, dispatch }: any) => {
                const { selection } = state;
                const { from, to } = selection;
                state.doc.nodesBetween(from, to, (node: any, pos: any) => {
                    if (this.options.types.includes(node.type.name)) {
                        const indent = (node.attrs.indent || 0) + 1;
                        if (indent <= this.options.maxIndent) {
                            tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
                        }
                    }
                });
                if (dispatch) dispatch(tr);
                return true;
            },
            outdent: () => ({ tr, state, dispatch }: any) => {
                const { selection } = state;
                const { from, to } = selection;
                state.doc.nodesBetween(from, to, (node: any, pos: any) => {
                    if (this.options.types.includes(node.type.name)) {
                        const indent = Math.max(0, (node.attrs.indent || 0) - 1);
                        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent });
                    }
                });
                if (dispatch) dispatch(tr);
                return true;
            },
        } as any;
    },
});

const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run();
            },
            unsetFontSize: () => ({ chain }: any) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        } as any;
    },
});

const ImageNodeView = (props: any) => {
    const { node, updateAttributes, selected } = props;
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    const onMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsResizing(true);

        const startX = event.clientX;
        const startWidth = imageRef.current?.offsetWidth || 0;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const currentX = moveEvent.clientX;
            const newWidth = startWidth + (currentX - startX);
            updateAttributes({ width: `${newWidth}px` });
        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <NodeViewWrapper className={`resizable-image-container ${selected ? 'selected' : ''}`}>
            <div className="image-wrapper" style={{ width: node.attrs.width, position: 'relative', display: 'inline-block' }}>
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                    style={{
                        width: '100%',
                        aspectRatio: node.attrs.aspectRatio || 'auto',
                        objectFit: node.attrs.aspectRatio === 'none' || !node.attrs.aspectRatio ? 'initial' : 'cover',
                        borderRadius: '8px',
                        display: 'block'
                    }}
                />
                {selected && (
                    <>
                        <div
                            className="resize-handle"
                            onMouseDown={onMouseDown}
                        />
                        <div className="image-actions">
                            <button onClick={() => updateAttributes({ width: '25%' })} title="Small">S</button>
                            <button onClick={() => updateAttributes({ width: '50%' })} title="Medium">M</button>
                            <button onClick={() => updateAttributes({ width: '100%' })} title="Full">L</button>
                            <div className="v-divider" />
                            <button onClick={() => updateAttributes({ aspectRatio: 'none' })} title="Original">O</button>
                            <button onClick={() => updateAttributes({ aspectRatio: '1/1' })} title="Square">1:1</button>
                            <button onClick={() => updateAttributes({ aspectRatio: '16/9' })} title="Wide">16:9</button>
                        </div>
                    </>
                )}
            </div>
            <style jsx>{`
                .resizable-image-container {
                    display: inline-block;
                    line-height: 0;
                    margin: 1rem 0;
                    max-width: 100%;
                }
                .image-wrapper {
                    border: 2px solid transparent;
                    transition: border 0.2s;
                    max-width: 100%;
                }
                .resizable-image-container.selected .image-wrapper {
                    border-color: var(--accent);
                }
                .resize-handle {
                    position: absolute;
                    right: -5px;
                    bottom: -5px;
                    width: 12px;
                    height: 12px;
                    background: var(--accent);
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: nwse-resize;
                    z-index: 10;
                }
                .image-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    display: flex;
                    gap: 5px;
                    background: rgba(0,0,0,0.5);
                    padding: 5px;
                    border-radius: 6px;
                    backdrop-filter: blur(4px);
                }
                .image-actions button {
                    background: white;
                    border: none;
                    color: black;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .image-actions button:hover {
                    background: var(--accent);
                    color: white;
                }
                .v-divider {
                    width: 1px;
                    height: 12px;
                    background: rgba(255,255,255,0.3);
                    align-self: center;
                }
            `}</style>
        </NodeViewWrapper>
    );
};

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: attributes => ({
                    width: attributes.width,
                }),
                parseHTML: element => element.getAttribute('width') || '100%',
            },
            aspectRatio: {
                default: 'none',
                renderHTML: attributes => ({
                    'data-aspect-ratio': attributes.aspectRatio,
                }),
                parseHTML: element => element.getAttribute('data-aspect-ratio') || 'none',
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
    },
});

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File) => {
        try {
            setUploading(true);
            const reader = new FileReader();

            return new Promise<string>((resolve, reject) => {
                reader.onload = async (event) => {
                    try {
                        const base64Image = event.target?.result as string;
                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ image: base64Image }),
                        });
                        if (!res.ok) throw new Error('Cloudinary upload failed');
                        const data = await res.json();
                        resolve(data.url);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = () => reject(new Error('File reader failed'));
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontSize,
            Link.configure({ openOnClick: false }),
            ResizableImage,
            TextAlign.configure({ types: ['heading', 'paragraph', 'listItem'] }),
            Indent,
            Youtube.configure({ controls: false }),
            Placeholder.configure({ placeholder: 'Write your story here...' }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        for (const file of acceptedFiles) {
            const url = await uploadImage(file);
            if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    }, [editor]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        accept: { 'image/*': [] },
    });

    return (
        <div {...getRootProps()} className="editor-root">
            <input {...getInputProps()} />
            <EditorToolbar editor={editor} onImageUpload={open} />
            <div className={`editor-container glass ${isDragActive ? 'drag-active' : ''}`}>
                {uploading && (
                    <div className="upload-progress">
                        <Loader2 className="animate-spin" size={16} />
                        Uploading...
                    </div>
                )}
                <EditorContent editor={editor} />
            </div>
            {isDragActive && <div className="drag-overlay"><p>Drop images here</p></div>}
            <style jsx global>{`
                .editor-root { position: relative; width: 100%; }
                .editor-container { min-height: 400px; padding: 2rem; cursor: text; position: relative; }
                .upload-progress {
                    position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center;
                    gap: 0.5rem; background: var(--accent); color: white; padding: 0.5rem 1rem;
                    border-radius: 8px; font-size: 0.8rem; z-index: 50;
                }
                .ProseMirror { outline: none; min-height: 400px; }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder); float: left; color: var(--text-muted);
                    pointer-events: none; height: 0;
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
