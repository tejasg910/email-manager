import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/authUtils';
import CryptoJS from 'crypto-js';
import { supabase } from '@/lib/supabse';

export async function PUT(request: Request) {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated or not found in Supabase' },
        { status: 401 }
      );
    }

    let { firstName, lastName, smtpPassword } = await request.json();
    smtpPassword = smtpPassword.trim()
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Encrypt the SMTP password
    const encryptedSmtpPassword = CryptoJS.AES.encrypt(
      smtpPassword,
      process.env.ENCRYPTION_KEY!
    ).toString();

    // Update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        smtp_password: smtpPassword === "******" ? user.smtp_password : encryptedSmtpPassword,
      })
      .eq('id', user.id) // Use the authenticated user's ID from Supabase
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}