# 🛡️ Prompt Mestre de Segurança Avançada (Padrão Blindadora CRM)

Este guia contém as diretrizes técnicas para replicar a arquitetura de segurança de alta performance e conformidade (LGPD) em outros projetos SaaS.

---

## 🎯 Objetivo
Implementar uma camada de segurança robusta para sistemas multi-tenant utilizando **Next.js + Supabase**, focando em isolamento total de dados, resiliência contra ataques e auditoria completa.

---

## 🛠️ Diretrizes Técnicas para o Agente IA

### 1. Isolamento Multi-tenant (DB & Storage)
- **Database RLS:** Criar função `get_my_org_id()` (SECURITY DEFINER) para recuperar o `organization_id` do perfil do usuário via `auth.uid()`. Aplicar políticas de RLS em todas as tabelas para filtrar estritamente por este ID.
- **Storage Isolation:** Buckets devem ser privados. O path dos arquivos deve seguir o padrão `org/<organization_id>/<path>`. Validar o acesso via RLS comparando o path com o ID da organização do usuário.

### 2. Hardening de Infraestrutura e Middleware
- **CSP (Content Security Policy):** Implementar middleware que gere um `nonce` único por requisição. Configurar CSP para restringir scripts, estilos e imagens apenas a domínios confiáveis. Bloquear `frame-ancestors 'none'`.
- **Validação de Origin:** Criar helper para validar o cabeçalho `Origin` (ou `Referer`) contra uma allowlist (`ALLOWED_ORIGINS`). Aplicar em todas as API Routes que realizam mutações (POST/PATCH/DELETE).

### 3. Rate Limiting DB-First (Escalável)
- **Postgres Primitives:** Criar tabela `security_rate_limits` e função `consume_security_rate_limit` (PL/pgSQL) para gerenciar janelas de tempo e bloqueios (`blocked_until`) de forma atômica no banco.
- **Camada de API:** Implementar rate limiting duplo em rotas críticas: um por IP e outro por UserID. Retornar status `429` com o cabeçalho `Retry-After`.

### 4. Upload Hardening Avançado
- **Magic Bytes Validation:** Validar a assinatura binária real do arquivo (PDF, PNG, JPG, WEBP) lendo o `ArrayBuffer`, ignorando a extensão declarada.
- **Anti-malware Heuristics:** Bloquear uploads se:
    - Conter assinatura EICAR.
    - Conter cabeçalho executável Windows (`MZ`).
    - Possuir extensões duplas perigosas (ex: `.jpg.exe`).

### 5. MFA e Gestão de Sessoes
- **AAL Step-up Auth:** Middleware deve identificar o nível de autenticação (`aal1` vs `aal2`). Exigir step-up para `aal2` em rotas administrativas se o MFA estiver habilitado.
- **Session Revocation:** Implementar funcionalidade para revogar outras sessões ativas do usuário via `auth.admin.signOut`.

### 6. Auditoria e Observabilidade
- **Audit Logging:** Sistema de logs padronizado gravando `user_id`, `action`, `entity_type`, `entity_id` e `delta` de alterações.
- **API Error Contract:** Todas as respostas de erro devem conter um `request_id`, um `code` estável e redação automática de dados sensíveis em logs.

---

## 📝 Como usar este prompt
> "Ajuste o projeto atual para seguir os padrões de segurança descritos no arquivo `security-architecture-prompt.md`, começando pela implementação do [ITEM ESPECÍFICO]."
