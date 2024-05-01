export const createUser = {
   firstName: 'john',
   lastName: 'doe',
   email: 'johndoe@gmail.com',
   password: 'd24m2a99'
};

export const createUserReturn = {
   id: 0,
   firstName: 'john',
   lastName: 'doe',
   email: 'johndoe@gmail.com'
};

//função para gerar numero aleatório para email, visto que email na aplicação é único
export const generateDynamicUser = () => {
   return {
      ...createUser,
      email: `testuser${Math.floor(Math.random() * 1000)}@gmail.com`
   };
};
