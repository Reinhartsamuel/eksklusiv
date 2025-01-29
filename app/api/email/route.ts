// import tradeExecutedTemplate from '@/app/utils/emailHtmlTemplates/tradeExecutedTemplate';

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const emailBody = {
            sender: {
                name: 'Eksklusiv',
                email: 'eksklusiv@gmail.com',
            },
            to: [
                {
                    email: body?.email,
                    name: body?.name,
                },
            ],
            bcc: [
                { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
            ],
            subject: body.subject,
            htmlContent: body.htmlContent,
        };
        if (body?.bcc) emailBody.bcc = body?.bcc;
        const headers: Record<string, string> = {
            accept: 'application/json',
            'api-key': process.env.BREVO_API_KEY as string,
            'content-type': 'application/json',
        };

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'post',
            body: JSON.stringify(emailBody),
            headers,
        });
        const result = await res.json();
        return Response.json({
            status: true,
            message: 'Email successuflly sent',
            ...result,
        });
    } catch (error) {
        return Response.json({
            status: false,
            message: (error as Error).message,
            data: 'Internal server error',
            error: error,
        }, { status: 500 });
    }
}
