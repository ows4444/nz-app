## 1. Identity & Access Management (`iam-service`)

### APIs

#### Auth & Versioning

- [x] `GET /v1/health` — service up-check
- [ ] `GET /v1/ready` — dependencies’ readiness
- [ ] **Circuit Breaker Status** — include downstream dependencies’ health status

#### User Registration & Authentication

- [x] `POST /v1/auth/register` — supports **email** and **username** registrations
- [ ] `POST /v1/auth/register/verify-email` — verify email during registration
- [ ] `POST /v1/auth/register/verify-phone` — verify phone number during registration
- [ ] `POST /v1/auth/login/email` — supports multi-factor authentication (SMS, TOTP, hardware keys)
- [ ] `POST /v1/auth/login/username` — optional SMS/OTP factor and risk-based step-up
- [ ] `POST /v1/auth/logout` — blacklist tokens and notify audit stream
- [ ] `POST /v1/auth/password-reset` — email and SMS flows with rate limiting and CAPTCHA
- [ ] `POST /v1/auth/password-reset/verify` — token validation and device fingerprinting
- [ ] **Token Response** includes a `client_id` claim in the JWT and JSON payload
- [ ] **Idempotency Keys** on register/login endpoints

#### Session & Token Management

- [ ] `GET /v1/auth/sessions` — lists active sessions; filters by device and region
- [ ] `DELETE /v1/auth/sessions/:sessionId` — revokes a specific session and associated tokens
- [ ] **Rate Limiting**: 100 requests/min per IP, with dynamic backoff on bursts
- [ ] **Token Rotation**: supports rotating refresh tokens

### OAuth2.1 & OIDC

#### Authorization

- [ ] `GET /v1/oauth/authorize`
  - Query params: `response_type`, `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge` (PKCE)
  - Returns an authorization code or prompts for user consent
- [ ] `POST /v1/oauth/authorize/consent`
  - Body: `{ consented_scopes: [], user_decision: "approve" \|"deny", session_state: "" }`
  - Records the grant in the audit trail
- [ ] **Consent Revocation**: `DELETE /v1/oauth/consent/:consentId`

#### Token Lifecycle

- [ ] `POST /v1/oauth/token`
  - Grant types: `authorization_code`, `client_credentials`, `refresh_token`, `password`, `urn:ietf:params:oauth:grant-type:device_code` (device flow), with PKCE support
  - Accepts form-encoded or JSON payloads
  - Returns JWT or opaque tokens with `access_token`, `refresh_token`, and `expires_in`
- [ ] `POST /v1/oauth/revoke` — token revocation for access and refresh tokens, triggers secret cleanup
- [ ] `POST /v1/oauth/introspect` — validates a token; returns `active` state, `client_id`, `username`, `scope`, `exp`

#### Discovery & JWKS

- [ ] `GET /v1/oauth/jwks` — rotating key set and caching headers
- [ ] `GET /v1/oauth/.well-known/openid-configuration` — metadata and supported claims

#### Userinfo

- [ ] `GET /v1/userinfo` — supports JSON and JWT responses, with SCIM v2 compatibility
- [ ] `PATCH /v1/userinfo` — partial profile updates and schema validation

#### OAuth Client Management

- [ ] `POST /v1/oauth/clients`
  - Registers new OAuth2 client applications
  - Accepts: `client_name`, `redirect_uris`, `grant_types`, `response_types`, `token_endpoint_auth_method`, `scopes`, `owner_id`, `metadata`
  - Requires an `Idempotency-Key` header and admin-scoped authorization
  - Returns a `client_id` (and a `client_secret` if confidential), plus full client metadata
- [ ] `PATCH /v1/oauth/clients/:client_id` — updates redirect URIs, scopes, and metadata
- [ ] `DELETE /v1/oauth/clients/:client_id` — soft-deletes or deactivates a client
- [ ] `POST /v1/oauth/clients/:client_id/rotate-secret` — revokes the old secret and issues a new one

### Adaptive Security Hooks

- [ ] **Risk Engine Integration** — calls an external risk API before high-risk flows
- [ ] **Geo-fencing** — blocks or regulates logins from anomalous regions
- [ ] **Behavioral Analytics** — streams login patterns to the SIEM

