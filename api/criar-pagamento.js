import { MercadoPagoConfig, Payment } from 'mercadopago';

const produtosDB = {
    1: { nome: "Prod 1", preco: 1.00 },
    2: { nome: "Prod 2", preco: 25.00 },
    3: { nome: "Prod 3", preco: 50.00 },
    4: { nome: "Prod 4", preco: 10.00 },
    5: { nome: "Prod 5", preco: 35.00 },
    6: { nome: "Prod 6", preco: 40.00 },
    7: { nome: "Prod 7", preco: 90.00 },
    8: { nome: "Prod 8", preco: 120.00 },
    9: { nome: "Prod 9", preco: 15.00 },
    10: { nome: "Prod 10", preco: 65.00 }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { itens, emailCliente } = req.body;

        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ error: 'Nenhum item enviado no carrinho' });
        }

        let totalAmount = 0;
        let descricoes = [];

        // Calcula o preço final com segurança no servidor para todos os itens
        for (const item of itens) {
            const produto = produtosDB[item.id];
            if (!produto) {
                return res.status(404).json({ error: `Produto ID ${item.id} não encontrado` });
            }
            totalAmount += produto.preco * item.quantidade;
            descricoes.push(`${item.quantidade}x ${produto.nome}`);
        }

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);

        // Identifica automaticamente o domínio atual na Vercel para montar a URL do webhook
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const webhookUrl = `${protocol}://${host}/api/webhook-mercadopago`;

        const paymentData = {
            body: {
                transaction_amount: parseFloat(totalAmount.toFixed(2)),
                description: `PRZX.sh - Compra: ${descricoes.join(', ')}`,
                payment_method_id: 'pix',
                payer: { email: emailCliente },
                notification_url: webhookUrl
            }
        };

        const response = await payment.create(paymentData);

        return res.status(200).json({
            id_pagamento: response.id,
            qr_code: response.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno ao processar a ordem de pagamento' });
    }
}
