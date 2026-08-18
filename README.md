# M.E.N.T.E-TCC

## Executar com MongoDB Atlas

1. Copie `.env.example` para `.env` na raiz do projeto.
2. Preencha `MONGODB_URI` com a connection string fornecida pelo Atlas. Se o
   usuário ou a senha tiver caracteres especiais, aplique URL encoding nesses
   valores.
3. Autorize o seu endereço IP em **Network Access** e confirme o usuário em
   **Database Access** no painel do Atlas.
4. Execute `npm install` e depois `npm start`.
5. Acesse `http://localhost:3000/api/health`. Uma conexão válida retorna
   `{"application":"ok","database":"conectado"}`.

O arquivo `.env` é ignorado pelo Git e nunca deve ser versionado. O arquivo
`.env.example` contém somente valores de exemplo, sem credenciais reais.

## Estado da integração

O servidor já conecta ao Atlas e os modelos Mongoose estão preparados. O frontend
ainda mantém o fluxo demonstrativo em `localStorage`; as próximas rotas da API poderão
substituir esse armazenamento gradualmente sem expor a URI ao navegador.
