## 1. Identity & Access Management (`iam-service`)

### APIs

#### Auth & Versioning

- [ ] **Liveness & Readiness**

  - [ ] `GET /v1/health` — service up check
  - [ ] `GET /v1/ready` — dependencies ready
  - [ ] **Circuit Breaker Status** — include downstream dependencies health

- [ ] **User Registration & Authentication**

  - [ ] `POST /v1/auth/register` — supports email, username, OAuth client registrations
  - [ ] `POST /v1/auth/login/email` — multi-factor support (SMS, TOTP, hardware keys)
  - [ ] `POST /v1/auth/login/username` — optional SMS/OTP factor, risk-based step-up
  - [ ] `POST /v1/auth/logout` — blacklist tokens + notify audit stream
  - [ ] `POST /v1/auth/password-reset` — email & SMS flows with rate-limit & CAPTCHA
  - [ ] `POST /v1/auth/password-reset/verify` — token validation + device fingerprinting
  - [ ] **Token Response** includes `client_id` claim in JWT & JSON payload
  - [ ] **Idempotency Keys** on register/login endpoints

- [ ] **Session & Token Management**

  - [ ] `GET /v1/auth/sessions` — list active sessions, filter by device, region
  - [ ] `DELETE /v1/auth/sessions/:sessionId` — revoke specific session + revoke tokens
  - [ ] **Rate limit**: 100 req/min per IP, dynamic backoff on bursts
  - [ ] **Token Rotation**: support rotating refresh tokens

#### OAuth2.1 & OIDC

- [ ] **Authorization**

  - [ ] `GET /v1/oauth/authorize` — supports PKCE, consent screen parameters, custom claims
  - [ ] `POST /v1/oauth/authorize/consent` — record scopes and grants, store audit trail
  - [ ] **Consent Revocation**: `DELETE /v1/oauth/consent/:consentId`

- [ ] **Token Lifecycle**

  - [ ] `POST /v1/oauth/token` — grant types: auth_code, client_credentials, refresh_token, PKCE; support JWT-structured responses
  - [ ] `POST /v1/oauth/revoke` — token revocation (access & refresh) + dynamic secrets cleanup
  - [ ] `POST /v1/oauth/introspect` — token validation with rate limiting + trace ID for observability

- [ ] **Discovery & JWKS**

  - [ ] `GET /v1/oauth/jwks` — rotating key set + caching headers
  - [ ] `GET /v1/oauth/.well-known/openid-configuration` — metadata + supported claims

- [ ] **Userinfo**

  - [ ] `GET /v1/userinfo` — supports JSON and JWT responses + SCIM v2 compatibility
  - [ ] `PATCH /v1/userinfo` — partial profile updates + schema validation

#### Adaptive Security Hooks

- [ ] **Risk Engine Integration** — call external risk API before high-risk flows
- [ ] **Geo-fencing** — block/regulate logins from anomalous regions
- [ ] **Behavioral Analytics** — stream login patterns to SIEM

#### User Management

- [ ] `GET /v1/users` — pagination, filtering, sorting, GraphQL support
- [ ] `GET /v1/users/:id` — include `roles`, `attributes`, group memberships
- [ ] `POST /v1/users` — bulk create supported + dry-run mode
- [ ] `PUT /v1/users/:id` — upsert semantics + optimistic locking
- [ ] `PATCH /v1/users/:id` — partial update + JSON Patch support
- [ ] `DELETE /v1/users/:id` — soft delete + purge after retention window
- [ ] **Bulk Operations**

  - [ ] `POST /v1/users/bulk` — import CSV/JSON + validation report
  - [ ] `DELETE /v1/users/bulk` — bulk remove + transaction rollback on failure

- [ ] **Search**: `GET /v1/users/search` with full-text, fuzzy matching

### Database Schemas

- [x] **Table: `users_credentials`**

  - id (PK), user_id (FK), password_hash, salt, algo, pepper_version, created_at, updated_at

- [ ] **Table: `password_resets`**

  - id (PK), user_id (FK), token, requested_at, expires_at, used_flag, ip_address

- [ ] **Table: `login_attempts`**

  - id (PK), user_id (FK), timestamp, success_flag, ip_address, user_agent, risk_score

- [ ] **Table: `oauth_clients`**

  - client_id (PK), secret_hash, redirect_uris (JSON), grant_types (enum list), scopes (array), auth_method, owner_id, created_at, revoked_flag, trust_level

- [ ] **Table: `auth_codes`**

  - code (PK), client_id (FK), user_id (FK), redirect_uri, code_challenge, method, issued_at, expires_at, consumed_flag, nonce

- [ ] **Table: `access_tokens`**

  - token (PK), client_id, user_id, scopes (array), issued_at, expires_at, token_type, revoked_flag, audience

