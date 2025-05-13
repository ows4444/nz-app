
## 1. Identity & Access Management (`iam-service`)

### APIs

#### Auth & Versioning

* [ ] **Liveness & Readiness**

  * [ ] `GET /v1/health` — service up check
  * [ ] `GET /v1/ready` — dependencies ready
  * [ ] **Circuit Breaker Status** — include downstream dependencies health
* [ ] **User Registration & Authentication**

  * [ ] `POST /v1/auth/register` — supports email, username, OAuth client registrations
  * [ ] `POST /v1/auth/login/email` — multi-factor support (SMS, TOTP, hardware keys)
  * [ ] `POST /v1/auth/login/username` — optional SMS/OTP factor, risk-based step-up
  * [ ] `POST /v1/auth/logout` — blacklist tokens + notify audit stream
  * [ ] `POST /v1/auth/password-reset` — email & SMS flows with rate-limit & CAPTCHA
  * [ ] `POST /v1/auth/password-reset/verify` — token validation + device fingerprinting
  * [ ] **Token Response** includes `client_id` claim in JWT & JSON payload
  * [ ] **Idempotency Keys** on register/login endpoints
* [ ] **Session & Token Management**

  * [ ] `GET /v1/auth/sessions` — list active sessions, filter by device, region
  * [ ] `DELETE /v1/auth/sessions/:sessionId` — revoke specific session + revoke tokens
  * [ ] **Rate limit**: 100 req/min per IP, dynamic backoff on bursts
  * [ ] **Token Rotation**: support rotating refresh tokens

#### OAuth2.1 & OIDC

* [ ] **Authorization**

  * [ ] `GET /v1/oauth/authorize` — supports PKCE, consent screen parameters, custom claims
  * [ ] `POST /v1/oauth/authorize/consent` — record scopes and grants, store audit trail
  * [ ] **Consent Revocation**: `DELETE /v1/oauth/consent/:consentId`
* [ ] **Token Lifecycle**

  * [ ] `POST /v1/oauth/token` — grant types: auth\_code, client\_credentials, refresh\_token, PKCE; support JWT-structured responses
  * [ ] `POST /v1/oauth/revoke` — token revocation (access & refresh) + dynamic secrets cleanup
  * [ ] `POST /v1/oauth/introspect` — token validation with rate limiting + trace ID for observability
* [ ] **Discovery & JWKS**

  * [ ] `GET /v1/oauth/jwks` — rotating key set + caching headers
  * [ ] `GET /v1/oauth/.well-known/openid-configuration` — metadata + supported claims
* [ ] **Userinfo**

  * [ ] `GET /v1/userinfo` — supports JSON and JWT responses + SCIM v2 compatibility
  * [ ] `PATCH /v1/userinfo` — partial profile updates + schema validation

#### Adaptive Security Hooks

* [ ] **Risk Engine Integration** — call external risk API before high-risk flows
* [ ] **Geo-fencing** — block/regulate logins from anomalous regions
* [ ] **Behavioral Analytics** — stream login patterns to SIEM

#### User Management

* [ ] `GET /v1/users` — pagination, filtering, sorting, GraphQL support
* [ ] `GET /v1/users/:id` — include `roles`, `attributes`, group memberships
* [ ] `POST /v1/users` — bulk create supported + dry-run mode
* [ ] `PUT /v1/users/:id` — upsert semantics + optimistic locking
* [ ] `PATCH /v1/users/:id` — partial update + JSON Patch support
* [ ] `DELETE /v1/users/:id` — soft delete + purge after retention window
* [ ] **Bulk Operations**

  * [ ] `POST /v1/users/bulk` — import CSV/JSON + validation report
  * [ ] `DELETE /v1/users/bulk` — bulk remove + transaction rollback on failure
* [ ] **Search**: `GET /v1/users/search` with full-text, fuzzy matching

### Database Schemas

* [x] **Table: `users_credentials`**

  * id (PK), user\_id (FK), password\_hash, salt, algo, pepper\_version, created\_at, updated\_at
* [ ] **Table: `password_resets`**

  * id (PK), user\_id (FK), token, requested\_at, expires\_at, used\_flag, ip\_address
* [ ] **Table: `login_attempts`**

  * id (PK), user\_id (FK), timestamp, success\_flag, ip\_address, user\_agent, risk\_score
* [ ] **Table: `oauth_clients`**

  * client\_id (PK), secret\_hash, redirect\_uris (JSON), grant\_types (enum list), scopes (array), auth\_method, owner\_id, created\_at, revoked\_flag, trust\_level
