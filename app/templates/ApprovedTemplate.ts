/* eslint-disable @typescript-eslint/no-explicit-any */
interface Info {
    channelName: string;
    avatar: string;
    telegram: string;
}
export default function ApproveTemplate(data: Info) {
    return `<!DOCTYPE html>
                <html lang='en'>

                <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Group Invite</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }

                    .card {
                        background-color: lightgray;
                        border-radius: 12px;
                        padding: 20px;
                        text-align: center;
                        width: 300px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                    }

                    .card img {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-bottom: 15px;
                    }

                    .card h1 {
                        font-size: 18px;
                        margin: 0 0 10px;
                    }

                    .card p {
                        font-size: 14px;
                        margin: 0 0 20px;
                    }

                    .join-btn {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        transition: background-color 0.3s;
                    }

                    .join-btn:hover {
                        background-color: #0056b3;
                    }
                </style>
                </head>

                <body>
                    <h1 style='font-family: "Gill Sans", cursive; text-align:center;'>
                    Pembayaran Channel ${data.channelName} berhasil.
                    </h1>
                    <p>
                        Terima kasih atas pembayaran anda. Klik tombol di bawah untuk masuk ke grup telegram:
                    </p>

                <div class='card'>
                    <img src='${data.avatar}' alt='Profile Picture'>
                    <h1>${data.channelName}</h1>
                    <p>2 members</p>
                    <a href='${data.telegram}' class='join-btn'>JOIN GROUP</a>
                </div>
                </body>
                </html>`
} 