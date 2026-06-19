import { MercadoPagoConfig, Payment } from 'mercadopago';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.sendStatus(200); // Sempre responda 200 para evitar travamentos do MP
    }

    const { query } = req;
    const topic = query.topic || query.type;

    if (topic === 'payment') {
        const paymentId = query.id || query['data.id'];

        try {
            const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
            const payment = new Payment(client);
            
            const pagamento = await payment.get({ id: paymentId });

            if (pagamento.status === 'approved') {
                console.log(`[SUCESSO] Pagamento Aprovado: ${paymentId}`);
                
                // ==============================================================
                // 🚀 INSIRA SUA AUTOMAÇÃO DE ENTREGA AQUI:
                // Enviar requisição para um bot do Discord, API do Telegram,
                // enviar e-mail com o produto, etc.
                // ==============================================================
            }
        } catch (err) {
            console.error('Erro ao validar webhook:', err);
        }
    }

    return res.status(200).send('OK');
}
