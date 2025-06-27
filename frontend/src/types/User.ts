// src/types/User.ts

// Interface que representa a estrutura de um Usuário no frontend,
// baseada nos atributos do COBOL e suas transformações.
export interface User {
  id: string; // USERS-ID (PIC 9(4) no COBOL, convertido para string no frontend para consistência de IDs)
  firstName: string; // USERS-FIRST-NAME (PIC X(30) no COBOL)
  lastName: string; // USERS-LAST-NAME (PIC X(100) no COBOL)
  
  // Campo 'name' para exibir nome completo, combinado de firstName e lastName.
  name: string; 

  birthDate: string; // USERS-BIRTH-DATE (PIC 9(8) - YYYYMMDD no COBOL, mantido como string no frontend)
  // Nota: Podemos parsear para 'Date' objetos se necessário para manipulação,
  // mas como string 'YYYYMMDD' é como vem do COBOL e é um formato comum.
}