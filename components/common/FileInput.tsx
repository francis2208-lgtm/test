import React, { useState, useCallback } from 'react';
import { ICONS } from '../../constants';

interface FileInputProps {
  id: string;
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ id, file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [setFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-light-border dark:border-dark-border border-dashed rounded-md transition-colors duration-200 ${isDragging ? 'bg-primary/10 border-primary' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
        <div className="space-y-1 text-center">
            {React.cloneElement(ICONS.upload, { className: `${ICONS.upload.props.className} mx-auto text-5xl text-gray-400 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`})}
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor={id} className="relative cursor-pointer bg-light-card dark:bg-dark-card rounded-md font-medium text-primary hover:text-primary/80">
                    <span>Upload a file</span>
                    <input id={id} name={id} type="file" className="sr-only" onChange={handleChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
            </div>
            {file ? <p className="text-sm text-green-600 pt-2 font-semibold animate-fadeInUp">{file.name}</p> : <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>}
        </div>
    </div>
  );
};
export default FileInput;