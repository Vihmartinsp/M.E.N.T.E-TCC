# M.E.N.T.E-TCC

## Firebase

A página de login usa o Firebase Authentication para entrada e criação de contas. No cadastro, os dados do perfil (`name`, `phone`, `email` e `createdAt`) são gravados no documento `users/{uid}` do Cloud Firestore.

Para o fluxo funcionar no projeto Firebase `mentee-bc47f`:

1. Ative o provedor **E-mail/senha** em **Authentication > Sign-in method**.
2. Crie o banco do **Cloud Firestore**.
3. Configure as regras do Firestore para que cada usuário autenticado possa criar e acessar somente o documento correspondente ao próprio `uid`.
4. Adicione os domínios de publicação em **Authentication > Settings > Authorized domains**.

As credenciais públicas de configuração do aplicativo ficam em `login.js`. A proteção dos dados depende das regras do Firebase e não de esconder essa configuração no navegador.

### Firebase CLI

O repositório já está inicializado para o projeto `mentee-bc47f`, com configurações para Firebase Hosting e Cloud Firestore.

Depois de instalar a Firebase CLI e autenticar sua conta, publique as regras, índices e o site com:

```bash
firebase login
firebase deploy
```

Para publicar apenas as regras do banco de dados:

```bash
firebase deploy --only firestore:rules
```
