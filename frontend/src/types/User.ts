export interface User {
  id: string;
  firstName: string;
  lastName: string;
  
  // Campo 'name' para exibir nome completo, combinado de firstName e lastName.
  name: string; 

  birthDate: string;
}