* [ ] **Table: `auth_codes`**

  * code (PK), client\_id (FK), user\_id (FK), redirect\_uri, code\_challenge, method, issued\_at, expires\_at, consumed\_flag, nonce
* [ ] **Table: `access_tokens`**

  * token (PK), client\_id, user\_id, scopes (array), issued\_at, expires\_at, token\_type, revoked\_flag, audience
* [ ] **Table: `refresh_tokens`**

  * token (PK), client\_id, user\_id, issued\_at, expires\_at, revoked\_flag, rotation\_count
* [ ] **Table: `openid_permissions`**

  * user\_id (FK), client\_id (FK), scopes (array), granted\_at, expiration\_policy
* [x] **Table: `users_profile`**

  * user\_id (PK), name, email (unique), phone, locale, avatar\_url, metadata (JSON), created\_at, updated\_at
* [ ] **Table: `user_preferences`**

  * user\_id (FK), key, value, updated\_at, source (UI/API/bulk)
* [ ] **Table: `user_contacts`**

  * user\_id (FK), type (enum), value, verified\_flag, verified\_at, verification\_method

---

## 2. OAuth Service (`oauth-service`)

> Dedicated microservice for OAuth2.1-compliant flows, token issuance, introspection, and key management.

### APIs

#### Authorization Endpoint

* [ ] `GET /authorize` — response\_type, client\_id, redirect\_uri, scope, state, code\_challenge + PKCE enforcement
* [ ] `POST /authorize/consent` — body: consented\_scopes, user\_decision, session\_state
* [ ] `OPTIONS /authorize` — CORS preflight
* [ ] **WebFinger**: `GET /.well-known/webfinger`

#### Token Endpoint

* [ ] `POST /token` — grant types: auth\_code, client\_credentials, refresh\_token, password, PKCE; support form & JSON
* [ ] `PATCH /token` — token metadata updates, e.g., extend expiry
* [ ] **Token Exchange**: `POST /token/exchange`

#### Revocation & Introspection

* [ ] `POST /revoke` — conform to RFC 7009 + purge related sessions
* [ ] `POST /introspect` — RFC 7662; returns active, scope, client\_id, username, token\_type, exp, token\_usage

#### JWKS & Key Management

* [ ] `GET /.well-known/jwks.json` — include kid, kty, alg, use, n, e
* [ ] `POST /keys` — rotate/add keys; request: public\_key, algorithm, usage, activation\_date
* [ ] `DELETE /keys/:keyId` — deactivate key + archive old key material
* [ ] **Key Versioning**: maintain history table

#### Discovery & Metadata

* [ ] `GET /.well-known/openid-configuration` — endpoints, capabilities, supported scopes, auth methods
* [ ] **API Discovery**: GraphQL introspection endpoint

#### Userinfo Endpoint

* [ ] `GET /userinfo` — scopes: openid, profile, email, phone; supports signed JWT
* [ ] `PATCH /userinfo` — partial updates, SCIM v2 patch support

### Advanced Flows

* [ ] **Device Flow**: `/device_authorize` + `/token` grant=device\_code
* [ ] **CIBA (Back-Channel)**: `/ciba/authenticate`, `/ciba/authorize`

### Database Schemas

* [ ] `oauth_clients` (client\_id PK, secret\_hash, redirect\_uris JSON, grant\_types, scopes, auth\_method, owner, created\_at, updated\_at, revoked\_flag, client\_metadata JSON)
* [ ] `auth_codes` (code PK, client\_id FK, user\_id FK, redirect\_uri, challenge, method, issued\_at, expires\_at, consumed\_flag, nonce)
* [ ] `access_tokens` (token PK, client\_id, user\_id, scopes array, issued\_at, expires\_at, type, revoked\_flag, audience)
* [ ] `refresh_tokens` (token PK, client\_id, user\_id, issued\_at, expires\_at, revoked\_flag, rotation\_count)
* [ ] `revocation_logs` (id PK, token, client\_id, user\_id, reason, revoked\_at, ip\_address)
* [ ] `jwks` (key\_id PK, public\_key, private\_key\_encrypted, algorithm, use, created\_at, expires\_at, status, rotation\_policy)
* [ ] `openid_scopes` (scope PK, description, default\_flag, deprecated\_flag, metadata JSON)
* [ ] `client_grant_types` (client\_id, grant\_type, added\_at)
* [ ] `pkce_challenges` (code PK, challenge, method, issued\_at)
* [ ] `device_codes` (device\_code PK, user\_code, client\_id, scope, issued\_at, expires\_at, status)
* [ ] `ciba_requests` (auth\_req\_id PK, client\_id, login\_hint, scope, binding\_message, expires\_at, status)

