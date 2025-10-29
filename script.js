// =============================
// SCRIPT DO SITE SPORTMASTER
// =============================

// Carrinho armazenado localmente
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Atualiza o ícone do carrinho no topo
function atualizarCarrinho() {
  const cartIcon = document.querySelector('.cart');
  if (!cartIcon) return;

  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  cartIcon.innerHTML = `🛒<span class="cart-count">${totalItens}</span>`;
}

// Adiciona item ao carrinho
function adicionarAoCarrinho(produto) {
  const existente = carrinho.find(item => item.nome === produto.nome);
  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
  alert(`${produto.nome} foi adicionado ao carrinho!`);
}

// Remove item do carrinho
function removerDoCarrinho(nomeProduto) {
  carrinho = carrinho.filter(item => item.nome !== nomeProduto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
  exibirCarrinho();
}

// Exibe o conteúdo do carrinho (em modal ou página separada)
function exibirCarrinho() {
  const modal = document.createElement('div');
  modal.classList.add('cart-modal');

  let conteudo = `
    <div class="cart-box">
      <h2>🛍 Seu Carrinho</h2>
      ${carrinho.length === 0 ? "<p>Seu carrinho está vazio!</p>" : ""}
      <ul>
  `;

  carrinho.forEach(item => {
    conteudo += `
      <li>
        <strong>${item.nome}</strong> — R$ ${item.preco.toFixed(2)} × ${item.quantidade}
        <button class="remove-btn" data-nome="${item.nome}">Remover</button>
      </li>
    `;
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  conteudo += `
      </ul>
      <p class="total">Total: <strong>R$ ${total.toFixed(2)}</strong></p>
      <button id="checkout-btn" class="btn">Finalizar Compra</button>
      <button id="fechar-carrinho" class="btn-sec">Fechar</button>
    </div>
  `;

  modal.innerHTML = conteudo;
  document.body.appendChild(modal);

  // Fechar modal
  document.getElementById('fechar-carrinho').onclick = () => modal.remove();

  // Remover item
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => removerDoCarrinho(btn.dataset.nome);
  });

  // Simulação de checkout
  document.getElementById('checkout-btn').onclick = () => {
    alert('Compra finalizada com sucesso! Obrigado por escolher a SportMaster 💪');
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    modal.remove();
    atualizarCarrinho();
  };
}

// Detecta botões “Comprar”
document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();

  const botoesComprar = document.querySelectorAll('.btn');
  botoesComprar.forEach(botao => {
    botao.addEventListener('click', (e) => {
      const card = e.target.closest('.card, .produto-detalhe');
      if (!card) return;

      const nome = card.querySelector('h3, h1').innerText;
      const precoTexto = card.querySelector('.preco, p').innerText;
      const preco = parseFloat(precoTexto.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const img = card.querySelector('img') ? card.querySelector('img').src : '';

      adicionarAoCarrinho({ nome, preco, img });
    });
  });

  // Abre o carrinho ao clicar no ícone 🛒
  const cartIcon = document.querySelector('.cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', exibirCarrinho);
  }
});
