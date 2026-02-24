📱 Sistema de Controle de Celulares Corporativos
Sistema Full Stack para gestão e controle de entrega de aparelhos celulares corporativos.

📋 Sobre o Projeto
Sistema desenvolvido para empresas controlarem a distribuição, uso e devolução de celulares corporativos entre colaboradores.
Problema resolvido: Evitar perda de controle sobre quem está com cada aparelho, quando foi entregue e quando deve ser devolvido.

🚀 Tecnologias Utilizadas
Backend

Java 17
Spring Boot 3.2.0
Spring Data JPA (persistência de dados)
Spring Security (autenticação JWT)
SQL Server Express (banco de dados)
Maven (gerenciamento de dependências)
Lombok (redução de código boilerplate)

Frontend

React 18
Bootstrap 5 (estilização)
Axios (requisições HTTP)
React Hooks (useState, useEffect)


📊 Funcionalidades
✅ Gestão de Celulares

Cadastro, edição, listagem e exclusão
Controle de status (em estoque, entregue, manutenção, devolvido)
Validação de IMEI único
Máscara de formatação de IMEI

✅ Gestão de Colaboradores

Cadastro completo de funcionários
Validação de CPF único
Máscaras de CPF e telefone
Controle de status (ativo/inativo)

✅ Gestão de Entregas

Relacionamento entre Celular e Colaborador
Controle de datas de entrega e devolução
Sincronização automática de status
Validação de entregas duplicadas

✅ Autenticação e Segurança

Sistema de login com JWT
Proteção de rotas
Apenas administradores autorizados


🗄️ Modelagem do Banco de Dados
Tabela: Celular
sql- imei (PK) VARCHAR(15)
- modelo VARCHAR(100)
- status VARCHAR(20)
- fornecedor VARCHAR(100)
- data_aquisicao DATE
- vida_util INT
Tabela: Colaborador
sql- registro (PK) VARCHAR(20)
- nome VARCHAR(100)
- cpf VARCHAR(11)
- email VARCHAR(100)
- telefone_contato VARCHAR(15)
- departamento VARCHAR(50)
- cargo VARCHAR(50)
- status VARCHAR(20)
- data_admissao DATE
Tabela: Entrega
sql- imei (FK) VARCHAR(15)
- registro (FK) VARCHAR(20)
- data_entrega DATE
- data_prevista_devolucao DATE
- status VARCHAR(20)
PRIMARY KEY (imei, registro)
```

---

## 🎯 Regras de Negócio Implementadas

### Celular
- ✅ IMEI único (não permite duplicidade)
- ✅ Status validado: `em estoque`, `entregue`, `manutenção`, `devolvido`
- ✅ Só pode ser deletado se estiver `em estoque`

### Colaborador
- ✅ CPF único (não permite duplicidade)
- ✅ Status validado: `ativo`, `inativo`
- ✅ Validação de email

### Entrega
- ✅ Chave composta (IMEI + Registro)
- ✅ Não permite duas entregas ativas para o mesmo celular
- ✅ Celular só pode ser entregue se estiver `em estoque`
- ✅ Ao cadastrar entrega, celular muda para `entregue`
- ✅ Ao devolver entrega, celular volta para `em estoque`
- ✅ Ao deletar entrega ativa, celular volta para `em estoque`

---

## 🏗️ Arquitetura do Projeto

### Backend (Spring Boot)
```
backend/
├── config/          # Configurações (CORS)
├── controller/      # Endpoints REST (recebe requisições HTTP)
├── dto/             # Objetos de transferência de dados
├── exception/       # Tratamento global de erros
├── model/           # Entidades JPA (mapeamento para o banco)
├── repository/      # Acesso ao banco de dados
├── security/        # Autenticação JWT
└── service/         # Regras de negócio
```

### Frontend (React)
```
frontend/
├── components/      # Componentes React (Listas, Formulários)
├── pages/           # Páginas completas (Celulares, Colaboradores, Entregas, Login)
├── services/        # Conexão com API (axios)
└── App.js           # Componente principal (rotas e autenticação)

🔧 Como Executar o Projeto
Pré-requisitos

Java 17 ou superior
Node.js 16+ e npm
SQL Server Express
Maven 3.8+

1️⃣ Configurar o Banco de Dados
Execute o script SQL em database/script.sql no SQL Server Management Studio.
2️⃣ Executar o Backend
bashcd backend
mvn spring-boot:run
Backend rodará em: http://localhost:8080
3️⃣ Executar o Frontend
bashcd frontend
npm install
npm start
```

Frontend rodará em: `http://localhost:3000`

### 4️⃣ Fazer Login
```
Usuário: admin
Senha: admin123
```

---

## 📡 Endpoints da API

### Autenticação
```
POST   /api/auth/login          # Login (retorna JWT token)
GET    /api/auth/validate       # Validar token
```

### Celulares
```
GET    /api/celulares           # Listar todos
GET    /api/celulares/{imei}    # Buscar por IMEI
POST   /api/celulares           # Cadastrar
PUT    /api/celulares/{imei}    # Atualizar
DELETE /api/celulares/{imei}    # Deletar
GET    /api/celulares/status/{status}  # Filtrar por status
```

### Colaboradores
```
GET    /api/colaboradores                    # Listar todos
GET    /api/colaboradores/{registro}         # Buscar por registro
POST   /api/colaboradores                    # Cadastrar
PUT    /api/colaboradores/{registro}         # Atualizar
DELETE /api/colaboradores/{registro}         # Deletar
GET    /api/colaboradores/departamento/{dep} # Filtrar por departamento
```

### Entregas
```
GET    /api/entregas                         # Listar todas
GET    /api/entregas/{imei}/{registro}       # Buscar específica
POST   /api/entregas                         # Cadastrar
PUT    /api/entregas/{imei}/{registro}       # Atualizar
DELETE /api/entregas/{imei}/{registro}       # Deletar
GET    /api/entregas/celular/{imei}          # Entregas de um celular
GET    /api/entregas/colaborador/{registro}  # Entregas de um colaborador

🎨 Capturas de Tela
(Adicione prints do sistema aqui)

🚧 Melhorias Futuras

 Deploy na nuvem (AWS, Azure ou Heroku)
 Sistema completo de usuários (cadastro de admins no banco)
 Dashboard com estatísticas e gráficos
 Relatórios em PDF
 Notificações de entregas atrasadas
 Histórico de todas as movimentações
 Soft delete (manter histórico)
 Auditoria com timestamps