- [ ] **Table: `refresh_tokens`**

  - token (PK), client_id, user_id, issued_at, expires_at, revoked_flag, rotation_count

- [ ] **Table: `openid_permissions`**

  - user_id (FK), client_id (FK), scopes (array), granted_at, expiration_policy

- [x] **Table: `users_profile`**

  - user_id (PK), name, email (unique), phone, locale, avatar_url, metadata (JSON), created_at, updated_at

- [ ] **Table: `user_preferences`**

  - user_id (FK), key, value, updated_at, source (UI/API/bulk)

- [ ] **Table: `user_contacts`**

  - user_id (FK), type (enum), value, verified_flag, verified_at, verification_method

---

## 2. OAuth Service (`oauth-service`)

> Dedicated microservice for OAuth2.1-compliant flows, token issuance, introspection, and key management.

### APIs

#### Authorization Endpoint

- [ ] `GET /authorize` — response_type, client_id, redirect_uri, scope, state, code_challenge + PKCE enforcement
- [ ] `POST /authorize/consent` — body: consented_scopes, user_decision, session_state
- [ ] `OPTIONS /authorize` — CORS preflight
- [ ] **WebFinger**: `GET /.well-known/webfinger`

#### Token Endpoint

- [ ] `POST /token` — grant types: auth_code, client_credentials, refresh_token, password, PKCE; support form & JSON
- [ ] `PATCH /token` — token metadata updates, e.g., extend expiry
- [ ] **Token Exchange**: `POST /token/exchange`

#### Revocation & Introspection

- [ ] `POST /revoke` — conform to RFC 7009 + purge related sessions
- [ ] `POST /introspect` — RFC 7662; returns active, scope, client_id, username, token_type, exp, token_usage

#### JWKS & Key Management

- [ ] `GET /.well-known/jwks.json` — include kid, kty, alg, use, n, e
- [ ] `POST /keys` — rotate/add keys; request: public_key, algorithm, usage, activation_date
- [ ] `DELETE /keys/:keyId` — deactivate key + archive old key material
- [ ] **Key Versioning**: maintain history table

#### Discovery & Metadata

- [ ] `GET /.well-known/openid-configuration` — endpoints, capabilities, supported scopes, auth methods
- [ ] **API Discovery**: GraphQL introspection endpoint

#### Userinfo Endpoint

- [ ] `GET /userinfo` — scopes: openid, profile, email, phone; supports signed JWT
- [ ] `PATCH /userinfo` — partial updates, SCIM v2 patch support

### Advanced Flows

- [ ] **Device Flow**: `/device_authorize` + `/token` grant=device_code
- [ ] **CIBA (Back-Channel)**: `/ciba/authenticate`, `/ciba/authorize`

### Database Schemas

- [ ] `oauth_clients` (client_id PK, secret_hash, redirect_uris JSON, grant_types, scopes, auth_method, owner, created_at, updated_at, revoked_flag, client_metadata JSON)
- [ ] `auth_codes` (code PK, client_id FK, user_id FK, redirect_uri, challenge, method, issued_at, expires_at, consumed_flag, nonce)
- [ ] `access_tokens` (token PK, client_id, user_id, scopes array, issued_at, expires_at, type, revoked_flag, audience)
- [ ] `refresh_tokens` (token PK, client_id, user_id, issued_at, expires_at, revoked_flag, rotation_count)
- [ ] `revocation_logs` (id PK, token, client_id, user_id, reason, revoked_at, ip_address)
- [ ] `jwks` (key_id PK, public_key, private_key_encrypted, algorithm, use, created_at, expires_at, status, rotation_policy)
- [ ] `openid_scopes` (scope PK, description, default_flag, deprecated_flag, metadata JSON)
- [ ] `client_grant_types` (client_id, grant_type, added_at)
- [ ] `pkce_challenges` (code PK, challenge, method, issued_at)
- [ ] `device_codes` (device_code PK, user_code, client_id, scope, issued_at, expires_at, status)
- [ ] `ciba_requests` (auth_req_id PK, client_id, login_hint, scope, binding_message, expires_at, status)

---

## 3. Authorization Core (`authz-core`)

### APIs

#### RBAC

- [ ] `GET /roles` — pagination, search, hierarchical roles
- [ ] `POST /roles` — assign default permissions, role templates
- [ ] `PUT /roles/:roleId` — full update, version control
- [ ] `PATCH /roles/:roleId` — partial update
- [ ] `DELETE /roles/:roleId` — cascade or restrict, soft-delete
- [ ] `GET /permissions` — filter by domain/resource, tag support
- [ ] `POST /permissions` — bulk import
- [ ] `PUT /permissions/:permId`
- [ ] `DELETE /permissions/:permId`
- [ ] `POST /roles/:roleId/permissions` — bulk assign
- [ ] `DELETE /roles/:roleId/permissions/:permId`
- [ ] `GET /users/:userId/roles`
- [ ] `POST /users/:userId/roles` — support multiple role_ids
- [ ] `DELETE /users/:userId/roles/:roleId`
- [ ] `GET /roles/:roleId/users`
- [ ] **Role Hierarchies**: `GET /roles/:roleId/ancestors`

