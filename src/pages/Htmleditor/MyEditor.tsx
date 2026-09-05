import { useRef } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import plugins from 'suneditor/src/plugins';
import type { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';
import toast from 'react-hot-toast';

interface HtmlEditorProps extends Partial<SunEditorReactProps> {
  placeholder?: string;
  height?: string;
  onChange: (v: string) => void;
  setContent?: string;
  defaultValue?: string;
  onFileUpload?: (file: File) => Promise<{ url: string; name: string }>;
}

// PDF icon (red document)
const pdfIconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="#e53935" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#fff" d="M14 2v6h6z"/><text x="7" y="18" font-size="6" fill="#fff" font-family="Arial" font-weight="bold">PDF</text></svg>';

// Word icon (blue document)
const wordIconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="#1e88e5" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"/><path fill="#fff" d="M14 2v6h6z"/><text x="6.5" y="18" font-size="5.5" fill="#fff" font-family="Arial" font-weight="bold">DOC</text></svg>';

// Toolbar button icon (paperclip, used to open the file picker)
const uploadButtonIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16.5 6.5v10a4 4 0 0 1-8 0v-11a2.5 2.5 0 0 1 5 0v10a1 1 0 0 1-2 0v-9h-1v9a2 2 0 0 0 4 0v-10a3.5 3.5 0 0 0-7 0v11a5 5 0 0 0 10 0v-10h-1z"/></svg>';

// Custom SunEditor plugin: upload PDF / Word files and insert a download link
const fileUploadPlugin = (onFileUpload?: (file: File) => Promise<{ url: string; name: string }>) => {
  let coreInstance: any = null;

  return {
    name: 'fileUpload',
    display: 'command',
    title: 'Upload PDF/Word',
    buttonClass: '',
    innerHTML: uploadButtonIcon,
    add: function (core: any, targetElement: any) {
      coreInstance = core;
      const context = core.context;
      context.fileUpload = { targetElement, tag: targetElement };
    },
    action: function () {
      if (!onFileUpload) {
        console.warn('HtmlEditor: onFileUpload handler is required for file uploads.');
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept =
        '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      input.style.display = 'none';

      input.onchange = async (e: any) => {
        const file: File = e.target.files?.[0];
        if (!file) {
          document.body.removeChild(input);
          return;
        }
        const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File size (${fileSizeMB}MB) exceeds the maximum limit of 3MB. Please select a smaller file.`, {
            position: 'top-center',
            duration: 4000,
            style: {
              background: 'white',
              color: 'black',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              maxWidth: '400px',
              fontSize: '14px',
              fontWeight: 500,
            },
          });
          document.body.removeChild(input);
          return;
        }

        try {
          if (onFileUpload && coreInstance) {
            const { url, name } = await onFileUpload(file);
            const isPdf =
              file.type === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
            const icon = isPdf ? pdfIconSvg : wordIconSvg;

            const html = `<p><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none;">${icon}<span>${name}</span></a></p>`;

            // FIX: Use coreInstance.insertHTML directly instead of coreInstance.insertHTML
            coreInstance.insertHTML(html, true, false);
            
            setTimeout(() => {
              coreInstance.focus();
            }, 0);
          } else {
            console.warn('HtmlEditor: no onFileUpload handler provided, cannot upload file.');
          }
        } catch (err) {
          console.error('HtmlEditor: file upload failed', err);
        } finally {
          if (document.body.contains(input)) {
            document.body.removeChild(input);
          }
        }
      };

      document.body.appendChild(input);
      input.click();
    }
  };
};

const HtmlEditor = ({
  placeholder,
  height,
  onChange,
  setContent = '',
  defaultValue = '',
  onFileUpload,
  ...props
}: HtmlEditorProps) => {
  const editorRef = useRef<any>(null);
  const fileUploadPluginRef = useRef<any>(null);

  const getSunEditorInstance = (sunEditor: any) => {
    editorRef.current = sunEditor;

    if (sunEditor) {
      setTimeout(() => {
        if (typeof sunEditor.setFontSize === 'function') {
          sunEditor.setFontSize('12');
        }
        if (typeof sunEditor.setFormatBlock === 'function') {
          sunEditor.setFormatBlock('p');
        }
      }, 100);

      if (sunEditor.core && sunEditor.core.context && sunEditor.core.context.element && sunEditor.core.context.element.wysiwyg) {
        const reapplyDefaults = () => {
          if (typeof sunEditor.setFontSize === 'function') {
            sunEditor.setFontSize('12');
          }
          if (typeof sunEditor.setFormatBlock === 'function') {
            sunEditor.setFormatBlock('p');
          }
        };
        
        const wysiwyg = sunEditor.core.context.element.wysiwyg;
        wysiwyg.addEventListener('focus', reapplyDefaults);
        wysiwyg.addEventListener('input', reapplyDefaults);
        wysiwyg.addEventListener('keyup', reapplyDefaults);
      }
    }
  };

  const pluginInstance = fileUploadPlugin(onFileUpload);
  fileUploadPluginRef.current = pluginInstance;

  return (
    <SunEditor
      getSunEditorInstance={getSunEditorInstance}
      defaultValue={defaultValue || '<p>Start typing here...</p>'}
      setContents={setContent}
      height={height || '300'}
      placeholder={placeholder || 'Please enter a project description....'}
      onChange={onChange}
      setOptions={{
        defaultStyle: 'font-family: Helvetica Neue; font-size: 12px;',
        fontSize: [12, 18],
        font: [
          'Helvetica Neue',
          'Arial',
          'Comic Sans MS',
          'Courier New',
          'Georgia',
          'Impact',
          'Tahoma',
          'Times New Roman',
          'Verdana'
        ],
        buttonList: [
          [
            'undo',
            'redo',
            'font',
            'fontSize',
            'formatBlock',
            'bold',
            'underline',
            'italic',
            'strike',
            'fontColor',
            'hiliteColor',
            'removeFormat',
            'align',
            'horizontalRule',
            'list',
            'table',
            'link',
            'image',
            'fileUpload'
          ]
        ],
        defaultTag: 'p',
        minHeight: '300px',
        maxHeight: '600px',
        showPathLabel: false,
        width: '100%',
        plugins: [...Object.values(plugins), pluginInstance]
      }}
      {...props}
    />
  );
};

export default HtmlEditor;