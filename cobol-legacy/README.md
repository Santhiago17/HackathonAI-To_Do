# COBOL TODO Application

This is a TODO application written in COBOL, running via Docker.

## Features
- User and Task management
- Business rules and validations
- Interactive menu (in English)
- Modular code structure
- Dockerized build and execution

## Usage
Build and run using Docker (see Dockerfile for details).

## Build and Run (Docker)

1. Open the terminal in the project folder.
2. To build the Docker image:

   ```sh
   docker build -t cobol-todo .
   ```

3. To run the interactive application:

   ```sh
   docker run --rm -it cobol-todo
   ```

The menu will be displayed in the terminal for interactive use.

## Menu Options
- Create user
- List users
- Create task
- Edit task
- List all tasks
- List tasks assigned to a user

## Requirements
- Docker

---

For more details, see the source code and comments.
