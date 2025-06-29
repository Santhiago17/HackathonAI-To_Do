# HackathonAI-To_Do

📝 Sistema TODO - Aplicação Modernizada
📌 Visão Geral
Este projeto é uma modernização de um sistema de gerenciamento de tarefas originalmente desenvolvido em COBOL. A nova versão foi reestruturada utilizando Java com Spring Boot no backend e React no frontend, oferecendo uma arquitetura moderna baseada em APIs REST e MVC, persistência em banco de dados "In-Memory" e uma interface web responsiva e interativa.

🧱 Arquitetura da Solução
Backend: Java 21 + Spring Boot 

Frontend: React + Axios + React Router + TailwindCSS + Shadcn UI

Banco de Dados: H2 (In-Memory) 

API: RESTful

👤 Funcionalidades de Usuário
Criar Usuário:

- Nome (até 30 caracteres)

- Sobrenome (até 100 caracteres)

- Data de nascimento (idade mínima de 18 anos)

- ID gerado automaticamente

Listar Usuários:

- Exibe ID, nome completo e data de nascimento

- Paginação e busca implementadas

✅ Funcionalidades de Tarefa
Criar Tarefa:

- Título (obrigatório, até 100 caracteres)

- Descrição (até 1000 caracteres)

- Data de conclusão (não pode estar no passado)

- Tags separadas por vírgula (até 100 caracteres)

- Timestamps automáticos de criação e atualização

Editar Tarefa:

- Atualiza campos permitidos (título, descrição, data fim, tags, prioridade)

Listar Tarefas:

- Exibe todas as tarefas com: ID, título, responsável, status, prioridade

- Suporte a filtros, ordenação e paginação

Filtrar por Usuário:

- Lista tarefas atribuídas a um usuário específico

Buscar por Tag:

- Feita a implementação de busca por tags

Atualizar Status:

- Atualiza status textual (ex.: PENDING, IN_PROGRESS, COMPLETED, CANCELLED)

Remover Tarefa:

- Remove a tarefa selecionada do banco

⚙️ Regras de Negócio
Usuário:

- Deve ter no mínimo 18 anos

- Nomes com limite de caracteres

- ID sequencial

- Limite máximo configurável via propriedades

Tarefa:

- Título obrigatório

- Responsável obrigatório

- Validação de data

- Timestamps automáticos

- Prioridade entre 1 e 3

- Status livre com sugestão padrão

- Limite de tarefas por usuário configurável


👥 Time de Desenvolvimento
Este projeto foi desenvolvido por:
- https://github.com/Daniel-Lzs
- https://github.com/banaclara
- https://github.com/AkstrikeX
- https://github.com/AleLorencato
- https://github.com/mayaramog
- https://github.com/Santhiago17
- https://github.com/GiovannaRMendes
- https://github.com/JaymeHolanda
- https://github.com/gabrielleff
- https://github.com/LucasTeixeiraSantos
