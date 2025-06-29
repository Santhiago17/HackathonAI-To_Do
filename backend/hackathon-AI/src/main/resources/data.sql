INSERT INTO users 
    (birth_date, first_name, last_name) 
VALUES 
    ('1995-08-12', 'John', 'Doe'),
    ('1995-08-12', 'John', 'Doe'),
    ('1988-03-25', 'Alice', 'Smith'),
    ('2001-11-01', 'Bob', 'Johnson'),
    ('1970-06-15', 'Maria', 'Silva'),
    ('1999-02-28', 'Carlos', 'Oliveira'),
    ('1992-09-10', 'Sophie', 'Müller'),
    ('1965-04-03', 'Pierre', 'Dupont'),
    ('1980-07-19', 'Li', 'Wei'),
    ('2005-12-05', 'Anna', 'Ivanova'),
    ('1977-01-20', 'David', 'Garcia');

INSERT INTO tasks
    (assignee_id, creator_id, description, end_date, created_at, priority, status, title)
VALUES
    (1, 1, 'Lavar a louça', '2025-06-27', '2025-06-26', 'HIGH', 'IN_PROGRESS', 'Louça Suja'),
    (1, 1, 'Comprar mantimentos', '2025-06-29', '2025-06-27', 'HIGH', 'PENDING', 'Lista de compras'),
    (2, 2, 'Revisar código do módulo X', '2025-07-01', '2025-06-28', 'HIGH', 'IN_PROGRESS', 'Revisão Módulo X'),
    (3, 1, 'Pagar contas de luz e água', '2025-07-02', '2025-06-28', 'HIGH', 'COMPLETED', 'Contas do mês'),
    (2, 3, 'Agendar reunião com cliente Y', '2025-07-03', '2025-06-28', 'MEDIUM', 'PENDING', 'Proposta comercial'),
    (6, 2, 'Escrever documentação da API', '2025-07-04', '2025-06-28', 'LOW', 'IN_PROGRESS', 'Documentação API'),
    (7, 1, 'Levar carro para revisão', '2025-06-12', '2025-06-10', 'MEDIUM', 'PENDING', 'Manutenção preventiva'),
    (8, 3, 'Preparar apresentação para evento', '2025-06-18', '2025-06-15', 'HIGH', 'CANCELLED', 'Slide deck'),
    (9, 2, 'Pesquisar novas tecnologias', '2025-06-25', '2025-06-20', 'LOW', 'COMPLETED', 'Exploração'),
    (10, 1, 'Limpar a casa', DATEADD('DAY', 5, NOW()), NOW(), 'LOW', 'PENDING', 'Organização semanal');

INSERT INTO task_tags
    (task_id, tag)
VALUES
    (1, 'Casa'),
    (1, 'Casa'),
    (2, 'Compras'),
    (2, 'Casa'),
    (3, 'Revisão'),
    (3, 'Trabalho'),
    (4, 'Contas'),
    (4, 'Casa'),
    (5, 'Reunião'),
    (5, 'Cliente Y'),
    (6, 'Documentação'),
    (6, 'API'),
    (7, 'Carro'),
    (7, 'Manutenção'),
    (8, 'Apresentação'),
    (8, 'Evento'),
    (9, 'Pesquisa'),
    (9, 'Tecnologia'),
    (10, 'Limpeza'),
    (10, 'Casa');
