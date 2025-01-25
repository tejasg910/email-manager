'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from '@/components/ui/input';

interface CreateTemplateProps {
    onCreateTemplate: (name: string, subject: string ,  html: string) => Promise<void>;
}

export default function CreateTemplate({ onCreateTemplate }: CreateTemplateProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [subjectName, setSubjectName] = useState("")
    const [templateHtml, setTemplateHtml] = useState('');

    const handleCreateTemplate = async () => {
        await onCreateTemplate(templateName, subjectName, templateHtml);
        setIsModalOpen(false);
        setTemplateName('');
        setTemplateHtml('');
        setSubjectName("")
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className='bg-indigo-600 hover:bg-indigo-700'>Create Template</Button>
            </DialogTrigger>
            <DialogContent  className="sm:max-w-2xl max-h-[calc(100vh-100px)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Email Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />

                    <Input
                        placeholder="Subject Name"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />
                    <ReactQuill
                        value={templateHtml}
                        onChange={setTemplateHtml}
                        theme="snow"
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                    />
                    <Button onClick={handleCreateTemplate} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Create Template
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}