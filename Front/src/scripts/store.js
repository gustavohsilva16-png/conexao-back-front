lucide.createIcons();

const apiBaseUrl = window.location.port === '5501'
  ? `${window.location.protocol}//${window.location.hostname}:3000/api`
  : '/api';
const statusBackend = document.getElementById('status-backend');

async function verificarConexaoBackend() {
  try {
    const response = await fetch(`${apiBaseUrl}/health`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.status !== 'ok') {
      throw new Error('Resposta inválida do servidor');
    }

    statusBackend.textContent = 'Conectado ao servidor da loja';
    statusBackend.dataset.status = 'connected';
  } catch (error) {
    statusBackend.textContent = `Servidor indisponível: ${error.message}`;
    statusBackend.dataset.status = 'disconnected';
  }
}

verificarConexaoBackend();

    let carrinho = [];
    let produtoSelecionado = null;
    let qtdModal = 1;

    // ELEMENTOS CARRINHO
    const btnAbrirCarrinho = document.getElementById('btn-abrir-carrinho');
    const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
    const painelCarrinho = document.getElementById('carrinho-painel');
    const overlayCarrinho = document.getElementById('carrinho-overlay');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinhoEl = document.getElementById('total-carrinho');
    const contadorCarrinhoEl = document.getElementById('contador-carrinho');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');

    // ELEMENTOS MODAL DETALHES PRODUTO
    const modalProduto = document.getElementById('modal-produto');
    const btnFecharProduto = document.getElementById('btn-fechar-produto');
    const detalhesTitulo = document.getElementById('detalhes-titulo');
    const detalhesPreco = document.getElementById('detalhes-preco');
    const detalhesDescricao = document.getElementById('detalhes-descricao');
    const detalhesIcone = document.getElementById('detalhes-icone');
    const labelOpcao = document.getElementById('label-opcao');
    const detalhesOpcaoSelect = document.getElementById('detalhes-opcao');
    const detalhesQtdEl = document.getElementById('detalhes-qtd');
    const btnQtdMenos = document.getElementById('btn-qtd-menos');
    const btnQtdMais = document.getElementById('btn-qtd-mais');
    const btnAdicionarModal = document.getElementById('btn-adicionar-modal');

    // CONTROLE ABRIR/FECHAR CARRINHO
    function abrirCarrinho() {
      painelCarrinho.classList.add('ativo');
      overlayCarrinho.classList.add('ativo');
    }

    function fecharCarrinho() {
      painelCarrinho.classList.remove('ativo');
      overlayCarrinho.classList.remove('ativo');
    }

    btnAbrirCarrinho.addEventListener('click', abrirCarrinho);
    btnFecharCarrinho.addEventListener('click', fecharCarrinho);
    overlayCarrinho.addEventListener('click', fecharCarrinho);

    // CLICK NOS CARDS PARA ABRIR O POP-UP DE DETALHES
    const cards = document.querySelectorAll('.card-produto');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-adicionar-direto')) {
          e.stopPropagation();
          const nome = card.getAttribute('data-nome');
          const preco = parseFloat(card.getAttribute('data-preco'));
          const icone = card.getAttribute('data-icone');
          const opcoes = card.getAttribute('data-opcoes').split(', ');
          adicionarAoCarrinho(nome, preco, icone, opcoes[0], 1);
          return;
        }

        produtoSelecionado = {
          nome: card.getAttribute('data-nome'),
          preco: parseFloat(card.getAttribute('data-preco')),
          descricao: card.getAttribute('data-descricao'),
          icone: card.getAttribute('data-icone'),
          opcoesTipo: card.getAttribute('data-opcoes-tipo'),
          opcoes: card.getAttribute('data-opcoes').split(', ')
        };

        qtdModal = 1;
        detalhesQtdEl.textContent = qtdModal;
        detalhesTitulo.textContent = produtoSelecionado.nome;
        detalhesPreco.textContent = `R$ ${produtoSelecionado.preco.toFixed(2).replace('.', ',')}`;
        detalhesDescricao.textContent = produtoSelecionado.descricao;
        detalhesIcone.innerHTML = `<i data-lucide="${produtoSelecionado.icone}"></i>`;
        
        labelOpcao.textContent = `Selecione: (${produtoSelecionado.opcoesTipo})`;
        detalhesOpcaoSelect.innerHTML = '';
        produtoSelecionado.opcoes.forEach(op => {
          const opt = document.createElement('option');
          opt.value = op;
          opt.textContent = op;
          detalhesOpcaoSelect.appendChild(opt);
        });

        lucide.createIcons();
        modalProduto.classList.add('ativo');
      });
    });

    btnFecharProduto.addEventListener('click', () => modalProduto.classList.remove('ativo'));

    // CONTROLE DE QUANTIDADE NA MODAL DE DETALHES
    btnQtdMenos.addEventListener('click', () => {
      if (qtdModal > 1) {
        qtdModal--;
        detalhesQtdEl.textContent = qtdModal;
      }
    });

    btnQtdMais.addEventListener('click', () => {
      qtdModal++;
      detalhesQtdEl.textContent = qtdModal;
    });

    // BOTAO ADICIONAR DENTRO DO MODAL
    btnAdicionarModal.addEventListener('click', () => {
      if (produtoSelecionado) {
        const opcaoEscolhida = detalhesOpcaoSelect.value;
        const nomeCompleto = `${produtoSelecionado.nome} (${opcaoEscolhida})`;
        adicionarAoCarrinho(nomeCompleto, produtoSelecionado.preco, produtoSelecionado.icone, opcaoEscolhida, qtdModal);
        modalProduto.classList.remove('ativo');
        abrirCarrinho();
      }
    });

    // ADICIONAR ITEM AO CARRINHO
    function adicionarAoCarrinho(nome, preco, icone, opcao, quantidade) {
      const itemExistente = carrinho.find(item => item.nome === nome);
      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        carrinho.push({ nome, preco, icone, opcao, quantidade });
      }
      atualizarCarrinho();
    }

    // ATUALIZAR INTERFACE DO CARRINHO
    function atualizarCarrinho() {
      listaCarrinho.innerHTML = '';
      let total = 0;
      let totalItens = 0;

      if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
      } else {
        carrinho.forEach((item, index) => {
          total += item.preco * item.quantidade;
          totalItens += item.quantidade;

          const itemEl = document.createElement('div');
          itemEl.classList.add('item-carrinho');
          itemEl.innerHTML = `
            <div class="thumb-icone">
              <i data-lucide="${item.icone}"></i>
            </div>
            <div class="info-item">
              <h4>${item.nome}</h4>
              <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
              <div class="qtd-controle">
                <button onclick="alterarQtd(${index}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQtd(${index}, 1)">+</button>
              </div>
            </div>
            <button class="btn-remover" onclick="removerItem(${index})">&times;</button>
          `;
          listaCarrinho.appendChild(itemEl);
        });
      }

      totalCarrinhoEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
      contadorCarrinhoEl.textContent = totalItens;
      lucide.createIcons();
    }

    window.alterarQtd = function(index, mudanca) {
      carrinho[index].quantidade += mudanca;
      if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
      }
      atualizarCarrinho();
    };

    window.removerItem = function(index) {
      carrinho.splice(index, 1);
      atualizarCarrinho();
    };

    btnFinalizarCompra.addEventListener('click', () => {
      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
      } else {
        alert('Compra finalizada com sucesso!');
        carrinho = [];
        atualizarCarrinho();
        fecharCarrinho();
      }
    });

    // OUTRAS MODAIS
    const btnAbrirLogin = document.getElementById('btn-abrir-login');
    const btnFecharLogin = document.getElementById('btn-fechar-modal');
    const modalCadastro = document.getElementById('modal-cadastro');
    const formCadastro = document.getElementById('form-cadastro');

    btnAbrirLogin.addEventListener('click', () => modalCadastro.classList.add('ativo'));
    btnFecharLogin.addEventListener('click', () => modalCadastro.classList.remove('ativo'));

    formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Conta criada com sucesso!');
      modalCadastro.classList.remove('ativo');
      formCadastro.reset();
    });

    const btnAbrirSobre = document.getElementById('btn-abrir-sobre');
    const btnFecharSobre = document.getElementById('btn-fechar-sobre');
    const modalSobre = document.getElementById('modal-sobre');
    const formContacto = document.getElementById('form-contacto');

    btnAbrirSobre.addEventListener('click', () => modalSobre.classList.add('ativo'));
    btnFecharSobre.addEventListener('click', () => modalSobre.classList.remove('ativo'));

    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada com sucesso!');
      modalSobre.classList.remove('ativo');
      formContacto.reset();
    });

    window.addEventListener('click', (event) => {
      if (event.target === modalCadastro) modalCadastro.classList.remove('ativo');
      if (event.target === modalSobre) modalSobre.classList.remove('ativo');
      if (event.target === modalProduto) modalProduto.classList.remove('ativo');
    });
