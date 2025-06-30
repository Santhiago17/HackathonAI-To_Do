## Execução do Backend (Spring Boot)

### Navegue até o diretório do backend:
```bash
cd backend/hackathon-AI
```

### Execute a aplicação:
```bash
# Usando Maven Wrapper (recomendado)
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run

# Usando Maven instalado
mvn spring-boot:run
```

### Outros comandos úteis:
```bash
# Compilar o projeto
./mvnw compile

# Executar testes
./mvnw test

# Gerar JAR
./mvnw package

# Limpar e compilar
./mvnw clean install
```

## Acesso à Aplicação
- **Backend API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (deixar em branco)