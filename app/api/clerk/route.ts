import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabse';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const headersList = headers();
        const svixId = headersList.get('svix-id');
        const svixTimestamp = headersList.get('svix-timestamp');
        const svixSignature = headersList.get('svix-signature');

        if (!svixId || !svixTimestamp || !svixSignature) {
            return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
        }

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
        let evt;

        try {
            evt = wh.verify(JSON.stringify(payload), {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            }) as any;
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0].email_address;

        // Step 1: Check if a user with the same email already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); // Fetch a single record

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 means "No rows found", which is fine
            console.error('Error fetching user from Supabase:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch user' },
                { status: 500 }
            );
        }

        // Step 2: If the user exists, update their record; otherwise, insert a new user
        if (existingUser) {
            // Update the existing user
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                    id,
                    first_name,
                    last_name,
                })
                .eq('email', email) // Update where email matches
                .select();

            if (updateError) {
                console.error('Error updating user in Supabase:', updateError);
                return NextResponse.json(
                    { error: 'Failed to update user' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true, data: updatedUser });
        } else {
            // Insert a new user
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([
                    {

                        email,
                        first_name,
                        last_name,
                        clerk_id: id
                    },
                ])
                .select();

            if (insertError) {
                console.error('Error inserting user in Supabase:', insertError);
                return NextResponse.json(
                    { error: 'Failed to insert user' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true, data: newUser });
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}