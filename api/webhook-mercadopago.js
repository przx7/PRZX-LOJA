import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend'; // 📦 Certifique-se de rodar: npm install resend

// Inicializa o Resend usando uma chave que você vai colocar na Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

// Banco de dados com o conteúdo ou link de entrega de cada produto
const produtosDB = {
    1: { nome: "Prod 1", entrega: "Aqui está o seu link de acesso para o Prod 1: https://link.com/prod1" },
    2: { nome: "Prod 2", entrega: "Aqui está a sua Chave Steam para o Prod 2: XXXX-XXXX-XXXX" },
    3: { nome: "Prod 3", entrega: "Seu Script VIP do Prod 3 está aqui: https://link.com/script" },
    4: { nome: "Prod 4", entrega: "Seu Pack de Moedas do Prod 4 foi gerado: https://link.com/moedas" },
    5: { nome: "Prod 5", entrega: "Acesso ao Painel Gamer do Prod 5: https://link.com/painel" },
    6: { nome: "Prod 6", entrega: "Sua Licença Premium do Prod 6: LIC-XXXX-XXXX" },
    7: { nome: "Prod 7", entrega: "Link da API Criptografada do Prod 7: https://link.com/api" },
    8: { nome: "Prod 8", entrega: "Download do Super Pack Software do Prod 8: https://link.com/software" },
    9: { nome: "Prod 9", entrega: "Sua Configuração de FPS do Prod 9: https://link.com/fps" },
    10: { nome: "Prod 10", entrega: "Link de convite do Servidor do Prod 10: https://discord.gg/convite" }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).send('OK'); // Evita travamentos do MP
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
                
                const emailCliente = pagamento.payer.email;
                const descricao = pagamento.description || ""; // Pega o "PRZX.sh - Prod X"
                
                let produtoEntregar = null;

                // Loop para varrer o banco e achar qual produto bate com a descrição do pagamento
                for (const id in produtosDB) {
                    if (descricao.includes(produtosDB[id].nome)) {
                        produtoEntregar = produtosDB[id];
                        break;
                    }
                }

                // Se encontrou o produto, faz o disparo automático do e-mail
                if (produtoEntregar) {
                    await resend.emails.send({
                        from: 'onboarding@resend.dev', // Quando tiver domínio próprio, use: 'entrega@seu-site.com'
                        to: emailCliente,
                        subject: `⚡ Seu produto da ST0RE ONLINE chegou! (${produtoEntregar.nome})`,
                        html: `
                            <div style="font-family: sans-serif; background-color: #111; color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ff0000;">
                                <h2 style="color: #ff0000;">Obrigado pela sua compra!</h2>
                                <p>Seu pagamento para o <strong>${produtoEntregar.nome}</strong> foi aprovado com sucesso.</p>
                                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
                                <p style="font-size: 16px;"><strong>Sua entrega:</strong></p>
                                <p style="background: #222; padding: 15px; border-radius: 4px; border-left: 4px solid #ff0000; font-family: monospace;">
                                    ${produtoEntregar.entrega}
                                </p>
                                <p style="font-size: 12px; color: #666; margin-top: 30px;">Powered by PRZX.sh & NexT Empreendimentos</p>
                            </div>
                        `
                    });

                    console.log(`[ENTREGA] E-mail enviado com sucesso para ${emailCliente}`);
                } else {
                    console.log(`[AVISO] Nenhum produto correspondente encontrado para a descrição: ${descricao}`);
                }
            }
        } catch (err) {
            console.error('Erro ao validar webhook:', err);
        }
    }

    return res.status(200).send('OK');
}
