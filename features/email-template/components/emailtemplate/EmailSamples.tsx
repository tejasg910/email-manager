import React from 'react'
import { Copy, Code } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { useToast } from '@/hooks/use-react-toast'

interface EmailTemplate {
    name: string
    html: string
    subject: string
}

const emailTemplates: EmailTemplate[] = [
    {
        name: 'Full Stack Engineer',
        subject: 'Application for Full Stack Engineer Position - Tejas Giri',
        html: `
  <p>Dear Hiring Manager,</p>
  <p>I am Tejas Giri, a dedicated Full Stack Engineer with over two years of experience building robust and scalable web applications using the MERN stack and Next.js.</p>
  <p>Highlights of my expertise include:</p>
  <ul>
    <li>Strong command of React.js, Node.js, and MongoDB</li>
    <li>Proficient in integrating APIs and security</li>
    <li>Enterprise-level project experience</li>
  </ul>
  <p><a href="YOUR_RESUME_URL" style="color: #007bff; text-decoration: none;">Resume</a> | <a href="YOUR_GITHUB_URL" style="color: #007bff; text-decoration: none;">GitHub</a></p>
  <p>Thank you for considering my application.</p>
  <p>Warm regards,<br><strong>Tejas Giri</strong></p>
    `
    },
    // Add other templates...
]

export default function EmailTemplatesList() {
    const { success } = useToast()

    // Update the copy handler to use HTML format
    const handleCopyToClipboard = async (html: string, type: 'HTML' | 'Subject') => {
        const text = type === 'HTML' ?
            html.replace(/<[^>]*>/g, '') : // Strip HTML tags for plain text fallback
            html;
        try {


            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            });

            await navigator.clipboard.write([clipboardItem]);
            success(`${type} copied to clipboard!`);
        } catch (err) {
            // Fallback for browsers that don't support ClipboardItem
            navigator.clipboard.writeText(text).then(() => {
                success(`${type} copied to clipboard!`);
            });
        }
    };
    return (
        <div className="container   space-y-6">
            <h4 className="text-2xl font-bold  mb-6">Sample Email Templates</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emailTemplates.map((template) => (
                    <Card key={template.name} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {template.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Subject Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Subject</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-indigo-600 hover:text-indigo-700"
                                        onClick={() => handleCopyToClipboard(template.subject, 'Subject')}
                                    >
                                        <Copy className="h-4 w-4 " />
                                        Copy
                                    </Button>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-md text-sm">
                                    {template.subject}
                                </div>
                            </div>

                            {/* HTML Content Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">HTML Content</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-indigo-600 text:bg-indigo-700"
                                        onClick={() => handleCopyToClipboard(template.html, 'HTML')}
                                    >
                                        <Code className="h-4 w-4 " />
                                        Copy
                                    </Button>
                                </div>
                                <div
                                    className="bg-muted/50 p-3 rounded-md text-sm  "
                                    dangerouslySetInnerHTML={{ __html: template.html }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}