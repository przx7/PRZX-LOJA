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

// Estados Globais da Aplicação
let produtoAbertoId = null;
let carrinho = [];

// --- ENGINES DO CATÁLOGO DE PRODUTOS ---

function abrirModal(produtoId, linhaId) {
    const cardClicado = document.querySelector(`.product-card[data-id="${produtoId}"]`);
    const botaoClicado = cardClicado ? cardClicado.querySelector('.btn-buy') : null;
    const expansionArea = document.getElementById(`expansion-${linhaId}`);
    const produto = produtosDB[produtoId];

    if (!produto) return;

    if (produtoAbertoId === produtoId) {
        if (cardClicado) cardClicado.classList.remove('selected');
        if (botaoClicado) botaoClicado.textContent = 'Ver';
        if (expansionArea) {
            expansionArea.classList.remove('active');
            expansionArea.innerHTML = '';
        }
        produtoAbertoId = null;
        return;
    }

    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
        const btn = card.querySelector('.btn-buy');
        if (btn) btn.textContent = 'Ver';
    });

    document.querySelectorAll('.product-details-expansion').forEach(exp => {
        if (exp.id !== `expansion-${linhaId}`) {
            exp.classList.remove('active');
            exp.innerHTML = '';
        }
    });

    if (cardClicado) cardClicado.classList.add('selected');
    if (botaoClicado) botaoClicado.textContent = 'Recolher';

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

    expansionArea.classList.add('active');
    produtoAbertoId = produtoId;
}

// --- ENGINES DO SISTEMA DE CARRINHO (SPA) ---

function converterPrecoParaFloat(precoStr) {
    return parseFloat(precoStr.replace("R$", "").replace(".", "").replace(",", ".").trim());
}

function formatarDinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Modificado: Agora apenas adiciona ao carrinho e atualiza os números, sem mudar de tela
function adicionarCarrinho(id) {
    const produto = produtosDB[id];
    if (!produto) return;

    const itemNoCarrinho = carrinho.find(item => item.id === id);

    if (itemNoCarrinho) {
        if (itemNoCarrinho.quantidade < produto.estoque) {
            itemNoCarrinho.quantidade++;
        } else {
            alert("Desculpe parceiro, limite de estoque atingido para este item!");
            return;
        }
    } else {
        carrinho.push({
            id: id,
            nome: produto.nome,
            valor: produto.valor,
            quantidade: 1
        });
    }

    // Atualiza a interface (badge e lista)
    atualizarInterfaceCarrinho();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    // 1. Atualizar o badge numérico no header
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    document.getElementById('cart-counter').textContent = totalItens;

    // 2. Capturar container e o botão de finalização
    const container = document.getElementById('cart-items-container');
    const btnFinalizar = document.getElementById('btn-finalize-checkout');
    if (!container) return;

    // Modificado: Se o carrinho estiver vazio, bloqueia visualmente e funcionalmente o botão
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-msg">
                <i class="fa-solid fa-basket-shopping" style="font-size: 2rem; margin-bottom: 12px; display:block; color:#2d2d35;"></i>
                Seu carrinho está vazio, mestre!
            </div>
        `;
        document.getElementById('cart-total-price').textContent = formatarDinheiro(0);
        
        if (btnFinalizar) {
            btnFinalizar.disabled = true;
            btnFinalizar.style.opacity = '0.3';
            btnFinalizar.style.cursor = 'not-allowed';
            btnFinalizar.style.pointerEvents = 'none'; // Impede cliques complementares
        }
        return;
    }

    // Se tiver itens, libera o botão completamente
    if (btnFinalizar) {
        btnFinalizar.disabled = false;
        btnFinalizar.style.opacity = '1';
        btnFinalizar.style.cursor = 'pointer';
        btnFinalizar.style.pointerEvents = 'auto';
    }

    let htmlInjetado = '';
    let precoFinalAcumulado = 0;

    carrinho.forEach(item => {
        const valorFloat = converterPrecoParaFloat(item.valor);
        const subtotal = valorFloat * item.quantidade;
        precoFinalAcumulado += subtotal;

        htmlInjetado += `
            <div class="cart-item">
                <img class="cart-item-img" src="https://cdn.discordapp.com/attachments/998024954039779345/1517523369107656845/file_00000000b12061fdb373fada609b04a7.png?ex=6a369745&is=6a3545c5&hm=6869d3451d12c7097908970f68db771d94f3f694abefb3ba87384fcf4d010590&" alt="${item.nome}">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.nome}</h4>
                    <p class="cart-item-price">${item.valor} <span class="cart-item-quantity">x${item.quantidade}</span></p>
                </div>
                <i class="fa-solid fa-trash cart-item-remove" onclick="removerDoCarrinho(${item.id})"></i>
            </div>
        `;
    });

    container.innerHTML = htmlInjetado;
    document.getElementById('cart-total-price').textContent = formatarDinheiro(precoFinalAcumulado);
}

// --- CONTROLES DE NAVEGAÇÃO SPA ---

function mostrarCarrinho() {
    document.getElementById('catalog-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'block';

    // Limpar seleções de abas abertas no catálogo
    document.querySelectorAll('.product-details-expansion').forEach(exp => {
        exp.classList.remove('active');
        exp.innerHTML = '';
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
        const btn = card.querySelector('.btn-buy');
        if (btn) btn.textContent = 'Ver';
    });
    produtoAbertoId = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarCatalogo() {
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('catalog-view').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- PROCESSAMENTO FINAL DE PAGAMENTO ---

// Modificado: O botão "Finalizar Compra" da vitrine joga direto para a tela de carrinho
function finalizarCompra(id) {
    adicionarCarrinho(id); // Garante que o item entra no carrinho
    mostrarCarrinho();    // Redireciona para o carrinho imediatamente
}

function finalizarCompraDoCarrinho() {
    const total = document.getElementById('cart-total-price').textContent;
    alert(`Automação PRZX: Iniciando integração com o Mercado Pago para processar o valor de ${total} via PIX.`);
}

// Executa uma verificação inicial para garantir que o botão comece bloqueado (já que o carrinho inicia zerado)
atualizarInterfaceCarrinho();