### User Management

- [ ] `GET /v1/users` — pagination, filtering, sorting; GraphQL support
- [ ] `GET /v1/users/:id` — includes `roles`, `attributes`, and group memberships
- [ ] `POST /v1/users` — supports bulk creation and dry-run mode
- [ ] `PUT /v1/users/:id` — upsert semantics and optimistic locking
- [ ] `PATCH /v1/users/:id` — partial updates and JSON Patch support
- [ ] `DELETE /v1/users/:id` — soft deletes and purges after a retention window
- [ ] **Bulk Operations**
  - [ ] `POST /v1/users/bulk` — import CSV/JSON with a validation report
  - [ ] `DELETE /v1/users/bulk` — bulk removal with transaction rollback on failure
- [ ] **Search**: `GET /v1/users/search` with full-text and fuzzy matching

### Database Schemas

- [x] **Table: `users_credentials`**
  - `user_id` (PK), `password_hash`, `salt`, `algo`, `pepper_version`, `created_at`, `updated_at`
- [ ] **Table: `user_password_history`**
  - `id` (PK), `user_id` (FK), `password_hash`, `salt`, `algo`, `pepper_version`, `created_at`
- [x] **Table: `users_profile`**
  - `user_id` (PK), `first_name`, `last_name`, `username` (unique), `displayName`, `email` (unique), `locale`, `avatar_url`, `status`, `created_at`, `updated_at`
- [ ] **Table: `user_preferences`**
  - `user_id` (FK), `key`, `value`, `updated_at`, `source` (UI/API/bulk)
- [ ] **Table: `user_contacts`**
  - `id` (PK), `user_id` (FK), `type`, `value`, `verified_flag`, `verified_at`, `is_default`
- [ ] **Table: `contact_verifications`**
  - `id` (PK), `contact_id` (FK), `purpose`, `token_hash`, `code`, `expires_at`, `used_flag`, `requested_at`, `used_at`, `ip_address`, `user_agent`, `created_at`, `updated_at`
- [ ] **Table: `password_resets`**
  - `id` (PK), `user_id` (FK), `token`, `requested_at`, `expires_at`, `used_flag`, `ip_address`
- [ ] **Table: `login_attempts`**
  - `id` (PK), `user_id` (FK), `timestamp`, `success_flag`, `ip_address`, `user_agent`, `risk_score`
- [ ] **Table: `oauth_clients`**
  - `client_id` (PK), `secret_hash`, `redirect_uris` (JSON), `grant_types` (enum list), `scopes` (array), `auth_method`, `owner_id`, `created_at`, `revoked_flag`, `trust_level`
- [ ] **Table: `auth_codes`**
  - `code` (PK), `client_id` (FK), `user_id` (FK), `redirect_uri`, `code_challenge`, `method`, `issued_at`, `expires_at`, `consumed_flag`, `nonce`
- [ ] **Table: `access_tokens`**
  - `token` (PK), `client_id`, `user_id`, `scopes` (array), `issued_at`, `expires_at`, `token_type`, `revoked_flag`, `audience`
- [ ] **Table: `refresh_tokens`**
  - `token` (PK), `client_id`, `user_id`, `issued_at`, `expires_at`, `revoked_flag`, `rotation_count`
- [ ] **Table: `openid_permissions`**
  - `user_id` (FK), `client_id` (FK), `scopes` (array), `granted_at`, `expiration_policy`

---

## 2. OAuth Service (`oauth-service`)

> Dedicated microservice for OAuth2.1-compliant flows, token issuance, introspection, and key management.

### APIs

#### Authorization Endpoint

- [ ] `GET /authorize`
  - Accepts query parameters: `response_type`, `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge` (with PKCE enforcement)
  - Returns an authorization code or prompts the user for consent
- [ ] `POST /authorize/consent`
  - Body: `{ consented_scopes: [], user_decision: "approve" \|"deny", session_state: "" }`
  - Records consent in the audit trail
- [ ] `OPTIONS /authorize` — CORS preflight
- [ ] **WebFinger**: `GET /.well-known/webfinger`

#### Token Endpoint