---

## 3. Authorization Core (`authz-core`)

### APIs

#### RBAC

* [ ] `GET /roles` — pagination, search, hierarchical roles
* [ ] `POST /roles` — assign default permissions, role templates
* [ ] `PUT /roles/:roleId` — full update, version control
* [ ] `PATCH /roles/:roleId` — partial update
* [ ] `DELETE /roles/:roleId` — cascade or restrict, soft-delete
* [ ] `GET /permissions` — filter by domain/resource, tag support
* [ ] `POST /permissions` — bulk import
* [ ] `PUT /permissions/:permId`
* [ ] `DELETE /permissions/:permId`
* [ ] `POST /roles/:roleId/permissions` — bulk assign
* [ ] `DELETE /roles/:roleId/permissions/:permId`
* [ ] `GET /users/:userId/roles`
* [ ] `POST /users/:userId/roles` — support multiple role\_ids
* [ ] `DELETE /users/:userId/roles/:roleId`
* [ ] `GET /roles/:roleId/users`
* [ ] **Role Hierarchies**: `GET /roles/:roleId/ancestors`

#### ABAC

* [ ] `GET /attributes`
* [ ] `POST /attributes`
* [ ] `PUT /attributes/:attrId`
* [ ] `DELETE /attributes/:attrId`
* [ ] `GET /resources/:resourceId/attributes`
* [ ] `POST /resources/:resourceId/attributes`
* [ ] `DELETE /resources/:resourceId/attributes/:attrId`

#### PBAC & Contextual Policies

* [ ] `GET /policies` — version filter, tag support, environment
* [ ] `POST /policies` — validate syntax, test rollout
* [ ] `PUT /policies/:policyId`
* [ ] `DELETE /policies/:policyId`
* [ ] `GET /policies/:policyId/metadata`
* [ ] `GET /policies/:policyId/history` — audit trail

#### PDP Engine

* [ ] `POST /pdp/evaluate` — input: subject, resource, action, context, environment
* [ ] `POST /pdp/batch-evaluate` — bulk eval with parallelization
* [ ] `GET /pdp/policies`
* [ ] **Explainable Decisions**: `POST /pdp/explain`

#### PEP Guard

* [ ] `POST /pep/enforce` — returns allow/deny, obligations, advice
* [ ] `GET /pep/metrics` — enforcement count, avg latency, error rate
* [ ] `POST /pep/audit` — push every enforcement to audit-service

### Database Schemas

* [ ] `roles` (role\_id PK, name unique, description, parent\_id, version, created\_at, updated\_at)
* [ ] `permissions` (perm\_id PK, name unique, description, resource, action, tags, created\_at, updated\_at)
* [ ] `role_permissions` (role\_id FK, perm\_id FK, granted\_at, granted\_by)
* [ ] `user_roles` (user\_id, role\_id, assigned\_at, assigned\_by)
* [ ] `attributes` (attr\_id PK, name unique, description, data\_type, created\_at)
* [ ] `attribute_values` (value\_id PK, attr\_id FK, value, created\_at)
* [ ] `subject_attributes` (subject\_type, subject\_id, attr\_id, value\_id, assigned\_at)
* [ ] `resource_attributes` (resource\_type, resource\_id, attr\_id, value\_id, assigned\_at)
* [ ] `policies` (policy\_id PK, name, definition JSON/YAML, version, status, environment, created\_at, updated\_at)
* [ ] `policy_metadata` (policy\_id FK, owner, tags JSON, created\_at, updated\_at)
* [ ] `pdp_cache` (policy\_id FK, compiled\_rules blob, last\_loaded)
* [ ] `decision_logs` (request\_id PK, policy\_id, decision, evaluated\_at, latency\_ms, trace\_id)
* [ ] `pep_logs` (pep\_id PK, request\_id, enforcement\_time, outcome, policy\_version)

---

## 4. Access Models (`access-models`)

### APIs

#### ACL Service

* [ ] `GET /acl/entries` — filter by resource/user/group, pagination, sorting
* [ ] `POST /acl/entries` — idempotent, dedupe by composite key
* [ ] `PUT /acl/entries/:entryId`
* [ ] `DELETE /acl/entries/:entryId`
* [ ] `GET /acl/resources/:resourceId`
* [ ] `PATCH /acl/entries/:entryId`

#### MAC Service

