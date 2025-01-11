import { NextRequest } from 'next/server';

export async function POST (request:NextRequest) {
    try {
        const body = await request.json();
        // kirim notif ke handika
        await fetch('https://byscript.io/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                
            }),
        })


        // kirim notif ke user

    } catch (error:Error |any) {
        return new Response(error.message, { status: 500 })
    }
}