- [ ] `POST /token`
  - Grant types: `authorization_code`, `client_credentials`, `refresh_token`, `password`, PKCE; supports form-encoded and JSON payloads
- [ ] `PATCH /token` — updates token metadata, e.g., extends expiry
- [ ] **Token Exchange**: `POST /token/exchange`

#### Revocation & Introspection

- [ ] `POST /revoke` — conforms to RFC 7009; purges related sessions
- [ ] `POST /introspect` — conforms to RFC 7662; returns `active`, `scope`, `client_id`, `username`, `token_type`, `exp`, `token_usage`

#### JWKS & Key Management

- [ ] `GET /.well-known/jwks.json` — includes `kid`, `kty`, `alg`, `use`, `n`, `e`
- [ ] `POST /keys` — rotates/adds keys; request body: `public_key`, `algorithm`, `usage`, `activation_date`
- [ ] `DELETE /keys/:keyId` — deactivates a key and archives old key material
- [ ] **Key Versioning**: maintain a history table

#### Discovery & Metadata

- [ ] `GET /.well-known/openid-configuration` — endpoints, capabilities, supported scopes, auth methods
- [ ] **API Discovery**: GraphQL introspection endpoint

#### Userinfo Endpoint

- [ ] `GET /userinfo` — scopes: `openid`, `profile`, `email`, `phone`; supports signed JWT
- [ ] `PATCH /userinfo` — partial updates with SCIM v2 patch support

### Advanced Flows

- [ ] **Device Flow**: `/device_authorize` + `/token` grant type `device_code`
- [ ] **CIBA (Back-Channel)**: `/ciba/authenticate`, `/ciba/authorize`

### Database Schemas

- [ ] **Table: `oauth_clients`**
  - `client_id` (PK), `secret_hash`, `redirect_uris` (JSON), `grant_types`, `scopes`, `auth_method`, `owner`, `created_at`, `updated_at`, `revoked_flag`, `client_metadata` (JSON)
- [ ] **Table: `auth_codes`**
  - `code` (PK), `client_id` (FK), `user_id` (FK), `redirect_uri`, `challenge`, `method`, `issued_at`, `expires_at`, `consumed_flag`, `nonce`
- [ ] **Table: `access_tokens`**
  - `token` (PK), `client_id`, `user_id`, `scopes` (array), `issued_at`, `expires_at`, `type`, `revoked_flag`, `audience`
- [ ] **Table: `refresh_tokens`**
  - `token` (PK), `client_id`, `user_id`, `issued_at`, `expires_at`, `revoked_flag`, `rotation_count`
- [ ] **Table: `revocation_logs`**
  - `id` (PK), `token`, `client_id`, `user_id`, `reason`, `revoked_at`, `ip_address`
- [ ] **Table: `jwks`**
  - `key_id` (PK), `public_key`, `private_key_encrypted`, `algorithm`, `use`, `created_at`, `expires_at`, `status`, `rotation_policy`
- [ ] **Table: `openid_scopes`**
  - `scope` (PK), `description`, `default_flag`, `deprecated_flag`, `metadata` (JSON)
- [ ] **Table: `client_grant_types`**
  - `client_id`, `grant_type`, `added_at`
- [ ] **Table: `pkce_challenges`**
  - `code` (PK), `challenge`, `method`, `issued_at`
- [ ] **Table: `device_codes`**
  - `device_code` (PK), `user_code`, `client_id`, `scope`, `issued_at`, `expires_at`, `status`
- [ ] **Table: `ciba_requests`**
  - `auth_req_id` (PK), `client_id`, `login_hint`, `scope`, `binding_message`, `expires_at`, `status`

---

## 3. Authorization Core (`authz-core`)

### APIs

#### RBAC

- [ ] `GET /roles` — pagination, search, hierarchical roles
- [ ] `POST /roles` — assign default permissions, role templates
- [ ] `PUT /roles/:roleId` — full update with version control
- [ ] `PATCH /roles/:roleId` — partial update
- [ ] `DELETE /roles/:roleId` — cascade or restrict; soft delete
- [ ] `GET /permissions` — filter by domain/resource; tag support
- [ ] `POST /permissions` — bulk import
- [ ] `PUT /permissions/:permId` — update permission
- [ ] `DELETE /permissions/:permId` — delete permission
- [ ] `POST /roles/:roleId/permissions` — bulk assign permissions
- [ ] `DELETE /roles/:roleId/permissions/:permId` — remove a permission
- [ ] `GET /users/:userId/roles` — list roles for a user
- [ ] `POST /users/:userId/roles` — assign multiple `role_id`s
- [ ] `DELETE /users/:userId/roles/:roleId` — remove a role from a user
- [ ] `GET /roles/:roleId/users` — list users for a role
- [ ] **Role Hierarchies**: `GET /roles/:roleId/ancestors`