* [ ] `GET /labels` — hierarchical view, RBAC integration
* [ ] `POST /labels` — parent\_label\_id optional, policy attach
* [ ] `PUT /labels/:labelId`
* [ ] `DELETE /labels/:labelId` — cascade children or reassign

#### GBAC Service

* [ ] `GET /graph/nodes` — filter by type, depth, attributes
* [ ] `POST /graph/nodes` — support batch, transactional
* [ ] `PUT /graph/nodes/:nodeId`
* [ ] `DELETE /graph/nodes/:nodeId`
* [ ] `GET /graph/edges`
* [ ] `POST /graph/edges`
* [ ] `DELETE /graph/edges/:edgeId`
* [ ] **Graph Queries**: `/graph/query` with custom DSL

### Database Schemas

* [ ] `acl_entries` (entry\_id PK, user\_or\_group, resource\_type, resource\_id, permissions array, created\_at, updated\_at)
* [ ] `acl_logs` (log\_id PK, entry\_id, change\_type, changed\_by, changed\_at)
* [ ] `security_labels` (label\_id PK, name unique, level, description, created\_at)
* [ ] `label_hierarchy` (parent\_label\_id FK, child\_label\_id FK)
* [ ] `object_labels` (object\_type, object\_id, label\_id, assigned\_at)
* [ ] `graph_nodes` (node\_id PK, type, properties JSON, created\_at, updated\_at)
* [ ] `graph_edges` (edge\_id PK, from\_node FK, to\_node FK, relation\_type, properties JSON, created\_at)

---

## 5. Device & Session Management (`session-service`)

### APIs

#### Device Manager

* [ ] `GET /devices` — filter by user, type, pagination, status
* [ ] `POST /devices` — idempotent, return existing if duplicate, attach metadata
* [ ] `PUT /devices/:deviceId` — update metadata, verify device health
* [ ] `DELETE /devices/:deviceId` — revoke device + cleanup sessions

#### Session Service

* [ ] `GET /sessions/active` — supports time window filter, by device
* [ ] `POST /sessions/start` — include device fingerprint, geolocation
* [ ] `POST /sessions/end` — specify session\_id or device\_id
* [ ] `GET /sessions/:sessionId` — include activity log, session metadata
* [ ] **Session Policies**: max concurrent sessions per user/device

### Database Schemas

* [ ] `devices` (device\_id PK, user\_id FK, device\_info JSON, created\_at, last\_seen, status, trust\_score)
* [ ] `device_sessions` (session\_id PK, device\_id FK, user\_id FK, active\_flag, ip\_address, started\_at, last\_seen\_at, geo\_location)
* [ ] **Table: `session_policies`** (policy\_id PK, max\_sessions, inactivity\_timeout, created\_at)

---

## 6. Audit & Logging (`audit-service`)

### APIs

* [ ] `GET /audit/events` — filter by service, type, date range, severity
* [ ] `POST /audit/events` — conforms to Cloud Audit Logging schema + custom fields
* [ ] `GET /logs` — search across streams, support OpenSearch
* [ ] `GET /logs/search` — full-text & structured search, saved queries
* [ ] `DELETE /logs/:logId` — comply with retention
* [ ] `GET /logs/streams` — list active log streams
* [ ] `GET /audit/alerts` — active & resolved alerts
* [ ] `POST /audit/alerts/:alertId/resolve`

### Database Schemas

* [ ] `audit_records` (record\_id PK, service\_name, event\_type, payload JSON, timestamp, correlation\_id, severity)
* [ ] `log_streams` (stream\_id PK, name, retention\_policy\_days, created\_at)
* [ ] `audit_alerts` (alert\_id PK, record\_id FK, alert\_type, resolved\_flag, created\_at, resolved\_at)
* [ ] **Table: `audit_configs`** (config\_id PK, service\_name, enabled\_events, retention\_days)

---

## Operational & Cross-Cutting Concerns

