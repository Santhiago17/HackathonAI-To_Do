# API Endpoints Documentation

## User Endpoints

### POST /api/users
Criar um novo usuário.

**Request Body:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "birthDate": "1990-01-15"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "firstName": "João",
  "lastName": "Silva",
  "birthDate": "1990-01-15",
  "age": 34
}
```

### GET /api/users
Listar todos os usuários.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "João",
    "lastName": "Silva",
    "birthDate": "1990-01-15",
    "age": 34
  }
]
```

## Task Endpoints

### POST /api/tasks
Criar uma nova tarefa.

**Request Body:**
```json
{
  "title": "Minha Tarefa",
  "description": "Descrição da tarefa",
  "endDate": "2025-07-01",
  "creator": {"id": 1},
  "assignee": {"id": 1},
  "tags": ["work", "important"],
  "priority": "1",
  "status": "PENDING"
}
```

### GET /api/tasks
Listar todas as tarefas.

### GET /api/tasks/user/{userId}
Listar tarefas por usuário específico.

### GET /api/tasks/search?tag={tag}
Buscar tarefas por tag.

### PUT /api/tasks/{id}
Editar uma tarefa existente.

### PUT /api/tasks/{id}/status
Atualizar apenas o status de uma tarefa.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

### DELETE /api/tasks/{id}
Remover uma tarefa.

## Task Status Values
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELLED

## Validation Rules

### User
- firstName: obrigatório, máximo 30 caracteres
- lastName: obrigatório, máximo 100 caracteres
- birthDate: obrigatório, deve ser no passado, idade mínima 18 anos

### Task
- title: obrigatório, máximo 100 caracteres
- description: opcional, máximo 1000 caracteres
- assignee: obrigatório
- endDate: opcional, não pode ser no passado
- priority: deve ser 1, 2 ou 3
- tags: máximo 100 caracteres no total
