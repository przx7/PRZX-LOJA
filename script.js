// Banco de dados simulado dos produtos gamers
const produtosDB = {
    1: { nome: "Prod 1", valor: "R$ 15,00", estoque: 12, desc: "Acesso Vitalício ao Pacote de Skins Raras. Entrega imediata via bot." },
    2: { nome: "Prod 2", valor: "R$ 25,00", estoque: 5, desc: "Chave de Ativação Global para Steam. Código Premium de automação." },
    3: { nome: "Prod 3", valor: "R$ 50,00", estoque: 2, desc: "Script VIP Atualizado Automatizado com suporte incluso de 30 dias." },
    4: { nome: "Prod 4", valor: "R$ 10,00", estoque: 50, desc: "Pack de Moedas In-Game com envio 100% automático pós-PIX." },
    5: { nome: "Prod 5", valor: "R$ 35,00", estoque: 8, desc: "Painel Avançado Gamer Edição Limitada PRZX.sh." },
    6: { nome: "Prod 6", valor: "R$ 40,00", estoque: 14, desc: "Combo de Licenças Premium com Automação Inteligente Ativa." },
    7: { nome: "Prod 7", valor: "R$ 90,00", estoque: 3, desc: "Acesso Completo à API de Jogos + Documentação Criptografada." },
    8: { nome: "Prod 8", valor: "R$ 120,00", estoque: 1, desc: "Super Pack Software Gamer - ÚLTIMA UNIDADE EM ESTOQUE." },
    9: { nome: "Prod 9", valor: "R$ 15,00", estoque: 22, desc: "Configurações Otimizadas de FPS para Computadores de Baixo Custo." },
    10: { nome: "Prod 10", valor: "R$ 65,00", estoque: 9, desc: "Servidor Discord Customizado Pré-Montado com bots automáticos." }
};

function abrirModal(produtoId, linhaId) {
    // 1. Gerenciar a seleção visual nos cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const cardClicado = document.querySelector(`.product-card[data-id="${produtoId}"]`);
    if (cardClicado) {
        cardClicado.classList.add('selected');
    }

    // 2. Fechar todas as outras abas de expansão abertas
    document.querySelectorAll('.product-details-expansion').forEach(exp => {
        if (exp.id !== `expansion-${linhaId}`) {
            exp.classList.remove('active');
            exp.innerHTML = '';
        }
    });

    // 3. Pegar a aba de expansão da linha atual
    const expansionArea = document.getElementById(`expansion-${linhaId}`);
    const produto = produtosDB[produtoId];

    if (!produto) return;

    // 4. Injetar o conteúdo do produto selecionado na aba expansiva
    expansionArea.innerHTML = `
        <div class="expansion-content">
            <h4>${produto.nome} - Detalhes do Pedido</h4>
            <ul>
                <li><strong>• Descrição:</strong> ${produto.desc}</li>
                <li><strong>• Valor:</strong> <span style="color: #ff1a1a; font-weight:700;">${produto.valor}</span></li>
                <li><strong>• Estoque:</strong> ${produto.estoque} unidades disponíveis</li>
                <li><strong>• Formas De Pagamento:</strong> <span class="badge-pix">SOMENTE PIX!</span></li>
            </ul>
            <div class="expansion-actions">
                <button class="btn-expansion-add" onclick="adicionarCarrinho(${produtoId})">
                    <i class="fa-solid fa-cart-plus"></i> + Carrinho
                </button>
                <button class="btn-expansion-buy" onclick="finalizarCompra(${produtoId})">
                    <i class="fa-solid fa-bolt"></i> Finalizar Compra
                </button>
            </div>
        </div>
    `;

    // 5. Ativar a animação de abertura
    expansionArea.classList.add('active');
}

// Funções de ação futuras para integrar com Mercado Pago
function adicionarCarrinho(id) {
    alert(`Produto ${id} adicionado ao carrinho com sucesso!`);
}

function finalizarCompra(id) {
    alert(`Redirecionando para a geração do PIX Dinâmico (Mercado Pago) do produto ${id}...`);
}