#### ABAC

- [ ] `GET /attributes` — list attributes
- [ ] `POST /attributes` — create an attribute
- [ ] `PUT /attributes/:attrId` — update an attribute
- [ ] `DELETE /attributes/:attrId` — delete an attribute
- [ ] `GET /resources/:resourceId/attributes` — list resource attributes
- [ ] `POST /resources/:resourceId/attributes` — assign attributes to a resource
- [ ] `DELETE /resources/:resourceId/attributes/:attrId` — remove an attribute from a resource

#### PBAC & Contextual Policies

- [ ] `GET /policies` — version filter; tag support; environment filter
- [ ] `POST /policies` — validate syntax and test rollout
- [ ] `PUT /policies/:policyId` — full policy update
- [ ] `DELETE /policies/:policyId` — delete a policy
- [ ] `GET /policies/:policyId/metadata` — retrieve policy metadata
- [ ] `GET /policies/:policyId/history` — audit trail

#### PDP Engine

- [ ] `POST /pdp/evaluate` — input: subject, resource, action, context, environment
- [ ] `POST /pdp/batch-evaluate` — bulk evaluation with parallelization
- [ ] `GET /pdp/policies` — list loaded policies
- [ ] **Explainable Decisions**: `POST /pdp/explain`

#### PEP Guard

- [ ] `POST /pep/enforce` — returns allow/deny, obligations, advice
- [ ] `GET /pep/metrics` — enforcement count, average latency, error rate
- [ ] `POST /pep/audit` — pushes every enforcement event to the audit-service

### Database Schemas

- [ ] **Table: `roles`**
  - `role_id` (PK), `name` (unique), `description`, `parent_id`, `version`, `created_at`, `updated_at`
- [ ] **Table: `permissions`**
  - `perm_id` (PK), `name` (unique), `description`, `resource`, `action`, `tags`, `created_at`, `updated_at`
- [ ] **Table: `role_permissions`**
  - `role_id` (FK), `perm_id` (FK), `granted_at`, `granted_by`
- [ ] **Table: `user_roles`**
  - `user_id` (FK), `role_id` (FK), `assigned_at`, `assigned_by`
- [ ] **Table: `attributes`**
  - `attr_id` (PK), `name` (unique), `description`, `data_type`, `created_at`
- [ ] **Table: `attribute_values`**
  - `value_id` (PK), `attr_id` (FK), `value`, `created_at`
- [ ] **Table: `subject_attributes`**
  - `subject_type`, `subject_id`, `attr_id` (FK), `value_id` (FK), `assigned_at`
- [ ] **Table: `resource_attributes`**
  - `resource_type`, `resource_id`, `attr_id` (FK), `value_id` (FK), `assigned_at`
- [ ] **Table: `policies`**
  - `policy_id` (PK), `name`, `definition` (JSON/YAML), `version`, `status`, `environment`, `created_at`, `updated_at`
- [ ] **Table: `policy_metadata`**
  - `policy_id` (FK), `owner`, `tags` (JSON), `created_at`, `updated_at`
- [ ] **Table: `pdp_cache`**
  - `policy_id` (FK), `compiled_rules` (BLOB), `last_loaded`
- [ ] **Table: `decision_logs`**
  - `request_id` (PK), `policy_id` (FK), `decision`, `evaluated_at`, `latency_ms`, `trace_id`
- [ ] **Table: `pep_logs`**
  - `pep_id` (PK), `request_id` (FK), `enforcement_time`, `outcome`, `policy_version`

---

## 4. Access Models (`access-models`)

### APIs

#### ACL Service

