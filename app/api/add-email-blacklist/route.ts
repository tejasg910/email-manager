import { getAuthenticatedUser, handleUnauthorized } from "@/lib/authUtils";
import { supabase } from "@/lib/supabse";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();


    const user = await getAuthenticatedUser(req);


    if (!user) {
        handleUnauthorized()
        return NextResponse.json(
            { error: 'Unauthorized: User not authenticated or not found in Supabase' },
            { status: 401 }
        );
    }

    const { data, error } = await supabase.from("email_blacklist").insert({ email, user_id: user.id });


    if (error) {

        console.log(error, "This is error")
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, error });

}


export async function GET(req: Request) {
    const user = await getAuthenticatedUser(req);


    if (!user) {
        handleUnauthorized()
        return NextResponse.json(
            { error: 'Unauthorized: User not authenticated or not found in Supabase' },
            { status: 401 }
        );
    }

    const { data, error } = await supabase.from("email_blacklist").select("*").eq("user_id", user.id);
    return NextResponse.json({ data, error });
}


