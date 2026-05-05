'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Importação dinâmica para evitar erros de SSR com o Quill
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '300px', 
      background: '#f8fafc', 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: '#94a3b8',
      fontSize: '14px',
      fontWeight: 500
    }}>
      Carregando editor de texto...
    </div>
  )
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'blockquote', 'code-block'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'blockquote', 'code-block'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rich-text-editor-container">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      
      <style jsx global>{`
        .rich-text-editor-container {
          margin-bottom: 20px;
        }
        .ql-toolbar.ql-snow {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: #f8fafc;
          border-color: #e2e8f0 !important;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border-color: #e2e8f0 !important;
          font-family: inherit;
          font-size: 15px;
          min-height: 250px;
        }
        .ql-editor {
          min-height: 250px;
          line-height: 1.6;
          color: #0B1E2D;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          font-weight: 500;
        }
        .ql-snow .ql-stroke {
          stroke: #64748b;
        }
        .ql-snow .ql-fill {
          fill: #64748b;
        }
        .ql-snow .ql-picker {
          color: #64748b;
          font-weight: 600;
        }
        .ql-active .ql-stroke {
          stroke: #0B1E2D !important;
        }
        .ql-active .ql-fill {
          fill: #0B1E2D !important;
        }
      `}</style>
    </div>
  );
}