- [ ] `GET /acl/entries` — filter by resource/user/group; pagination; sorting
- [ ] `POST /acl/entries` — idempotent; deduplicates by composite key
- [ ] `PUT /acl/entries/:entryId` — updates an ACL entry
- [ ] `DELETE /acl/entries/:entryId` — deletes an ACL entry
- [ ] `GET /acl/resources/:resourceId` — retrieves ACL entries for a resource
- [ ] `PATCH /acl/entries/:entryId` — partially updates an ACL entry

#### MAC Service

- [ ] `GET /labels` — hierarchical view; RBAC integration
- [ ] `POST /labels` — parent_label_id optional; attaches policies
- [ ] `PUT /labels/:labelId` — updates a label
- [ ] `DELETE /labels/:labelId` — cascades children or reassigns them

#### GBAC Service

- [ ] `GET /graph/nodes` — filter by type, depth, attributes
- [ ] `POST /graph/nodes` — supports batch operations with transactions
- [ ] `PUT /graph/nodes/:nodeId` — updates a graph node
- [ ] `DELETE /graph/nodes/:nodeId` — deletes a graph node
- [ ] `GET /graph/edges` — list graph edges
- [ ] `POST /graph/edges` — creates a new graph edge
- [ ] `DELETE /graph/edges/:edgeId` — deletes a graph edge
- [ ] **Graph Queries**: `POST /graph/query` — custom DSL for queries

### Database Schemas

- [ ] **Table: `acl_entries`**
  - `entry_id` (PK), `user_or_group`, `resource_type`, `resource_id`, `permissions` (array), `created_at`, `updated_at`
- [ ] **Table: `acl_logs`**
  - `log_id` (PK), `entry_id` (FK), `change_type`, `changed_by`, `changed_at`
- [ ] **Table: `security_labels`**
  - `label_id` (PK), `name` (unique), `level`, `description`, `created_at`
- [ ] **Table: `label_hierarchy`**
  - `parent_label_id` (FK), `child_label_id` (FK)
- [ ] **Table: `object_labels`**
  - `object_type`, `object_id`, `label_id` (FK), `assigned_at`
- [ ] **Table: `graph_nodes`**
  - `node_id` (PK), `type`, `properties` (JSON), `created_at`, `updated_at`
- [ ] **Table: `graph_edges`**
  - `edge_id` (PK), `from_node_id` (FK), `to_node_id` (FK), `relation_type`, `properties` (JSON), `created_at`, `updated_at`

---

## 5. Device & Session Management (`session-service`)

### APIs

#### Device Manager

- [ ] `GET /devices` — filter by user; type; pagination; status
- [ ] `POST /devices` — idempotent; returns existing record if duplicate; attaches metadata
- [ ] `PUT /devices/:deviceId` — updates metadata; verifies device health
- [ ] `DELETE /devices/:deviceId` — revokes a device and cleans up sessions
- [ ] **Upsert on Auth**: invoked internally during register/login to insert or update a device record

#### Session Service

- [ ] `GET /sessions/active` — supports time-window filtering; filter by device
- [ ] `POST /sessions/start` — includes device fingerprint and geolocation
- [ ] `POST /sessions/end` — specify `session_id` or `device_id`
- [ ] `GET /sessions/:sessionId` — includes activity log and session metadata
- [ ] **Session Policies**: maximum concurrent sessions per user/device

### Database Schemas

- [ ] **Table: `devices`**
  - `device_id` (PK), `user_id` (FK), `device_info` (JSON), `created_at`, `last_seen`, `status`, `trust_score`
- [ ] **Table: `device_sessions`**
  - `session_id` (PK), `device_id` (FK), `user_id` (FK), `active_flag`, `ip_address`, `started_at`, `last_seen_at`, `geo_location`
- [ ] **Table: `user_devices`**
  - `user_id` (FK), `device_id` (FK), `is_active` (BOOLEAN NOT NULL DEFAULT FALSE), `linked_at` (TIMESTAMP),
  - PRIMARY KEY(`user_id`, `device_id`),
  - UNIQUE INDEX on (`device_id`) WHERE `is_active` = TRUE
- [ ] **Table: `session_policies`**
  - `policy_id` (PK), `max_sessions`, `inactivity_timeout`, `created_at`

---

