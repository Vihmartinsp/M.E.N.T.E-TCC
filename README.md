# M.E.N.T.E-TCC

## Arquitetura

- **Firebase Authentication:** autenticação por Google ou e-mail e senha.
- **MongoDB Atlas:** banco principal de usuários, progresso, questões, ranking e medalhas.
- **Firebase Admin SDK:** valida no backend o ID token enviado pelo navegador.

A connection string do Atlas e a conta de serviço nunca são enviadas ao navegador.
O backend só aceita os dados do usuário depois de validar o ID token do Firebase.

## Configuração do MongoDB Atlas

1. Copie `.env.example` para `.env` na raiz do projeto.
2. Preencha `MONGODB_URI` com a connection string fornecida pelo Atlas. Se o
   usuário ou a senha tiver caracteres especiais, aplique URL encoding.
3. Autorize o seu endereço IP em **Network Access** e confirme o usuário em
   **Database Access** no painel do Atlas.

## Configuração do Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e abra ou
   crie o projeto da M.E.N.T.E.
2. Em **Authentication > Sign-in method**, habilite o provedor **Google**, escolha
   o e-mail de suporte do projeto e salve.
3. Se quiser manter também os formulários existentes, habilite o provedor
   **E-mail/senha** na mesma tela.
4. Em **Authentication > Settings > Authorized domains**, adicione o domínio em
   que o site será publicado. `localhost` deve permanecer autorizado para testes.
5. Em **Project settings > General > Your apps**, crie um aplicativo **Web**.
6. Copie os valores do objeto `firebaseConfig` para as variáveis públicas
   `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`,
   `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID` e `FIREBASE_APP_ID`
   do arquivo `.env`.
7. Em **Project settings > Service accounts**, gere uma nova chave privada apenas
   para o ambiente local. Salve o JSON na raiz como
   `firebase-service-account.json`; esse nome já está protegido pelo `.gitignore`.
8. Defina `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json` no
   `.env`. Em hospedagens Google com Application Default Credentials, use a
   identidade do serviço em vez de salvar um JSON.

Nunca copie a chave privada para `login.js`, `server.js`, `.env.example` ou para o
GitHub. A configuração Web é pública por natureza, mas neste projeto também é
fornecida ao frontend pelo backend por meio de `/api/config/firebase`.

## Executar e testar

```bash
npm install
npm start
```

Acesse `http://localhost:3000/login.html` e clique em **Entrar com Google**. Para
verificar MongoDB e servidor sem fazer login, acesse:

```bash
curl http://localhost:3000/api/health
```

Uma conexão válida retorna:

```json
{"application":"ok","database":"conectado"}
```

Após o primeiro login, consulte a coleção `users` no Atlas. O backend cria o
usuário automaticamente com `firebaseUid`, nome, e-mail, pontuação, progresso,
medalhas, nível e data de criação. Logins seguintes reutilizam o mesmo registro.
