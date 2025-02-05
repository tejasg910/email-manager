"use client"
import React, { useState } from 'react'
import { useCreateBlackList, useGetBlackList } from '../api/useBlackListEmail';
import { useToast } from '@/hooks/use-react-toast';

const BlackList = () => {
    const [email, setEmail] = useState('');
    const { data, error, isLoading } = useGetBlackList();
    const addBlackList = useCreateBlackList();
    const { success, error:errorToast } = useToast();
    const handleAddEmail = async() => {
        // TODO: Implement add email functionality
        if (email.trim()) {

            // Add email logic here
            setEmail(''); // Clear input after adding
            try {
         
           const data =await  addBlackList(email);

                if (data.success) {
                    success("Email added to black list")
                }else{
                    errorToast("error while adding black list") 
                }

            } catch (error) {
                errorToast("error while adding black list")
            }

        }
    }


    const handleRemoveEmail = (email: string) => {
        // TODO: Implement remove email functionality

        errorToast("Please contact support to delete this email")
        console.log(email, "this is email")
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Black List Management</h1>

                {/* Add Email Form */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter email to blacklist'
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        onClick={handleAddEmail}
                        className="bg-indigo-600 hover:bg-indigo-700  text-white px-4 py-2 rounded "
                    >
                        Add to Blacklist
                    </button>
                </div>

                {/* Blacklist Table */}
                <div className="border rounded">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>

                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                        // TODO: Implement remove functionality
                                        onClick={() => handleRemoveEmail(item.email)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        No emails in blacklist
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BlackList