## 6. Audit & Logging (`audit-service`)

### APIs

- [ ] `GET /audit/events` — filter by service; type; date range; severity
- [ ] `POST /audit/events` — conforms to Cloud Audit Logging schema and custom fields
- [ ] `GET /logs` — search across streams; supports OpenSearch
- [ ] `GET /logs/search` — full-text and structured search; saved queries
- [ ] `DELETE /logs/:logId` — complies with retention policy
- [ ] `GET /logs/streams` — lists active log streams
- [ ] `GET /audit/alerts` — active and resolved alerts
- [ ] `POST /audit/alerts/:alertId/resolve` — resolves a specific alert

### Database Schemas

- [ ] **Table: `audit_records`**
  - `record_id` (PK), `service_name`, `event_type`, `payload` (JSON), `timestamp`, `correlation_id`, `severity`
- [ ] **Table: `log_streams`**
  - `stream_id` (PK), `name`, `retention_policy_days`, `created_at`
- [ ] **Table: `audit_alerts`**
  - `alert_id` (PK), `record_id` (FK), `alert_type`, `resolved_flag`, `created_at`, `resolved_at`
- [ ] **Table: `audit_configs`**
  - `config_id` (PK), `service_name`, `enabled_events`, `retention_days`

---

## Operational & Cross-Cutting Concerns

- [ ] **API Gateway & Ingress** — global routing, WAF, auth, rate limiting, canary releases
- [ ] **Service Mesh** — Istio/Linkerd for mTLS, traffic shifting, mutual TLS
- [ ] **Distributed Tracing** — OpenTelemetry instrumentation, trace sampling policies
- [ ] **Monitoring & Metrics** — Prometheus exporters, Grafana dashboards, SLO alerts
- [ ] **Logging Standards** — JSON structured logs, correlation IDs, log levels, trace IDs
- [ ] **Rate Limiting** — per-endpoint, per-client, dynamic quotas, graceful degradation
- [ ] **Caching** — TTL caches, cache invalidation hooks, Redis/L3 proxies
- [ ] **Multi-Tenancy** — `tenant_id` in all tables, row-level security, schema isolation
- [ ] **Security** — Zero-trust networking, TLS everywhere, HSTS, CSP headers, OWASP Top 10 mitigations, pen-test schedule
- [ ] **SLA & SLO** — define uptime; latency (P99 ≤ 200 ms); error budgets; burn-rate alerts
- [ ] **CI/CD** — automated unit/integration/end-to-end tests; contract testing (PACT); blue/green and canary deployments
- [ ] **Feature Flags** — LaunchDarkly or open-source toggles; dynamic rollouts; kill switches
- [ ] **Chaos Testing** — Simian Army–style failovers; game days; resilience drills
- [ ] **Disaster Recovery** — multi-region failover; automated failover playbooks
- [ ] **Secret Management** — dynamic secrets via Vault/K8s secrets; key rotation policies
- [ ] **Data Encryption** — at rest (KMS), in transit (TLS 1.3+), field-level encryption where needed
- [ ] **Compliance & Privacy** — GDPR/CCPA data-deletion flows; DPIAs; data classification
- [ ] **Backup & Recovery** — daily snapshots; point-in-time recovery; periodic restore drills
- [ ] **Documentation** — OpenAPI/Swagger for all endpoints; auto-regeneration; versioned; published developer portal
- [ ] **SDKs & Client Libraries** — generate and publish for major languages; version compatibility
- [ ] **Observability** — metric dashboards; distributed tracing; log aggregation; alerting runbooks
- [ ] **Scalability** — auto-scaling policies (HPA/VPA); partitioning; back-pressure handling
- [ ] **Architecture Reviews** — regular reviews; DRIs; RFC process for changes