* [ ] **API Gateway & Ingress** — global routing, WAF, auth, rate limiting, canary releases
* [ ] **Service Mesh** — Istio/Linkerd for mTLS, traffic shifting, mutual TLS
* [ ] **Distributed Tracing** — OpenTelemetry instrumentation, trace sampling policies
* [ ] **Monitoring & Metrics** — Prometheus exporters, Grafana dashboards, SLO alerts
* [ ] **Logging Standards** — JSON structured logs, correlation IDs, log levels, trace IDs
* [ ] **Rate Limiting** — per-endpoint, per-client, dynamic quotas, graceful degradation
* [ ] **Caching** — TTL caches, cache invalidation hooks, Redis/L3 proxies
* [ ] **Multi-Tenancy** — tenant\_id in all tables, row-level security, schema isolation
* [ ] **Security** — Zero-trust networking, TLS everywhere, HSTS, CSP headers, OWASP Top 10 mitigations, pen-test schedule
* [ ] **SLA & SLO** — define uptime, latency (P99 ≤ 200ms), error budgets, burn rate alerts
* [ ] **CI/CD** — automated unit/integration/e2e tests, contract testing (PACT), blue/green & canary deploys
* [ ] **Feature Flags** — LaunchDarkly or open-source toggles, dynamic rollouts, kill switches
* [ ] **Chaos Testing** — Simian Army style failovers, game days, resilience drills
* [ ] **Disaster Recovery** — multi-region failover, automated failover playbooks
* [ ] **Secret Management** — dynamic secrets via Vault/K8s secrets, key rotation policies
* [ ] **Data Encryption** — at rest (KMS), in transit (TLS 1.3+), field-level encryption where needed
* [ ] **Compliance & Privacy** — GDPR/CCPA data deletion flows, DPIAs, data classification
* [ ] **Backup & Recovery** — daily snapshots, point-in-time recovery, periodic restore drills
* [ ] **Documentation** — OpenAPI/Swagger for all endpoints, auto-regen, versioned, published developer portal
* [ ] **SDKs & Client Libraries** — generate & publish for major languages, version compatibility
* [ ] **Observability** — metric dashboards, distributed tracing, log aggregation, alerting runbooks
* [ ] **Scalability** — auto-scaling policies (HPA/VPA), partitioning, back-pressure handling
* [ ] **Architecture Reviews** — regular reviews, DRIs, RFC process for changes

| Service                             | Code Name         | Notes                                           |
| ----------------------------------- | ----------------- | ----------------------------------------------- |
| Authentication Service              | `auth-service`    | Login, MFA, risk engine, session revocation     |
| OAuth2/OIDC Provider Service        | `oidc-provider`   | Tokens, discovery, PKCE, CIBA, device flow      |
| Dedicated OAuth Service             | `oauth-service`   | OAuth2.1, introspection, JWKS, key rotation     |
| User Management Service             | `user-management` | CRUD, bulk, GraphQL, SCIM                       |
| Role & Permission Service (RBAC)    | `rbac-service`    | RBAC CRUD, hierarchies, templates               |
| Attribute Service (ABAC)            | `abac-service`    | ABAC attributes, values, associations           |
| Policy Administration Service (PAP) | `policy-admin`    | Versioned policies, syntax validation, metadata |
| Policy Decision Point (PDP)         | `pdp-engine`      | Eval, batch, explainable decisions, cache       |
| Policy Enforcement Point (PEP)      | `pep-guard`       | Enforcement, metrics, auditing                  |
| Access Control List Service (ACL)   | `acl-service`     | CRUD, filters, DSL                              |
| Security Labeling Service (MAC)     | `mac-service`     | Labels, hierarchies, policy attach              |
| Graph Enforcement Service (GBAC)    | `gbac-service`    | Graph-based checks, query DSL                   |
| Device Management Service           | `device-manager`  | Idempotent CRUD, device trust, fingerprinting   |
| Session & Token Service             | `session-service` | Sessions, policies, device binding              |
| Audit & Logging Service             | `audit-logging`   | Structured logs, streams, alerts                |

| Context                          | Combined Services                                                         | Suggested Code Name | Database Name      |
| -------------------------------- | ------------------------------------------------------------------------- | ------------------- | ------------------ |
| **Identity & Access Management** | `auth-service`, `user-management`                                         | `iam-service`       | `iam_db`           |
| **OAuth Service**                | `oauth-service`, `oidc-provider`                                          | `oauth-context`     | `oauth_db`         |
| **Authorization Core**           | `rbac-service`, `abac-service`, `policy-admin`, `pdp-engine`, `pep-guard` | `authz-core`        | `authz_core_db`    |
| **Access Models**                | `acl-service`, `mac-service`, `gbac-service`                              | `access-models`     | `access_models_db` |
| **Device & Session Management**  | `device-manager`, `session-service`                                       | `session-service`   | `session_db`       |
| **Audit & Logging**              | `audit-logging`                                                           | `audit-service`     | `audit_db`         |
| **Cross-Cutting Platform**       | API Gateway, Service Mesh, Observability, CI/CD, Secrets                  | `platform-infra`    | `infra_config_db`  |