#### ABAC

- [ ] `GET /attributes`
- [ ] `POST /attributes`
- [ ] `PUT /attributes/:attrId`
- [ ] `DELETE /attributes/:attrId`
- [ ] `GET /resources/:resourceId/attributes`
- [ ] `POST /resources/:resourceId/attributes`
- [ ] `DELETE /resources/:resourceId/attributes/:attrId`

#### PBAC & Contextual Policies

- [ ] `GET /policies` — version filter, tag support, environment
- [ ] `POST /policies` — validate syntax, test rollout
- [ ] `PUT /policies/:policyId`
- [ ] `DELETE /policies/:policyId`
- [ ] `GET /policies/:policyId/metadata`
- [ ] `GET /policies/:policyId/history` — audit trail

#### PDP Engine

- [ ] `POST /pdp/evaluate` — input: subject, resource, action, context, environment
- [ ] `POST /pdp/batch-evaluate` — bulk eval with parallelization
- [ ] `GET /pdp/policies`
- [ ] **Explainable Decisions**: `POST /pdp/explain`

#### PEP Guard

- [ ] `POST /pep/enforce` — returns allow/deny, obligations, advice
- [ ] `GET /pep/metrics` — enforcement count, avg latency, error rate
- [ ] `POST /pep/audit` — push every enforcement to audit-service

### Database Schemas

- [ ] `roles` (role_id PK, name unique, description, parent_id, version, created_at, updated_at)
- [ ] `permissions` (perm_id PK, name unique, description, resource, action, tags, created_at, updated_at)
- [ ] `role_permissions` (role_id FK, perm_id FK, granted_at, granted_by)
- [ ] `user_roles` (user_id, role_id, assigned_at, assigned_by)
- [ ] `attributes` (attr_id PK, name unique, description, data_type, created_at)
- [ ] `attribute_values` (value_id PK, attr_id FK, value, created_at)
- [ ] `subject_attributes` (subject_type, subject_id, attr_id, value_id, assigned_at)
- [ ] `resource_attributes` (resource_type, resource_id, attr_id, value_id, assigned_at)
- [ ] `policies` (policy_id PK, name, definition JSON/YAML, version, status, environment, created_at, updated_at)
- [ ] `policy_metadata` (policy_id FK, owner, tags JSON, created_at, updated_at)
- [ ] `pdp_cache` (policy_id FK, compiled_rules blob, last_loaded)
- [ ] `decision_logs` (request_id PK, policy_id, decision, evaluated_at, latency_ms, trace_id)
- [ ] `pep_logs` (pep_id PK, request_id, enforcement_time, outcome, policy_version)

---

## 4. Access Models (`access-models`)

### APIs

#### ACL Service

- [ ] `GET /acl/entries` — filter by resource/user/group, pagination, sorting
- [ ] `POST /acl/entries` — idempotent, dedupe by composite key
- [ ] `PUT /acl/entries/:entryId`
- [ ] `DELETE /acl/entries/:entryId`
- [ ] `GET /acl/resources/:resourceId`
- [ ] `PATCH /acl/entries/:entryId`

#### MAC Service

- [ ] `GET /labels` — hierarchical view, RBAC integration
- [ ] `POST /labels` — parent_label_id optional, policy attach
- [ ] `PUT /labels/:labelId`
- [ ] `DELETE /labels/:labelId` — cascade children or reassign

#### GBAC Service

- [ ] `GET /graph/nodes` — filter by type, depth, attributes
- [ ] `POST /graph/nodes` — support batch, transactional
- [ ] `PUT /graph/nodes/:nodeId`
- [ ] `DELETE /graph/nodes/:nodeId`
- [ ] `GET /graph/edges`
- [ ] `POST /graph/edges`
- [ ] `DELETE /graph/edges/:edgeId`
- [ ] **Graph Queries**: `/graph/query` with custom DSL

### Database Schemas

- [ ] `acl_entries` (entry_id PK, user_or_group, resource_type, resource_id, permissions array, created_at, updated_at)
- [ ] `acl_logs` (log_id PK, entry_id, change_type, changed_by, changed_at)
- [ ] `security_labels` (label_id PK, name unique, level, description, created_at)
- [ ] `label_hierarchy` (parent_label_id FK, child_label_id FK)
- [ ] `object_labels` (object_type, object_id, label_id, assigned_at)
- [ ] `graph_nodes` (node_id PK, type, properties JSON, created_at, updated_at)
- [ ] `graph_edges` (edge_id PK, from_node FK, to_node FK, relation_type, properties JSON, created_at)