| Domain                              | Component                      | Service ID        | Primary Data Stores                                                                                                                                              | Description                                                                                          |
| ----------------------------------- | ------------------------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Authentication & Session**        | Authentication                 | `auth-service`    | users_credentials, user_password_history                                                                                                                         | Manages user login, MFA, credential storage, and password history                                    |
|                                     | Session                        | `session-service` | device_sessions, session_policies                                                                                                                                | Handles session lifecycle, device binding, and policy enforcement                                    |
| **OAuth2 / OIDC Provider**          | OIDC Provider                  | `oidc-provider`   | jwks, openid_scopes, pkce_challenges                                                                                                                             | Issues and validates OIDC tokens; supports PKCE                                                      |
|                                     | OAuth                          | `oauth-service`   | oauth_clients, auth_codes, access_tokens, refresh_tokens, revocation_logs, jwks, openid_scopes, client_grant_types, pkce_challenges, device_codes, ciba_requests | Implements OAuth 2.1 flows (CIBA, device flow), token issuance & introspection                       |
| **User & Device Management**        | User Management                | `user-management` | users_profile, user_preferences, user_contacts, contact_verifications, password_resets, login_attempts                                                           | CRUD for profiles, preferences, and contact verification; handles password resets and login attempts |
|                                     | Device Management              | `device-manager`  | devices, user_devices                                                                                                                                            | Registers and trusts devices; handles fingerprinting and idempotent CRUD                             |
| **Roles, Permissions & Attributes** | RBAC                           | `rbac-service`    | roles, permissions, role_permissions, user_roles                                                                                                                 | Defines and manages role hierarchies and permission assignments                                      |
|                                     | ABAC                           | `abac-service`    | attributes, attribute_values, subject_attributes, resource_attributes                                                                                            | Stores attribute definitions and value associations for ABAC                                         |
| **Access Control Policy Engine**    | Policy Administration (PAP)    | `policy-admin`    | policies, policy_metadata                                                                                                                                        | Performs CRUD/versioning of policies; validates syntax and metadata                                  |
|                                     | Policy Decision Point (PDP)    | `pdp-engine`      | pdp_cache, decision_logs                                                                                                                                         | Evaluates policies, including batch/explainable decisions                                            |
|                                     | Policy Enforcement Point (PEP) | `pep-guard`       | pep_logs                                                                                                                                                         | Enforces decisions at runtime and audits enforcement events                                          |
| **ACL & Security Labels**           | Access Control List (ACL)      | `acl-service`     | acl_entries, acl_logs                                                                                                                                            | CRUD for ACLs; offers DSL-based filtering                                                            |
|                                     | Mandatory Access Control (MAC) | `mac-service`     | security_labels, label_hierarchy, object_labels                                                                                                                  | Defines mandatory labels and hierarchies; attaches labels to objects                                 |
| **Graph-Based Access Control**      | Graph-Based Access (GBAC)      | `gbac-service`    | graph_nodes, graph_edges                                                                                                                                         | Maintains graph structures and evaluates relationship-based permissions                              |
| **Auditing & Logging**              | Audit & Logging                | `audit-logging`   | audit_records, log_streams, audit_alerts, audit_configs                                                                                                          | Streams and stores audit events; configures alerts and retention                                     |

