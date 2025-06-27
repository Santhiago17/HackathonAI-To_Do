INSERT INTO users 
    (birth_date, first_name, last_name) 
VALUES 
    ('1995/08/12', 'John', 'Doe'),
    ('1995/08/12', 'John', 'Doe'),
    ('1988/03/25', 'Alice', 'Smith'),
    ('2001/11/01', 'Bob', 'Johnson'),
    ('1970/06/15', 'Maria', 'Silva'),
    ('1999/02/28', 'Carlos', 'Oliveira'),
    ('1992/09/10', 'Sophie', 'Müller'),
    ('1965/04/03', 'Pierre', 'Dupont'),
    ('1980/07/19', 'Li', 'Wei'),
    ('2005/12/05', 'Anna', 'Ivanova'),
    ('1977/01/20', 'David', 'Garcia');

INSERT INTO users 
    (assignee_id, creator_id, description, end_date, priority, status, title)
VALUES 
    (1, 1, "Lavar a louça", "2025/06/26", 3, "IN_PROGRESS", "Louça Suja"),
    (1, 1, "Comprar mantimentos", "2025/06/27", 3, "PENDING", "Lista de compras"),
    (2, 2, "Revisar código do módulo X", "2025/06/28", 3, "IN_PROGRESS", "Revisão Módulo X"),
    (3, 1, "Pagar contas de luz e água", "2025/06/29", 3, "COMPLETED", "Contas do mês"),
    (2, 3, "Agendar reunião com cliente Y", "2025/07/01", 2, "PENDING", "Proposta comercial"),
    (6, 2, "Escrever documentação da API", "2025/07/05", 1, "IN_PROGRESS", "Documentação API"),
    (7, 1, "Levar carro para revisão", "2025/07/10", 2, "PENDING", "Manutenção preventiva"),
    (8, 3, "Preparar apresentação para evento", "2025/07/15", 3, "IN_PROGRESS", "Slide deck"),
    (9, 2, "Pesquisar novas tecnologias", "2025/07/20", 1, "COMPLETED", "Exploração"),
    (10, 1, "Limpar a casa", "2025/07/22", 1, "PENDING", "Organização semanal");