---

## 5. Device & Session Management (`session-service`)

### APIs

#### Device Manager

- [ ] `GET /devices` — filter by user, type, pagination, status
- [ ] `POST /devices` — idempotent, return existing if duplicate, attach metadata
- [ ] `PUT /devices/:deviceId` — update metadata, verify device health
- [ ] `DELETE /devices/:deviceId` — revoke device + cleanup sessions

#### Session Service

- [ ] `GET /sessions/active` — supports time window filter, by device
- [ ] `POST /sessions/start` — include device fingerprint, geolocation
- [ ] `POST /sessions/end` — specify session_id or device_id
- [ ] `GET /sessions/:sessionId` — include activity log, session metadata
- [ ] **Session Policies**: max concurrent sessions per user/device

### Database Schemas

- [ ] `devices` (device_id PK, user_id FK, device_info JSON, created_at, last_seen, status, trust_score)
- [ ] `device_sessions` (session_id PK, device_id FK, user_id FK, active_flag, ip_address, started_at, last_seen_at, geo_location)
- [ ] **Table: `session_policies`** (policy_id PK, max_sessions, inactivity_timeout, created_at)

---

## 6. Audit & Logging (`audit-service`)

### APIs

- [ ] `GET /audit/events` — filter by service, type, date range, severity
- [ ] `POST /audit/events` — conforms to Cloud Audit Logging schema + custom fields
- [ ] `GET /logs` — search across streams, support OpenSearch
- [ ] `GET /logs/search` — full-text & structured search, saved queries
- [ ] `DELETE /logs/:logId` — comply with retention
- [ ] `GET /logs/streams` — list active log streams
- [ ] `GET /audit/alerts` — active & resolved alerts
- [ ] `POST /audit/alerts/:alertId/resolve`

### Database Schemas

- [ ] `audit_records` (record_id PK, service_name, event_type, payload JSON, timestamp, correlation_id, severity)
- [ ] `log_streams` (stream_id PK, name, retention_policy_days, created_at)
- [ ] `audit_alerts` (alert_id PK, record_id FK, alert_type, resolved_flag, created_at, resolved_at)
- [ ] **Table: `audit_configs`** (config_id PK, service_name, enabled_events, retention_days)

---

## Operational & Cross-Cutting Concerns

- [ ] **API Gateway & Ingress** — global routing, WAF, auth, rate limiting, canary releases
- [ ] **Service Mesh** — Istio/Linkerd for mTLS, traffic shifting, mutual TLS
- [ ] **Distributed Tracing** — OpenTelemetry instrumentation, trace sampling policies
- [ ] **Monitoring & Metrics** — Prometheus exporters, Grafana dashboards, SLO alerts
- [ ] **Logging Standards** — JSON structured logs, correlation IDs, log levels, trace IDs
- [ ] **Rate Limiting** — per-endpoint, per-client, dynamic quotas, graceful degradation
- [ ] **Caching** — TTL caches, cache invalidation hooks, Redis/L3 proxies
- [ ] **Multi-Tenancy** — tenant_id in all tables, row-level security, schema isolation
- [ ] **Security** — Zero-trust networking, TLS everywhere, HSTS, CSP headers, OWASP Top 10 mitigations, pen-test schedule
- [ ] **SLA & SLO** — define uptime, latency (P99 ≤ 200ms), error budgets, burn rate alerts
- [ ] **CI/CD** — automated unit/integration/e2e tests, contract testing (PACT), blue/green & canary deploys
- [ ] **Feature Flags** — LaunchDarkly or open-source toggles, dynamic rollouts, kill switches
- [ ] **Chaos Testing** — Simian Army style failovers, game days, resilience drills
- [ ] **Disaster Recovery** — multi-region failover, automated failover playbooks
- [ ] **Secret Management** — dynamic secrets via Vault/K8s secrets, key rotation policies
- [ ] **Data Encryption** — at rest (KMS), in transit (TLS 1.3+), field-level encryption where needed
- [ ] **Compliance & Privacy** — GDPR/CCPA data deletion flows, DPIAs, data classification
- [ ] **Backup & Recovery** — daily snapshots, point-in-time recovery, periodic restore drills
- [ ] **Documentation** — OpenAPI/Swagger for all endpoints, auto-regen, versioned, published developer portal
- [ ] **SDKs & Client Libraries** — generate & publish for major languages, version compatibility
- [ ] **Observability** — metric dashboards, distributed tracing, log aggregation, alerting runbooks
- [ ] **Scalability** — auto-scaling policies (HPA/VPA), partitioning, back-pressure handling
- [ ] **Architecture Reviews** — regular reviews, DRIs, RFC process for changes

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
