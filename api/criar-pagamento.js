import { MercadoPagoConfig, Payment } from 'mercadopago';

// O banco de dados fica no servidor. O cliente NÃO consegue alterar o preço.
const produtosDB = {
    1: { nome: "Prod 1", preco: 15.00 },
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
    // Segurança: Bloqueia se não for uma requisição POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { produtoId, emailCliente } = req.body;
        const produto = produtosDB[produtoId];

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Configura o Mercado Pago usando a Variável de Ambiente Segura da Vercel
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);

        const paymentData = {
            body: {
                transaction_amount: produto.preco, // Preço real e blindado do servidor
                description: `PRZX.sh - ${produto.nome}`,
                payment_method_id: 'pix',
                payer: { email: emailCliente }
                // Linha do notification_url removida temporariamente para testes
            }
        };

        const response = await payment.create(paymentData);

        // Retorna APENAS o necessário para o frontend. Chaves ficam ocultas.
        return res.status(200).json({
            id_pagamento: response.id,
            qr_code: response.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao processar o PIX' });
    }
}
