'use client';

import {
    Bold, Italic, Underline, List, ListOrdered,
    Image as ImageIcon, Upload, Link as LinkIcon,
    Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Youtube, Code, Indent, Outdent
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void;
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addYoutubeVideo = () => {
        const url = window.prompt('YouTube URL');
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    };

    const setFontSize = (size: string) => {
        if (size === 'default') {
            (editor.commands as any).unsetFontSize();
        } else {
            (editor.commands as any).setFontSize(size);
        }
    };

    const handleIndent = () => {
        if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            editor.chain().focus().sinkListItem('listItem').run();
        } else {
            (editor.commands as any).indent();
        }
    };

    const handleOutdent = () => {
        if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            editor.chain().focus().liftListItem('listItem').run();
        } else {
            (editor.commands as any).outdent();
        }
    };

    return (
        <div className="toolbar glass">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            ><Bold size={18} /></button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            ><Italic size={18} /></button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
            ><Underline size={18} /></button>

            <div className="divider" />

            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            ><AlignLeft size={18} /></button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            ><AlignCenter size={18} /></button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            ><AlignRight size={18} /></button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            ><AlignJustify size={18} /></button>

            <div className="divider" />

            <select 
                onChange={(e) => setFontSize(e.target.value)}
                className="font-size-select"
                value={editor.getAttributes('textStyle').fontSize || 'default'}
            >
                <option value="default">Size</option>
                <option value="12px">12</option>
                <option value="14px">14</option>
                <option value="16px">16</option>
                <option value="18px">18</option>
                <option value="20px">20</option>
                <option value="24px">24</option>
                <option value="30px">30</option>
                <option value="36px">36</option>
                <option value="48px">48</option>
            </select>

            <div className="divider" />

            <button onClick={handleIndent} title="Indent"><Indent size={18} /></button>
            <button onClick={handleOutdent} title="Outdent"><Outdent size={18} /></button>

            <div className="divider" />

            <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            ><List size={18} /></button>

            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            ><ListOrdered size={18} /></button>

            <div className="divider" />

            <button onClick={addImage} title="Add Image via URL"><ImageIcon size={18} /></button>
            <button onClick={onImageUpload} title="Upload Local Image"><Upload size={18} /></button>
            <button onClick={addYoutubeVideo} title="Add YouTube Video"><Youtube size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}
            ><Code size={18} /></button>

            <style jsx>{`
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        button:hover {
          background: var(--glass-border);
          color: var(--foreground);
        }
        button.is-active {
          background: var(--accent);
          color: white;
        }
        .divider {
          width: 1px;
          background: var(--glass-border);
          margin: 0 0.5rem;
        }
        .font-size-select {
          background: var(--background);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          outline: none;
        }
        .font-size-select:hover {
          border-color: var(--accent);
        }
      `}</style>
        </div>
    );
}
