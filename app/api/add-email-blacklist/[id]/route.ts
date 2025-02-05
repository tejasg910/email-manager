import { supabase } from "@/lib/supabse";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { data, error } = await supabase.from("email_blacklist").delete().eq("id", id);
    return NextResponse.json({ data, error });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { data, error } = await supabase.from("email_blacklist").select("*").eq("email", id);
    return NextResponse.json({ data, error });
}


