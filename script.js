/* Efeito de Card Selecionado */
.product-card.selected {
    border-color: #ff1a1a !important;
    background: linear-gradient(145deg, #220a0a 0%, #111115 100%) !important;
    box-shadow: 0 0 15px rgba(255, 26, 26, 0.3);
}

/* Painel de Detalhes do Produto (Abaixo da Linha) */
.product-details-box {
    width: 100%;
    background-color: #0e0e11;
    border: 1px solid #ff1a1a;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0 25px 0;
    box-sizing: border-box;
    animation: fadeInSlide 0.3s ease-out;
}

@keyframes fadeInSlide {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
}

.details-header h4 {
    margin: 0 0 12px 0;
    font-size: 1.1rem;
    color: #ffffff;
    border-bottom: 1px solid #1c1c24;
    padding-bottom: 6px;
}

.details-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.details-list li {
    font-size: 0.85rem;
    color: #cccccc;
    margin-bottom: 8px;
    line-height: 1.4;
}

.text-red { color: #ff1a1a; font-weight: 700; }
.text-green { color: #00cc66; }
.font-bold { font-weight: bold; }

/* Badges de Estoque */
.badge-estoque {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
}
.estoque-ok { background-color: rgba(0, 204, 102, 0.2); color: #00cc66; }
.estoque-out { background-color: rgba(255, 26, 26, 0.2); color: #ff1a1a; }

/* Botões de Ação do Painel */
.details-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-add-cart, .btn-checkout-now {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

.btn-add-cart {
    background-color: #1a1a1f;
    border: 1px solid #2d2d35;
    color: #ffffff;
}
.btn-add-cart:hover {
    border-color: #ffffff;
}

.btn-checkout-now {
    background: linear-gradient(135deg, #00994d 0%, #00cc66 100%);
    color: #ffffff;
}
.btn-checkout-now:hover {
    background: linear-gradient(135deg, #00cc66 0%, #33ff99 100%);
}
