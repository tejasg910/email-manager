

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactQuill from 'react-quill'

import { useConfirm } from '@/hooks/use-confirm'
import 'react-quill/dist/quill.snow.css'
import { useCreateTemplate, useDeleteTemplate, useGetTemplates, useUpdateTemplate } from '@/features/email-template/api/useEmailTemplates'
import { EmailTemplate } from '@/lib/type'
import CreateTemplate from '@/features/email-template/components/emailtemplate/Createtemplate'
import EmailTemplatesList from '@/features/email-template/components/emailtemplate/EmailSamples'
import { useToast } from '@/hooks/use-react-toast'


export default function EmailTemplates() {
    const [ConfirmDialog, confirm] = useConfirm("Delete Template", "Are you sure you want to delete this email template?")
    const selectedId = localStorage.getItem('selectedTemplateId')
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(selectedId)
    const [previewedTemplateId, setPreviewedTemplateId] = useState<string | null>(null)

    // Edit modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
    // Local storage states

    const { success, error } = useToast()

    const { templates, isLoading, mutate } = useGetTemplates();
    const createTemplate = useCreateTemplate();
    const updateTemplate = useUpdateTemplate();
    const deleteTemplate = useDeleteTemplate();





    const handleSelectTemplate = (template: EmailTemplate) => {
        setSelectedTemplateId(template.id)
        localStorage.setItem('selectedTemplateId', template.id)
    }

    const handleDeleteTemplate = async (templateId?: string) => {
        if (!templateId) {
            error("Please select tempalte")
            return
        }

        try {
            const confirmed = await confirm()
            if (!confirmed) return

            await deleteTemplate(templateId);
            success("Deleted successfully")
        } catch (err) {
            error("Failed to delete")
            console.error('Delete failed:', error)
        }
    }

    const handleEditTemplate = (template: EmailTemplate) => {
        setEditingTemplate({ ...template })

        setIsEditModalOpen(true)
    }

    const handleSaveTemplate = async () => {
        if (!editingTemplate) return
        try {


            await updateTemplate(editingTemplate);
            success("updated successfully")
            setIsEditModalOpen(false)

        } catch (err) {
            error("Failed to update")

        }
    }

    const handleCreateTemplate = async (name: string, subject: string, html: string) => {
        try {
            const res = await createTemplate(name, subject, html);

            if (res?.error) {
                error(res.error || "failed to create ")
            } else {
                success("created successfully")
            }


        } catch (err) {
            error("Failed to create")

        }
    }

    const togglePreview = (id: string) => {
        setPreviewedTemplateId(prev => prev === id ? null : id)
    }




    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4">
            <ConfirmDialog />

            <section className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Email Templates</h2>
                <CreateTemplate onCreateTemplate={handleCreateTemplate} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className={`transition-all ${selectedTemplateId === template.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                        >
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-h-40 overflow-y-auto mb-4">
                                    <div dangerouslySetInnerHTML={{ __html: template.html }} />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleSelectTemplate(template)}
                                        variant={selectedTemplateId === template.id ? 'secondary' : 'default'}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {selectedTemplateId === template.id ? 'Selected' : 'Select Template'}
                                    </Button>

                          
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-2 hover:bg-gray-100 text-indigo-600 text:bg-indigo-700"
                                        aria-label="Edit template"
                                        onClick={() => handleEditTemplate(template)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>


                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700"
                                        aria-label="Delete template"
                                        onClick={() => handleDeleteTemplate(template.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>

                               
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <EmailTemplatesList />
            </section>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>


                <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-100px)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Email Template</DialogTitle>
                    </DialogHeader>

                    {editingTemplate && (
                        <div className="space-y-4">
                            <Input
                                placeholder="Name"
                                value={editingTemplate.name}
                                onChange={(e) =>
                                    setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)
                                }
                            />
                            <Input
                                placeholder="Subject"
                                value={editingTemplate.subject}
                                onChange={(e) =>
                                    setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)
                                }
                            />
                            <ReactQuill
                                value={editingTemplate.html}
                                onChange={(content) =>
                                    setEditingTemplate(prev =>
                                        prev ? { ...prev, html: content } : null
                                    )
                                }
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
                            <Button

                                onClick={handleSaveTemplate}
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}