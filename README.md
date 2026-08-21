# M.E.N.T.E-TCC

Protótipo educacional da plataforma M.E.N.T.E para estudo de Matemática do ENEM.

## Executar localmente

O projeto funciona como um site estático e, nesta versão, utiliza `localStorage`
para manter o usuário demonstrativo, a pontuação e as questões respondidas.

Na raiz do projeto, execute:

```bash
python3 -m http.server 4173
```

Depois, acesse:

```text
http://localhost:4173/login.html
```

Digite um e-mail válido para entrar. A página de questões e todas as abas da
plataforma continuam disponíveis sem configuração de Firebase, MongoDB ou outro
serviço externo.
