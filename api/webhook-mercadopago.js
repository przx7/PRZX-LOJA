import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const produtosDB = {
    1: { nome: "Prod 1", entrega: "Aqui está o seu link de acesso para o Prod 1: https://link.com/prod1" },
    2: { nome: "Prod 2", entrega: "Aqui está a sua Chave Steam para o Prod 2: XXXX-XXXX-XXXX" },
    3: { nome: "Prod 3", entrega: "Seu Script VIP do Prod 3 está aqui: https://link.com/script" },
    4: { nome: "Prod 4", entrega: "Seu Pack de Moedas do Prod 4 foi gerado: https://link.com/moedas" },
    5: { nome: "Prod 5", entrega: "Acesso ao Painel Gamer do Prod 5: https://link.com/painel" },
    6: { nome: "Prod 6", entrega: "Sua Licença Premium do Prod 6: LIC-XXXX-XXXX" },
    7: { nome: "Prod 7", entrega: "Link da API Criptografada do Prod 7: https://link.com/api" },
    8: { nome: "Prod 8", entrega: "Download do Super Pack Software do Prod 8: https://link.com/software" },
    9: { nome: "Prod 9", entrega: "Convite para o Servidor VIP do Prod 9: https://discord.gg/convite" },
    10: { nome: "Prod 10", entrega: "Download do E-book Estratégico do Prod 10: https://link.com/ebook" }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Proteção básica contra webhooks falsificados externos
    const { secret } = req.query;
    if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    const { action, data } = req.body;

    if (action === "payment.created" || action === "payment.updated" || req.body.type === "payment") {
        const paymentId = data?.id || req.body.data?.id;
        
        if (!paymentId) return res.status(200).send('OK');

        try {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);
            
            const paymentData = await payment.get({ id: paymentId });

            if (paymentData.status === 'approved') {
                const emailCliente = paymentData.payer.email;
                const descricao = paymentData.description || "";

                let htmlEntrega = "";

                // Verifica quais produtos da DB estão listados na descrição gerada pelo pagamento
                for (const key in produtosDB) {
                    if (descricao.includes(produtosDB[key].nome)) {
                        htmlEntrega += `
                            <p><strong>${produtosDB[key].nome}:</strong></p>
                            <p style="background: #222; padding: 15px; border-radius: 4px; border-left: 4px solid #ff0000; font-family: monospace; color: #fff;">
                                ${produtosDB[key].entrega}
                            </p>
                            <br>
                        `;
                    }
                }

                if (htmlEntrega !== "") {
                    await resend.emails.send({
                        from: 'PRZX Store <onboarding@resend.dev>',
                        to: emailCliente,
                        subject: 'Seus produtos gamers chegaram! - PRZX.sh',
                        html: `
                            <div style="font-family: sans-serif; background-color: #111; color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ff0000;">
                                <h2 style="color: #ff0000;">Obrigado pela sua compra!</h2>
                                <p>Seu pagamento foi aprovado com sucesso. Abaixo estão seus acessos:</p>
                                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
                                ${htmlEntrega}
                                <p style="font-size: 12px; color: #666; margin-top: 30px;">Powered by PRZX.sh & NexT Empreendimentos</p>
                            </div>
                        `
                    });
                    console.log(`[ENTREGA] E-mail enviado com sucesso para ${emailCliente}`);
                }
            }
        } catch (err) {
            console.error('Erro ao validar webhook:', err);
        }
    }

    return res.status(200).send('OK');
}
