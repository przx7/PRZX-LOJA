// Banco de dados simulado dos produtos gamers com as imagens originais
const produtosDB = {
    1: { nome: "Prod 1", valor: "R$ 1,00", estoque: 12, desc: "Acesso Vitalício ao Pacote de Skins Raras. Entrega imediata via bot.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    2: { nome: "Prod 2", valor: "R$ 25,00", estoque: 5, desc: "Chave de Ativação Global para Steam. Código Premium de automação.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    3: { nome: "Prod 3", valor: "R$ 50,00", estoque: 2, desc: "Script VIP Atualizado Automatizado com suporte incluso de 30 dias.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    4: { nome: "Prod 4", valor: "R$ 10,00", estoque: 50, desc: "Pack de Moedas In-Game com envio 100% automático pós-PIX.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    5: { nome: "Prod 5", valor: "R$ 35,00", estoque: 8, desc: "Painel Avançado Gamer Edição Limitada PRZX.sh.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    6: { nome: "Prod 6", valor: "R$ 40,00", estoque: 14, desc: "Combo de Licenças Premium com Automação Inteligente Ativa.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    7: { nome: "Prod 7", valor: "R$ 90,00", estoque: 3, desc: "Acesso Completo à API de Jogos + Documentação Criptografada.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    8: { nome: "Prod 8", valor: "R$ 120,00", estoque: 1, desc: "Super Pack Software Full Pack Automático com Atualizações Semanais.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    9: { nome: "Prod 9", valor: "R$ 15,00", estoque: 22, desc: "Acesso ao Servidor Privado Gamer com Bots Exclusivos e Vantagens.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" },
    10: { nome: "Prod 10", valor: "R$ 65,00", estoque: 6, desc: "E-book Estratégico Avançado + Scripts Iniciais de Otimização.", imagem: "https://cdn.discordapp.com/attachments/1119747596041003010/1138241416399372338/standard_1.gif" }
};

let carrinho = [];

// Função para renderizar os cards do catálogo na tela
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalog-view');
    if (!catalogoContainer) return;

    catalogoContainer.innerHTML = '';

    for (const id in produtosDB) {
        const produto = produtosDB[id];
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${produto.nome}</h3>
                <p class="product-desc">${produto.desc}</p>
                <div class="product-meta">
                    <span class="product-price">${produto.valor}</span>
                    <span class="product-stock"><i class="fa-solid fa-box"></i> Estoque: ${produto.estoque}</span>
                </div>
                <button class="btn-buy" onclick="adicionarAoCarrinho(${id})">
                    <i class="fa-solid fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        catalogoContainer.appendChild(card);
    }
}

// Controla a transição de telas (Catálogo <=> Carrinho)
function alternarTela(telaAlvo) {
    const catalogo = document.getElementById('catalog-view');
    const visualizacaoCarrinho = document.getElementById('cart-view');

    if (!catalogo || !visualizacaoCarrinho) return;

    if (telaAlvo === 'cart') {
        catalogo.style.opacity = '0';
        catalogo.style.transform = 'translateY(15px)';
        setTimeout(() => {
            catalogo.style.display = 'none';
            visualizacaoCarrinho.style.display = 'block';
            setTimeout(() => {
                visualizacaoCarrinho.style.opacity = '1';
                visualizacaoCarrinho.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    } else {
        visualizacaoCarrinho.style.opacity = '0';
        visualizacaoCarrinho.style.transform = 'translateY(15px)';
        setTimeout(() => {
            visualizacaoCarrinho.style.display = 'none';
            catalogo.style.display = 'grid';
            setTimeout(() => {
                catalogo.style.opacity = '1';
                catalogo.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
}

// Adiciona itens ao carrinho de compras
function adicionarAoCarrinho(idProduto) {
    const produtoInfo = produtosDB[idProduto];
    if (!produtoInfo) return;

    const itemExistente = carrinho.find(item => item.id === parseInt(idProduto));

    if (itemExistente) {
        if (itemExistente.quantidade >= produtoInfo.estoque) {
            alert("Desculpe, limite máximo de estoque atingido para este produto.");
            return;
        }
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: parseInt(idProduto),
            nome: produtoInfo.nome,
            valor: parseFloat(produtoInfo.valor.replace("R$ ", "").replace(",", ".")),
            quantidade: 1
        });
    }

    atualizarInterfaceCarrinho();
}

// Modifica as quantidades dentro da página do carrinho
function alterarQuantidadeItem(idProduto, mudanca) {
    const item = carrinho.find(i => i.id === parseInt(idProduto));
    if (!item) return;

    const produtoOriginal = produtosDB[idProduto];

    if (mudanca > 0 && item.quantidade >= produtoOriginal.estoque) {
        alert("Limite de estoque atingido.");
        return;
    }

    item.quantidade += mudanca;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(i => i.id !== parseInt(idProduto));
    }

    atualizarInterfaceCarrinho();
}

// Atualiza os contadores e textos do carrinho
function atualizarInterfaceCarrinho() {
    const containerItens = document.getElementById('cart-items-list');
    const elementoPrecoTotal = document.getElementById('cart-total-price');
    const contadorCarrinho = document.getElementById('cart-count');

    if (!containerItens) return;

    containerItens.innerHTML = '';
    let totalAcumulado = 0;
    let totalItens = 0;

    if (carrinho.length === 0) {
        containerItens.innerHTML = `<div class="cart-empty-msg"><i class="fa-solid fa-basket-shopping" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>Seu carrinho está vazio. Adicione produtos do catálogo!</div>`;
        if (elementoPrecoTotal) elementoPrecoTotal.innerText = "R$ 0,00";
        if (contadorCarrinho) contadorCarrinho.innerText = "0";
        return;
    }

    carrinho.forEach(item => {
        const subtotalItem = item.valor * item.quantidade;
        totalAcumulado += subtotalItem;
        totalItens += item.quantidade;

        const elementoItem = document.createElement('div');
        elementoItem.className = 'cart-item-row';
        elementoItem.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.nome}</span>
                <span class="cart-item-price">R$ ${item.valor.toFixed(2).replace('.', ',')} un</span>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control-btn">
                    <button onclick="alterarQuantidadeItem(${item.id}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQuantidadeItem(${item.id}, 1)">+</button>
                </div>
                <span class="cart-item-subtotal">R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        containerItens.appendChild(elementoItem);
    });

    if (elementoPrecoTotal) elementoPrecoTotal.innerText = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;
    if (contadorCarrinho) contadorCarrinho.innerText = totalItens;
}

// Envia a requisição do checkout para a API backend
async function finalizarCompraDoCarrinho() {
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio.");
        return;
    }

    const emailCliente = prompt("Por favor, informe o seu e-mail para receber o produto pós-pagamento:");
    if (!emailCliente) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCliente.trim())) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return;
    }

    const btnFinalizar = document.querySelector('.btn-finalize-cart');
    if (btnFinalizar) {
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Gerando Pix Mercado Pago...`;
    }

    try {
        const resposta = await fetch('/api/criar-pagamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itens: carrinho.map(item => ({ id: item.id, quantidade: item.quantidade })),
                emailCliente: emailCliente.trim()
            })
        });

        const dados = await resposta.json();

        if (dados.qr_code) {
            document.getElementById('modal-qr-img').src = `data:image/jpeg;base64,${dados.qr_code_base64}`;
            document.getElementById('modal-pix-text').value = dados.qr_code;
            document.getElementById('modal-pix').style.display = 'flex';

            carrinho = [];
            atualizarInterfaceCarrinho();
        } else {
            alert(`Erro do Servidor: ${dados.error || "Não foi possível gerar a cobrança."}`);
        }
    } catch (erro) {
        console.error("Erro na comunicação com a API Vercel:", erro);
        alert("Falha de conexão com o portal de pagamentos automáticos.");
    } finally {
        if (btnFinalizar) {
            btnFinalizar.disabled = false;
            btnFinalizar.innerHTML = `<i class="fa-solid fa-bolt"></i> Finalizar Compra via PIX`;
        }
    }
}

// Função de inicialização forçada e segura
function inicializarLojaCompleta() {
    renderizarCatalogo();
    atualizarInterfaceCarrinho();
    
    const catalogo = document.getElementById('catalog-view');
    if (catalogo) {
        catalogo.style.display = 'grid';
        // Timeout de 100ms força o navegador a processar a animação do CSS
        setTimeout(() => {
            catalogo.style.opacity = '1';
            catalogo.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Roda imediatamente e garante redundância no carregamento do DOM
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarLojaCompleta);
} else {
    inicializarLojaCompleta();
}
