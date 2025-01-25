import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabse';
interface User {
    id: string;
    first_name: string;
    last_name: string;
    smtp_password?: string;
    email: string
}

export async function getAuthenticatedUser(req: Request): Promise<User | null> {
    try {
        // Get the authenticated user's ID from Clerk
        const { userId } = await auth();

        if (!userId) {
            return null; // User is not authenticated
        }

        // Fetch the user from Supabase using the Clerk user ID
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId) // Assuming you store Clerk user ID in a `clerk_id` column
            .single();

        if (error || !user) {
            return null; // User not found in Supabase
        }

        return user;
    } catch (error) {
        console.error('Error fetching authenticated user:', error);
        return null;
    }
}




export async function handleUnauthorized() {
    const { userId, sessionId } = await auth();
    const client = await clerkClient()
    if (userId) {

        await client.sessions.revokeSession(sessionId)
    }




}