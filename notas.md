🎯 Conceitos Fundamentais
O que é cada pasta no Backend?
repository = Responsável por buscar/guardar dados no banco de dados
→ Faz as operações: salvar, buscar, atualizar e deletar
service = Onde fica a lógica do sistema
→ É onde valido as regras de negócio antes de salvar no banco
controller = Quem recebe as requisições HTTP e devolve as respostas
→ É onde exponho os endpoints HTTP (acessíveis pelo navegador ou Postman)
model = Representa as entidades (tabelas do banco)
→ Mapeia objetos Java para tabelas do SQL Server
dto = Data Transfer Object (objetos de transferência de dados)
→ Usado para receber/enviar dados na API sem expor a entidade completa
exception = Tratamento global de erros
→ Centraliza como os erros são retornados para o frontend
security = Autenticação e autorização
→ Controle de acesso com JWT
config = Configurações do sistema
→ CORS, beans, etc.

🔧 Anotações Spring Boot
JPA (Java Persistence API)
O que é: Especificação (conjunto de regras) que define como mapear objetos Java para tabelas do banco de dados.
Jakarta
O que é: Novo nome das bibliotecas Java Enterprise (antes era javax, agora é jakarta)

🏷️ Anotações Importantes
Entidades e Mapeamento
@Entity = Marca a classe como uma entidade JPA (será uma tabela no banco)
@Table(name = "...") = Define o nome da tabela no banco
@Id = Marca o campo como chave primária
@EmbeddedId = Diz pro JPA que a PK desta entidade é um objeto composto ao invés de um simples @Id
@Embeddable = Marca uma classe que vai ser embutida dentro de outra entidade (usado para chave composta)
@Column(name = "...") = Mapeia o atributo para uma coluna específica do banco
@ManyToOne = Define um relacionamento onde MUITAS entregas podem pertencer a UM celular ou UM colaborador
@MapsId = Conecta o campo do relacionamento com o campo correspondente dentro do ID composto

Validações
@NotNull = Campo não pode ser nulo
@NotBlank = Campo não pode ser vazio ou só espaços em branco
@Pattern(regexp = "...") = Valida se o valor de uma String segue um padrão específico (regex)
@Valid = Valida automaticamente os campos anotados (obrigatórios, padrões, etc.)

Controllers
@RestController = Marca a classe como um controlador REST (API)
@RequestMapping("/api/...") = Define a URL base para todas as rotas do controller
@GetMapping = Responde a requisições GET (buscar dados)
@PostMapping = Responde a requisições POST (criar dados)
@PutMapping = Responde a requisições PUT (atualizar dados)
@DeleteMapping = Responde a requisições DELETE (deletar dados)
@PathVariable = Captura um valor que está dentro da URL
→ Exemplo: /api/celulares/{imei} → captura o IMEI
@RequestBody = Recebe JSON no corpo da requisição e transforma em objeto Java
@CrossOrigin(origins = "*") = Permite acesso de qualquer origem (frontend)

Respostas HTTP
ResponseEntity = Classe do Spring que representa uma resposta HTTP completa
Permite controlar:

Status HTTP (200, 404, 500, etc.)
Corpo da resposta (JSON, texto, etc.)
Headers (cabeçalhos HTTP - opcional)

.ok() = Retorna status 200 OK com corpo
.notFound().build() = Retorna status 404 Not Found sem corpo
.badRequest() = Retorna status 400 Bad Request
.status(HttpStatus.CREATED) = Retorna status 201 Created
.noContent().build() = Retorna status 204 No Content
→ Significa: "deu certo mas não tenho nada pra mostrar"
→ Usado no DELETE após deletar
.build() = Usado para finalizar/construir uma resposta HTTP sem corpo

Tratamento de Erros
throw = Serve para lançar exceções de erros manualmente durante a execução do programa
@ControllerAdvice = Tratamento global de exceções
→ Centraliza como os erros são retornados
@ExceptionHandler = Define qual exceção será tratada

Segurança
@Component = Marca a classe como um componente gerenciado pelo Spring
JWT (JSON Web Token) = Token de autenticação que permite login sem sessão

Serialização
Serializable = Interface que permite que o objeto seja convertido em bytes
→ JPA exige que chaves compostas implementem Serializable

⚛️ Conceitos React (Frontend)
Hooks Principais
useState = Gerenciamento de Estado
→ Permite adicionar dados dinâmicos a um componente funcional
→ Ao serem alterados, forçam a renderização da tela para mostrar o novo valor
javascriptconst [nome, setNome] = useState('');
useEffect = Efeitos Colaterais
→ Executa lógica após o componente ser renderizado
→ Ideal para operações assíncronas ou manipulação externa
→ Exemplo: buscar dados da API quando a página carregar
javascriptuseEffect(() => {
  carregarDados();
}, []); // [] = executa só uma vez ao montar
```

---

### Estrutura de Pastas Frontend

**`pages/`** = Páginas completas da aplicação

**`components/`** = Componentes React reutilizáveis

**`services/`** = Chamadas para a API (axios)

---

### Padrão de Nomenclatura

**`handle`** = Prefixo usado em funções que **"lidam com"** eventos  
→ `handleClick`, `handleSubmit`, `handleChange`, etc.

---

## 🔄 Fluxo de uma Requisição
```
FRONTEND (React)
    ↓
    📡 HTTP Request (GET, POST, PUT, DELETE)
    ↓
CONTROLLER (recebe a requisição)
    ↓
SERVICE (valida regras de negócio)
    ↓
REPOSITORY (acessa o banco de dados)
    ↓
SQL SERVER

📝 Exemplo Prático: POST no CelularController
O que faz cada parte?
java@PostMapping // → Responde a POST em /api/celulares
public ResponseEntity<?> cadastrar(
    @Valid @RequestBody Celular celular // → Recebe JSON e valida
) {
    try {
        Celular novoCelular = celularService.cadastrar(celular);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCelular); 
        // → Retorna 201 Created
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage()); 
        // → Se erro, retorna 400 Bad Request
    }
}
Linha por linha:

@PostMapping → Endpoint POST
@RequestBody → Transforma JSON em objeto Java
@Valid → Valida campos obrigatórios automaticamente
HttpStatus.CREATED → Retorna 201 (sucesso ao criar)
catch → Se der erro (ex: IMEI duplicado), retorna 400 com mensagem


🎯 Conceitos Avançados
Chave Composta (Entrega)
Por que usar?
→ Uma entrega é única pela combinação de IMEI + Registro
→ Não faz sentido ter uma entrega sem essas duas informações
Como implementar:

Criar classe EntregaId com @Embeddable
Na entidade Entrega, usar @EmbeddedId
Usar @MapsId para conectar relacionamentos


GlobalExceptionHandler
O que faz:
→ Captura todos os erros do sistema em um só lugar
→ Retorna JSON formatado ao invés de HTML feio
Vantagem:
→ Controllers ficam limpos (sem try-catch)
→ Erros padronizados em toda a API

🔐 Autenticação JWT
Fluxo:

Usuário faz login com username/password
Backend valida e gera um token JWT
Frontend salva o token no localStorage
Em todas as próximas requisições, envia o token no header
Backend valida o token antes de permitir acesso

Vantagem:
→ Sem necessidade de sessão no servidor
→ Stateless (não guarda estado)

💡 Dicas de Boas Práticas
✅ Sempre valide dados antes de salvar no banco
✅ Use DTOs para não expor entidades completas
✅ Trate exceções de forma centralizada
✅ Documente o código com comentários claros
✅ Siga convenções de nomenclatura (camelCase, PascalCase)
✅ Teste os endpoints antes de integrar com frontend