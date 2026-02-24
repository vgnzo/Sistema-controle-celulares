-- 1. CRIAR TABELA CELULAR
CREATE TABLE Celular (
    imei VARCHAR(15) PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'em estoque'
        CHECK (status IN ('em estoque', 'entregue', 'manutenção', 'devolvido')),
    fornecedor VARCHAR(100),
    data_aquisicao DATE NOT NULL,
    vida_util INT
);
GO

-- 2. CRIAR TABELA COLABORADOR
CREATE TABLE Colaborador (
    registro VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    departamento VARCHAR(50),
    cargo VARCHAR(50),
    telefone_contato VARCHAR(20),
    cpf VARCHAR(11),
    email VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ativo'
        CHECK (status IN ('ativo', 'inativo')),
    data_admissao DATE
);
GO

-- 3. CRIAR TABELA ENTREGA (COM CHAVE COMPOSTA)
CREATE TABLE Entrega (
    imei VARCHAR(15) NOT NULL,
    registro VARCHAR(20) NOT NULL,
    data_entrega DATE NOT NULL,
    data_prevista_devolucao DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo'
        CHECK (status IN ('ativo', 'devolvido', 'atrasado')),
    
    -- CHAVE PRIMÁRIA COMPOSTA
    PRIMARY KEY (imei, registro),
    
    -- Chaves estrangeiras
    FOREIGN KEY (imei) REFERENCES Celular(imei),
    FOREIGN KEY (registro) REFERENCES Colaborador(registro)
);
GO