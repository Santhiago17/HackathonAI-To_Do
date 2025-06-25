# Cards de Migração: COBOL TODO → Spring Boot + React

## Legenda de Dificuldade
- 🟢 **FÁCIL**: Implementação básica, conceitos fundamentais
- 🟡 **MÉDIO**: Requer conhecimento intermediário, algumas integrações
- 🔴 **DIFÍCIL**: Complexidade alta, múltiplas tecnologias

---

## FASE 1: BACKEND (Spring Boot)

### Card #01 - Setup do Projeto Spring Boot
**Dificuldade**: 🟢 **FÁCIL**
**Prioridade**: CRÍTICA

**Descrição**: Criar projeto Spring Boot base com configurações iniciais
**Tarefas**:
- [ ] Criar projeto Spring Boot 3.x com Spring Web, JPA, H2
- [ ] Configurar application.properties
- [ ] Estruturar pacotes (entity, repository, service, controller)
- [ ] Adicionar dependências essenciais (Validation, DevTools)
- [ ] Configurar banco H2 em memória

**Critérios de Aceite**:
- Aplicação sobe sem erros
- H2 console acessível
- Estrutura de pacotes criada

---

### Card #02 - Entidade User (Usuário)
**Dificuldade**: 🟢 **FÁCIL**
**Prioridade**: ALTA

**Descrição**: Implementar entidade User baseada na estrutura COBOL
**Tarefas**:
- [ ] Criar classe User com anotações JPA
- [ ] Implementar campos: id, firstName (30), lastName (100), birthDate, age
- [ ] Adicionar validações Bean Validation
- [ ] Configurar geração automática de ID
- [ ] Implementar cálculo automático de idade

**Critérios de Aceite**:
- Validação firstName ≤ 30 caracteres
- Validação lastName ≤ 100 caracteres  
- Validação idade ≥ 18 anos
- Tabela criada automaticamente no H2

**Regras COBOL Preservadas**:
- Máximo 30 chars para firstName
- Máximo 100 chars para lastName
- Idade mínima 18 anos

---

### Card #03 - Entidade Task (Tarefa)
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: ALTA

**Descrição**: Implementar entidade Task com todos os campos do COBOL
**Tarefas**:
- [ ] Criar classe Task com anotações JPA
- [ ] Implementar todos os campos conforme COBOL
- [ ] Adicionar relacionamento ManyToOne com User (creator, assignee)
- [ ] Implementar enum Priority (LOW=1, MEDIUM=2, HIGH=3)
- [ ] Configurar timestamps automáticos (createdAt, updatedAt)
- [ ] Adicionar validações Bean Validation

**Critérios de Aceite**:
- Título obrigatório, máximo 100 caracteres
- Descrição opcional, máximo 1000 caracteres
- EndDate não pode ser no passado
- AssigneeId obrigatório
- Tags máximo 100 caracteres
- Priority entre 1-3
- Timestamps automáticos

**Regras COBOL Preservadas**:
- Todas as validações de tamanho e obrigatoriedade
- Relacionamento creator/assignee
- Controle de timestamps

---

### Card #04 - Repository Layer
**Dificuldade**: 🟢 **FÁCIL**
**Prioridade**: ALTA

**Descrição**: Criar repositories JPA para User e Task
**Tarefas**:
- [ ] Criar UserRepository extends JpaRepository
- [ ] Criar TaskRepository extends JpaRepository  
- [ ] Adicionar query customizada findTasksByAssigneeId
- [ ] Adicionar query customizada findTasksByTagsContaining
- [ ] Implementar método para busca por tag exata

**Critérios de Aceite**:
- CRUD básico funcionando
- Busca por assignee implementada
- Busca por tag implementada
- Métodos testáveis

---

### Card #05 - Service Layer - User
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: ALTA

**Descrição**: Implementar lógica de negócio para usuários
**Tarefas**:
- [ ] Criar UserService com validações
- [ ] Implementar createUser com cálculo de idade
- [ ] Implementar listAllUsers
- [ ] Adicionar validação de idade mínima
- [ ] Implementar tratamento de exceções customizadas

