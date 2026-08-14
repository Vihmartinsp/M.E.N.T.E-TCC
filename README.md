# M.E.N.T.E-TCC

## Supabase

A página de login usa o Supabase Authentication para entrada e criação de contas.
No cadastro, `name` e `phone` são enviados como metadados do usuário e copiados,
junto com o e-mail, para `public.profiles` por um trigger do banco de dados.

Para configurar os perfis, execute o conteúdo de
[`supabase/profiles.sql`](./supabase/profiles.sql) no SQL Editor do Supabase. O
script cria a tabela, ativa Row Level Security, restringe leitura e atualização
ao dono do perfil e instala a função e o trigger de criação automática.

Se a confirmação de e-mail estiver habilitada, o usuário recebe a orientação
para confirmar o cadastro. Caso ela esteja desabilitada e o cadastro já retorne
uma sessão, a aplicação redireciona para a página inicial.

## Configuração anterior do Firebase

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

### Emuladores locais

Inicie os emuladores de Authentication, Firestore e Hosting, junto com a Emulator UI, com:

```bash
firebase emulators:start
```

Para preservar os dados locais entre execuções, importe os dados existentes e exporte as alterações ao encerrar:

```bash
firebase emulators:start --import=./firebase-data --export-on-exit=./firebase-data
```

O aplicativo se conecta aos emuladores somente quando é acessado por `localhost` ou `127.0.0.1`. No Firebase Hosting publicado, o hostname não corresponde a nenhum desses valores e, portanto, as conexões continuam usando os serviços Firebase de produção.