| Domain Code Name       | Domain Name                     | Services Code Names                       | Core Data Entities                                                                                                                                               | Functional Overview                                                                                                                                                                    |
| ---------------------- | ------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth-session-core`    | Authentication & Session        | `auth-service`, `session-service`         | users_credentials, user_password_history, device_sessions, session_policies, login_attempts, password_resets                                                     | Orchestrates end-to-end user verification: stores credentials and password history, enforces MFA, manages session lifecycle (device binding, policy enforcement), and revocations.     |
| `oidc-oauth-core`      | OAuth2 / OIDC                   | `oidc-provider`, `oauth-service`          | jwks, openid_scopes, pkce_challenges, oauth_clients, auth_codes, access_tokens, refresh_tokens, revocation_logs, client_grant_types, device_codes, ciba_requests | Centralizes token issuance and validation for OAuth 2.1 and OIDC: manages cryptographic keys (JWKS), scope definitions, PKCE/CIBA/device flows, token introspection, and key rotation. |
| `identity-device-core` | User & Device Management        | `user-management`, `device-manager`       | users_profile, user_preferences, user_contacts, contact_verifications, password_resets, login_attempts, devices, user_devices                                    | Provides CRUD for user profiles, preferences, and contact verification; tracks login attempts and password resets; registers and trusts devices with fingerprinting and idempotency.   |
| `access-model-core`    | Roles, Permissions & Attributes | `rbac-service`, `abac-service`            | roles, permissions, role_permissions, user_roles, attributes, attribute_values, subject_attributes, resource_attributes                                          | Defines a unified RBAC + ABAC framework: models role hierarchies, assigns permissions to roles/users, and maintains attribute definitions/values for dynamic policy evaluation.        |
| `access-policy-engine` | Access Control Policy Engine    | `policy-admin`, `pdp-engine`, `pep-guard` | policies, policy_metadata, pdp_cache, decision_logs, pep_logs                                                                                                    | Manages policy lifecycle—creation, versioning, and syntax validation—evaluates access decisions (batch or explainable), and enforces them at runtime while logging each event.         |
| `access-dsl-core`      | ACL & Security Labels           | `acl-service`, `mac-service`              | acl_entries, acl_logs, security_labels, label_hierarchy, object_labels                                                                                           | Implements ACL logic with a DSL for fine-grained filtering, and Mandatory Access Control by defining/attaching hierarchical security labels to resources.                              |
| `graph-access-core`    | Graph-Based Access Control      | `gbac-service`                            | graph_nodes, graph_edges                                                                                                                                         | Maintains directed graph structures representing entities and relationships; evaluates dynamic, relationship-based permissions across interconnected resources.                        |
| `audit-core`           | Auditing & Logging              | `audit-logging`                           | audit_records, log_streams, audit_alerts, audit_configs                                                                                                          | Streams, stores, and indexes audit events for security and compliance; configures alerting rules, retention policies, and provides full observability of operational activities.       |

| 🧭 Domain Code Name | 🌐 Domain Name                  | 🔧 Services                               | 🗃️ Core Data Entities                                                                                                                                                                  | 📋 Functional Overview                                                                                 |
| ------------------- | ------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `auth-core`         | Authentication & Session Mgmt   | `auth-service`, `session-service`         | `users_credentials`, `user_password_history`, `session_policies`, `device_sessions`, `login_attempts`, `password_resets`                                                               | Handles login, MFA, session lifecycle, credential storage, password history, and policy enforcement.   |
| `oauth-core`        | OAuth2.1 / OpenID Connect       | `oidc-provider`, `oauth-service`          | `jwks`, `openid_scopes`, `pkce_challenges`, `oauth_clients`, `auth_codes`, `access_tokens`, `refresh_tokens`, `revocation_logs`, `client_grant_types`, `device_codes`, `ciba_requests` | Manages token issuance, PKCE/CIBA/device flows, client metadata, and JWKS key management.              |
| `user-core`         | User & Device Management        | `user-management`, `device-manager`       | `users_profile`, `user_preferences`, `user_contacts`, `contact_verifications`, `devices`, `user_devices`                                                                               | Manages user data, preferences, verified contact methods, and registered devices.                      |
| `access-core`       | Roles & Attribute Modeling      | `rbac-service`, `abac-service`            | `roles`, `permissions`, `role_permissions`, `user_roles`, `attributes`, `attribute_values`, `subject_attributes`, `resource_attributes`                                                | Provides hybrid RBAC and ABAC model, linking attributes and role hierarchies to enforce access logic.  |
| `policy-core`       | Policy Evaluation & Enforcement | `policy-admin`, `pdp-engine`, `pep-guard` | `policies`, `policy_metadata`, `pdp_cache`, `decision_logs`, `pep_logs`                                                                                                                | Creates and enforces access policies, logs decisions, supports versioning and explainability.          |
| `acl-core`          | ACLs & Security Labels          | `acl-service`, `mac-service`              | `acl_entries`, `acl_logs`, `security_labels`, `label_hierarchy`, `object_labels`                                                                                                       | Supports DSL-based ACL definitions and mandatory access control using hierarchical labels.             |
| `gbac-core`         | Graph-Based Access Control      | `gbac-service`                            | `graph_nodes`, `graph_edges`                                                                                                                                                           | Uses relationship graphs to dynamically evaluate entity-level permissions.                             |
| `audit-core`        | Auditing & Observability        | `audit-logging`                           | `audit_records`, `log_streams`, `audit_alerts`, `audit_configs`                                                                                                                        | Streams, stores, and indexes security-related events for full operational transparency and compliance. |