**Critérios de Aceite**:
- Validação idade ≥ 18 anos
- Cálculo automático de idade
- Exceções customizadas para regras de negócio
- Métodos correspondem às funcionalidades COBOL

**Regras COBOL Preservadas**:
- Idade mínima 18 anos
- Validações de tamanho de campos

---

### Card #06 - Service Layer - Task  
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: ALTA

**Descrição**: Implementar lógica de negócio para tarefas
**Tarefas**:
- [ ] Criar TaskService com todas as validações
- [ ] Implementar createTask com validações completas
- [ ] Implementar updateTask (campos opcionais)
- [ ] Implementar updateTaskStatus
- [ ] Implementar deleteTask
- [ ] Implementar listTasksByUser
- [ ] Implementar searchTasksByTag
- [ ] Adicionar validação de data futura

**Critérios de Aceite**:
- Todas as validações do COBOL implementadas
- EndDate não pode ser no passado
- Assignee obrigatório
- Update de campos opcionais
- Timestamps atualizados automaticamente

**Regras COBOL Preservadas**:
- Todas as validações de campo
- Lógica de update parcial
- Validação de data futura

---

### Card #07 - REST Controllers
**Dificuldade**: 🟡 **MÉDIO**  
**Prioridade**: ALTA

**Descrição**: Criar APIs REST para User e Task
**Tarefas**:
- [ ] Criar UserController com endpoints CRUD
- [ ] Criar TaskController com todos os endpoints
- [ ] Implementar DTOs para entrada/saída
- [ ] Adicionar validações nos controllers
- [ ] Implementar tratamento global de exceções
- [ ] Documentar APIs com Swagger

**Endpoints Necessários**:
```
Users:
POST /api/users - criar usuário
GET /api/users - listar usuários

Tasks:  
POST /api/tasks - criar tarefa
GET /api/tasks - listar todas tarefas
GET /api/tasks/user/{userId} - tarefas por usuário
GET /api/tasks/search?tag={tag} - buscar por tag
PUT /api/tasks/{id} - editar tarefa
PUT /api/tasks/{id}/status - atualizar status
DELETE /api/tasks/{id} - remover tarefa
```

**Critérios de Aceite**:
- Todos endpoints funcionais
- Validações adequadas
- Tratamento de erros
- Documentação Swagger

---

## FASE 2: FRONTEND (React)

### Card #08 - Setup React Application
**Dificuldade**: 🟢 **FÁCIL**
**Prioridade**: ALTA

**Descrição**: Criar aplicação React com configurações iniciais
**Tarefas**:
- [ ] Criar projeto React com Vite
- [ ] Configurar Axios para chamadas API
- [ ] Configurar React Router
- [ ] Adicionar biblioteca de componentes (Material-UI ou Bootstrap)
- [ ] Estruturar pastas (components, pages, services, utils)

**Critérios de Aceite**:
- Aplicação React funcionando
- Roteamento configurado
- Biblioteca UI instalada
- Estrutura de pastas organizada

---

### Card #09 - Página de Usuários
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: ALTA

**Descrição**: Implementar interface para gerenciamento de usuários
**Tarefas**:
- [ ] Criar componente UserList
- [ ] Criar componente UserForm  
- [ ] Implementar validação de formulário
- [ ] Conectar com APIs do backend
- [ ] Adicionar feedback visual (loading, success, error)

**Funcionalidades**:
- Listar usuários cadastrados
- Formulário de criação de usuário
- Validações em tempo real
- Mensagens de erro/sucesso

**Critérios de Aceite**:
- Interface intuitiva e responsiva
- Validações funcionando
- Integração com backend completa
- Tratamento de erros adequado

---

### Card #10 - Página de Tarefas - Listagem
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: ALTA

**Descrição**: Implementar listagem e busca de tarefas
**Tarefas**:
- [ ] Criar componente TaskList
- [ ] Implementar filtro por usuário
- [ ] Implementar busca por tag
- [ ] Adicionar ordenação por data/prioridade
- [ ] Implementar paginação se necessário

