-- Cria o banco utilizado pela API e seleciona-o para as tabelas seguintes.
CREATE DATABASE IF NOT EXISTS Projeto_integrador;
USE Projeto_integrador;

-- Guarda os dados basicos de cada cliente.
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guarda um endereco por cliente e remove-o junto com o cliente.
CREATE TABLE IF NOT EXISTS cadastro (
    id_cadastro INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL UNIQUE,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    data_nascimento DATE,
    CONSTRAINT fk_cadastro_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Guarda as credenciais e o estado de cada conta.
CREATE TABLE IF NOT EXISTS login (
    id_login INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ultimo_acesso DATETIME,
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_login_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Guarda mensagens e o estado do atendimento ao cliente.
CREATE TABLE IF NOT EXISTS consulta (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    assunto VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    data_consulta DATETIME DEFAULT CURRENT_TIMESTAMP,
    status_consulta ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO') DEFAULT 'PENDENTE',
    CONSTRAINT fk_consulta_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Guarda o catalogo usado pelo carrinho e pelo checkout.
CREATE TABLE IF NOT EXISTS produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    is_organico BOOLEAN DEFAULT TRUE,
    is_vegano BOOLEAN DEFAULT TRUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guarda os produtos escolhidos, sem duplicar o mesmo produto por cliente.
CREATE TABLE IF NOT EXISTS carrinho_de_compra (
    id_carrinho INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    data_adicao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrinho_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_carrinho_produto FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_cliente_produto UNIQUE (id_cliente, id_produto)
);

-- Registra compras confirmadas e o metodo de pagamento.
CREATE TABLE IF NOT EXISTS compra (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    metodo_pagamento ENUM('CARTAO', 'PIX', 'BOLETO') NOT NULL,
    status_compra ENUM('PENDENTE', 'PAGO', 'CANCELADO') DEFAULT 'PENDENTE',
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compra_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Guarda uma nota fiscal vinculada a cada compra.
CREATE TABLE IF NOT EXISTS nota_fiscal (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL UNIQUE,
    chave_acesso VARCHAR(44) NOT NULL UNIQUE,
    valor_imposto DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nota_compra FOREIGN KEY (id_compra)
        REFERENCES compra(id_compra) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insere um cliente de demonstracao sem duplicar seu identificador.
INSERT INTO cliente (id_cliente, nome, cpf_cnpj, telefone)
VALUES (1, 'Maria Silva', '123.456.789-00', '11999998888')
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    cpf_cnpj = VALUES(cpf_cnpj),
    telefone = VALUES(telefone);

-- Insere a conta de demonstracao depois que a tabela e o cliente existem.
INSERT INTO login (id_cliente, email, senha, ativo)
VALUES (1, 'cliente@biocosmetics.com', '123', TRUE)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    senha = VALUES(senha),
    ativo = VALUES(ativo);

-- Inclui produtos de demonstracao somente quando ainda nao estao cadastrados.
INSERT INTO produto (nome, descricao, preco, estoque, categoria, is_organico, is_vegano)
SELECT 'Sabonete Botanico de Calendula',
       'Sabonete artesanal para peles sensiveis', 24.50, 50, 'Sabonetes', TRUE, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM produto WHERE nome = 'Sabonete Botanico de Calendula'
);

INSERT INTO produto (nome, descricao, preco, estoque, categoria, is_organico, is_vegano)
SELECT 'Shampoo Solido de Pitanga',
       'Shampoo sustentavel com ativos naturais', 38.90, 40, 'Capilar', TRUE, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM produto WHERE nome = 'Shampoo Solido de Pitanga'
);

INSERT INTO produto (nome, descricao, preco, estoque, categoria, is_organico, is_vegano)
SELECT 'Creme Hidratante de Amendoas',
       'Creme corporal com hidratacao profunda', 59.90, 30, 'Corporal', TRUE, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM produto WHERE nome = 'Creme Hidratante de Amendoas'
);