**Funcionalidades**:
- Lista todas as tarefas
- Filtro por usuário responsável
- Busca por tag
- Visualização clara de status e prioridade

**Critérios de Aceite**:
- Listagem clara e organizada
- Filtros funcionando
- Performance adequada
- Interface responsiva

---

### Card #11 - Página de Tarefas - CRUD
**Dificuldade**: 🔴 **DIFÍCIL**
**Prioridade**: ALTA

**Descrição**: Implementar formulários de criação e edição de tarefas
**Tarefas**:
- [ ] Criar componente TaskForm (create/edit)
- [ ] Implementar validações complexas
- [ ] Criar seletor de usuário (dropdown)
- [ ] Implementar campos de data com validação
- [ ] Adicionar update de status rápido
- [ ] Implementar confirmação de exclusão

**Funcionalidades**:
- Criar nova tarefa
- Editar tarefa existente
- Atualizar status rapidamente
- Excluir tarefa com confirmação

**Critérios de Aceite**:
- Formulário intuitivo e validado
- Todas as regras de negócio implementadas
- UX fluida para operações CRUD
- Confirmações adequadas para ações destrutivas

---

### Card #12 - Dashboard Principal
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: MÉDIA

**Descrição**: Criar página principal com visão geral do sistema
**Tarefas**:
- [ ] Criar layout principal com menu
- [ ] Implementar cards de resumo (total users, tasks por status)
- [ ] Adicionar gráfico simples de tarefas por status
- [ ] Implementar lista de tarefas recentes
- [ ] Adicionar navegação rápida

**Funcionalidades**:
- Visão geral do sistema
- Estatísticas básicas
- Acesso rápido às funcionalidades
- Interface moderna e clara

**Critérios de Aceite**:
- Dashboard informativo
- Navegação intuitiva
- Design moderno
- Performance adequada

---

## FASE 3: MELHORIAS E POLIMENTO

### Card #13 - Tratamento de Erros Global
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: MÉDIA

**Descrição**: Implementar tratamento consistente de erros
**Tarefas**:
- [ ] Criar interceptador Axios para erros
- [ ] Implementar notificações toast
- [ ] Padronizar mensagens de erro
- [ ] Adicionar fallbacks para falhas de rede
- [ ] Implementar retry automático quando apropriado

---

### Card #14 - Testes Unitários Backend
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: BAIXA

**Descrição**: Implementar testes para services e controllers
**Tarefas**:
- [ ] Testes unitários UserService
- [ ] Testes unitários TaskService  
- [ ] Testes de integração Controllers
- [ ] Testes de validação
- [ ] Configurar coverage report

---

### Card #15 - Testes Frontend
**Dificuldade**: 🟡 **MÉDIO**
**Prioridade**: BAIXA

**Descrição**: Implementar testes React com Testing Library
**Tarefas**:
- [ ] Testes de componentes principais
- [ ] Testes de formulários e validações
- [ ] Testes de integração com APIs
- [ ] Configurar coverage report
- [ ] Testes E2E básicos com Cypress

---

## RESUMO DE IMPLEMENTAÇÃO

**Ordem Sugerida de Execução**:
1. Cards #01-#07 (Backend completo)
2. Card #08 (Setup React)
3. Cards #09-#11 (Frontend CRUD)
4. Card #12 (Dashboard)
5. Cards #13-#15 (Melhorias e testes)

**Total Estimado**: 15 cards
**Distribuição por Dificuldade**:
- 🟢 Fácil: 3 cards
- 🟡 Médio: 10 cards  
- 🔴 Difícil: 2 cards

**Funcionalidades COBOL Preservadas**:
✅ Todas as validações de negócio
✅ Estrutura de dados equivalente
✅ Funcionalidades de CRUD completas
✅ Regras de idade e datas
✅ Sistema de tags e prioridades
✅ Controle de timestamps
