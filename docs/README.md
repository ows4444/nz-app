# IAM System - Distributed Database Architecture

## Overview
This document outlines the database schemas for a distributed Identity and Access Management (IAM) system where each service maintains its own database. Services communicate through well-defined APIs and maintain data consistency through event-driven patterns. All tables now include a `tenant_id` (nullable when global) to support subdomain-based tenancy (shared infra) and self-hosted deployments (isolated per-tenant).

---

# 1. Authentication & Session Service (`auth-session-db`)
## Priority: CRITICAL - Core dependency for all other services

### Core User Identity
- [x] **Table: `users` (core user entity)**
  - `user_id` (PK), `email` (UNIQUE, NOT NULL), `username` (UNIQUE, NOT NULL), `first_name`, `last_name`, `display_name`, `avatar_url`, `locale`, `timezone`, `status`, `email_verified_at`, `phone_verified_at`, `mfa_enabled`, `created_at`, `updated_at`, `deleted_at`
  - **Note:** No `tenant_id` here; global identity.

### Authentication Credentials
- [x] **Table: `user_credentials` (passwords, hashes)**
  - `user_id` (PK, FK → `users.user_id`), `password_hash` (NOT NULL), `salt` (NOT NULL), `hash_algo` (NOT NULL), `pepper_version`, `last_password_changed_at`, `password_expires_at`, `created_at`, `updated_at`
  - **Note:** Enforce ON DELETE CASCADE via application logic for `user_id` to remove stale credentials.

- [x] **Table: `user_password_history` (password reuse prevention)**
  - `history_id` (PK), `user_id` (FK → `users.user_id`), `password_hash` (NOT NULL), `salt` (NOT NULL), `hash_algo` (NOT NULL), `pepper_version`, `changed_at` (NOT NULL), `INDEX(user_id, changed_at)`
  - **Note:** Retain only the last N entries per user via a time-based purge job.

- [x] **Table: `password_resets` (recovery tokens)**
  - `reset_id` (PK), `user_id` (FK → `users.user_id`), `token_hash` (UNIQUE, NOT NULL), `token_type` (‘email’, ‘sms’), `requested_at` (NOT NULL), `expires_at` (NOT NULL), `used_flag` (DEFAULT FALSE), `used_at`, `ip_address`, `user_agent`, `attempts_count` (DEFAULT 0), `INDEX(token_hash), INDEX(user_id, expires_at)`
  - **Note:** TTL index on `expires_at` for automatic cleanup.

### Session Management
- [x] **Table: `user_sessions` (active sessions)**
  - `session_id` (PK), `user_id` (FK → `users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `device_fingerprint`, `session_token_hash` (UNIQUE, NOT NULL), `ip_address`, `user_agent`, `started_at` (NOT NULL), `last_activity_at`, `expires_at` (NOT NULL), `terminated_at`, `termination_reason`, `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(user_id, is_active), INDEX(session_token_hash)`
  - **Note:** `tenant_id = NULL` indicates global client session; non-null for tenant-scoped sessions. Soft-delete pattern: set `is_active = FALSE` instead of physical deletion.

- [x] **Table: `session_policies` (timeout, concurrent limits)**
  - `policy_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `max_concurrent_sessions` (INT), `inactivity_timeout_minutes` (INT), `absolute_timeout_hours` (INT), `require_mfa` (BOOLEAN), `allowed_ip_ranges` (JSON), `device_trust_required` (BOOLEAN), `created_at`, `updated_at`, `INDEX(tenant_id, require_mfa)`
  - **Note:** `tenant_id = NULL` for global policy; non-null for tenant-specific policy.

### Authentication Monitoring
- [x] **Table: `login_attempts` (brute force protection)**
  - `attempt_id` (PK), `user_id` (FK → `users.user_id` NULLABLE), `email_attempted`, `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `timestamp` (NOT NULL), `success_flag` (BOOLEAN), `failure_reason`, `ip_address`, `user_agent`, `risk_score` (FLOAT), `location_data` (JSON), `device_fingerprint`, `INDEX(user_id, timestamp), INDEX(ip_address, timestamp)`
  - **Note:** `tenant_id = NULL` for global login attempts; non-null for tenant-scoped.

---

# 2. User Profile & Device Management Service (`user-device-db`)
## Priority: HIGH - Essential for user management and device trust

### User Profiles & Preferences
- [ ] **Table: `user_profiles` (extended user info)**
  - `user_id` (PK; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `first_name`, `last_name`, `display_name`, `locale`, `timezone`, `avatar_url`, `bio`, `status`, `profile_visibility` (‘public’, ‘private’, ‘tenant_only’), `last_login_at`, `created_at`, `updated_at`
  - **Note:** `tenant_id = NULL` for global profile; non-null for tenant-scoped.

- [ ] **Table: `user_preferences` (settings, locale)**
  - `preference_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `category` (NOT NULL), `preference_key` (NOT NULL), `preference_value` (JSON or TEXT, NOT NULL), `data_type` (‘string’, ‘number’, ‘boolean’, ‘json’), `is_encrypted` (BOOLEAN, DEFAULT FALSE), `updated_at`, `UNIQUE(user_id, tenant_id, preference_key)`

### Contact Information
- [ ] **Table: `user_contacts` (email, phone verification)**
  - `contact_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `type` (‘email’, ‘phone’, ‘address’), `label` (‘primary’, ‘work’, ‘home’), `value` (NOT NULL), `verified_flag` (BOOLEAN, DEFAULT FALSE), `verified_at`, `is_primary` (BOOLEAN, DEFAULT FALSE), `country_code`, `created_at`, `updated_at`, `INDEX(user_id, type)`
  - **Note:** Enforce one `is_primary = TRUE` per `(user_id, type)` via partial unique index.

- [ ] **Table: `contact_verifications` (OTP, verification tokens)**
  - `verification_id` (PK), `contact_id` (FK → `user_contacts.contact_id`), `purpose` (‘registration’, ‘password_reset’, ‘mfa’, ‘contact_change’), `token_hash` (UNIQUE, NOT NULL), `code` (encrypted or hashed), `delivery_method` (‘email’, ‘sms’), `expires_at` (NOT NULL), `used_flag` (BOOLEAN, DEFAULT FALSE), `used_at`, `attempts_count` (INT, DEFAULT 0), `max_attempts` (INT, DEFAULT 5), `requested_at` (NOT NULL), `ip_address`, `user_agent`, `INDEX(token_hash), INDEX(contact_id, purpose)`

### Device Management
- [ ] **Table: `devices` (registered devices)**
  - `device_id` (PK), `device_fingerprint` (UNIQUE, NOT NULL), `device_name`, `device_type`, `os_name`, `os_version`, `browser_name`, `browser_version`, `device_info` (JSON), `status` (‘active’, ‘blocked’, ‘unverified’), `trust_score` (INT, 0–100), `risk_level` (‘low’, ‘medium’, ‘high’, ‘critical’), `is_trusted` (BOOLEAN, DEFAULT FALSE), `first_seen`, `last_seen`, `created_at`, `updated_at`, `INDEX(device_fingerprint)`

- [ ] **Table: `device_sessions` (device-specific sessions)**
  - `session_id` (PK), `device_id` (FK → `devices.device_id`), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `active_flag` (BOOLEAN, DEFAULT TRUE), `ip_address`, `started_at` (NOT NULL), `last_seen_at`, `geo_location` (GEOGRAPHY or JSON), `city`, `country`, `session_duration_minutes`, `INDEX(device_id, user_id), INDEX(user_id, active_flag)`

- [ ] **Table: `device_trust_events` (risk assessment)**
  - `event_id` (PK), `device_id` (FK → `devices.device_id`), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `event_type` (‘trusted’, ‘untrusted’, ‘blocked’, ‘flagged’, ‘verified’), `reason`, `created_by` (FK → `auth-session-db.users.user_id`), `created_at`, `metadata_json` (JSON), `INDEX(device_id), INDEX(user_id)`

- [ ] **Table: `device_trust_scores` (risk assessment)**
  - `score_id` (PK), `device_id` (FK → `devices.device_id`), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `trust_score` (INT, 0–100), `risk_level` (‘low’, ‘medium’, ‘high’, ‘critical’), `calculation_method` (VARCHAR), `contributing_factors_json` (JSON), `last_calculated_at`, `expires_at`, `created_at`, `updated_at`, `INDEX(device_id), INDEX(user_id)`

---

# 3. Multi-Factor Authentication Service (`mfa-db`)
## Priority: HIGH - Critical for security, especially in sensitive applications

### MFA Methods
- [ ] **Table: `mfa_methods` (TOTP, SMS, email, WebAuthn)**
  - `method_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `method_type` (‘totp’, ‘sms’, ‘email’, ‘webauthn’, ‘backup_codes’), `method_name`, `secret_encrypted` (NOT NULL for `totp`/`webauthn`), `phone_number`, `email_address`, `webauthn_credential_id`, `backup_codes_hash` (hashed JSON array), `is_verified` (BOOLEAN, DEFAULT FALSE), `is_primary` (BOOLEAN, DEFAULT FALSE), `created_at`, `last_used_at`, `use_count` (INT, DEFAULT 0), `INDEX(user_id, method_type)`

### MFA Challenges
- [ ] **Table: `mfa_challenges` (active challenges)**
  - `challenge_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `method_id` (FK → `mfa_methods.method_id`), `challenge_token` (UNIQUE, NOT NULL), `code_hash` (NOT NULL), `attempts_count` (INT, DEFAULT 0), `max_attempts` (INT, DEFAULT 5), `created_at` (NOT NULL), `expires_at` (NOT NULL), `verified_at`, `ip_address`, `user_agent`, `INDEX(challenge_token), INDEX(user_id, created_at)`

### WebAuthn Support
- [ ] **Table: `webauthn_credentials` (FIDO2/WebAuthn)**
  - `credential_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `credential_public_key` (NOT NULL), `credential_counter` (INT, DEFAULT 0), `aaguid`, `attestation_format`, `transport_methods` (ARRAY), `authenticator_name`, `is_backup_eligible` (BOOLEAN, DEFAULT FALSE), `is_backup_state` (BOOLEAN, DEFAULT FALSE), `created_at`, `last_used_at`, `INDEX(user_id)`

### Backup Codes
- [ ] **Table: `backup_codes` (recovery codes)**
  - `backup_code_id` (PK), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `code_hash` (NOT NULL), `code_salt` (NOT NULL), `is_used` (BOOLEAN, DEFAULT FALSE), `used_at`, `created_at`, `expires_at`, `INDEX(user_id)`

---

# 4. Access Model Service (`rbac-db`)
## Priority: HIGH - Core for role-based access control and permissions

### Role Management
- [ ] **Table: `roles` (role definitions)**
  - `role_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `name` (NOT NULL), `description`, `role_type` (‘system’, ‘tenant’, ‘custom’), `parent_role_id` (NULLABLE; FK → `roles.role_id`), `level` (INT), `is_assignable` (BOOLEAN, DEFAULT TRUE), `version` (INT, DEFAULT 1), `created_at`, `updated_at`, `UNIQUE(tenant_id, name), INDEX(parent_role_id)`

- [ ] **Table: `role_hierarchy` (role inheritance)**
  - `parent_role_id` (NOT NULL; FK → `roles.role_id`), `child_role_id` (NOT NULL; FK → `roles.role_id`), `depth` (INT), `path` (ltree or VARCHAR), `PRIMARY KEY (parent_role_id, child_role_id)`

### Permission System
- [ ] **Table: `permissions` (granular permissions)**
  - `permission_id` (PK), `name` (UNIQUE, NOT NULL), `description`, `resource_type` (NOT NULL), `action` (NOT NULL), `effect` (‘allow’, ‘deny’), `condition_json` (JSON), `tags` (ARRAY or JSON), `is_system_permission` (BOOLEAN, DEFAULT FALSE), `created_at`, `updated_at`, `INDEX(resource_type, action)`

- [ ] **Table: `role_permissions` (role-permission mapping)**
  - `role_id` (NOT NULL; FK → `roles.role_id`), `permission_id` (NOT NULL; FK → `permissions.permission_id`), `effect` (‘allow’, ‘deny’), `condition_json` (JSON), `granted_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `granted_at`, `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `PRIMARY KEY (role_id, permission_id), INDEX(permission_id)`

### User Role Assignments
- [ ] **Table: `user_roles` (user-role assignments)**
  - `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `role_id` (NOT NULL; FK → `roles.role_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `assigned_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `assigned_at`, `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `assignment_reason`, `PRIMARY KEY (user_id, role_id, tenant_id), INDEX(role_id)`

### Attribute System (ABAC)
- [ ] **Table: `attributes` (ABAC attributes)**
  - `attribute_id` (PK), `name` (UNIQUE, NOT NULL), `display_name`, `description`, `data_type` (‘string’, ‘number’, ‘boolean’, ‘json’, ‘date’), `is_array` (BOOLEAN, DEFAULT FALSE), `validation_rules` (JSON), `is_sensitive` (BOOLEAN, DEFAULT FALSE), `created_at`, `updated_at`

- [ ] **Table: `attribute_values` (attribute instances)**
  - `value_id` (PK), `attribute_id` (NOT NULL; FK → `attributes.attribute_id`), `value_string`, `value_number`, `value_boolean`, `value_date`, `value_json`, `value_hash`, `is_encrypted` (BOOLEAN, DEFAULT FALSE), `created_at`, `INDEX(attribute_id, value_hash)`

- [ ] **Table: `subject_attributes` (user/role/group ↔ attribute)**
  - `subject_type` (‘user’, ‘role’, ‘group’), `subject_id` (NOT NULL), `attribute_id` (NOT NULL; FK → `attributes.attribute_id`), `value_id` (NOT NULL; FK → `attribute_values.value_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `assigned_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `assigned_at`, `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `PRIMARY KEY (subject_type, subject_id, attribute_id, tenant_id), INDEX(attribute_id)`

- [ ] **Table: `resource_attributes` (resource ↔ attribute)**
  - `resource_type` (NOT NULL), `resource_id` (NOT NULL), `attribute_id` (NOT NULL; FK → `attributes.attribute_id`), `value_id` (NOT NULL; FK → `attribute_values.value_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `assigned_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `assigned_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `PRIMARY KEY (resource_type, resource_id, attribute_id, tenant_id), INDEX(attribute_id)`

---

# 5. OAuth2 / OIDC Service (`oidc-oauth-db`)
## Priority: HIGH - Core for API security and third-party integrations

### OAuth Clients
- [ ] **Table: `oauth_clients` (registered applications)**
  - `client_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `client_name` (NOT NULL), `client_description`, `secret_hash` (NOT NULL), `redirect_uris` (ARRAY or JSON), `allowed_origins` (ARRAY or JSON), `grant_types` (ARRAY), `response_types` (ARRAY), `scopes` (ARRAY), `token_endpoint_auth_method` (VARCHAR), `owner_user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `trust_level` (INT), `is_first_party` (BOOLEAN, DEFAULT FALSE), `logo_url`, `privacy_policy_url`, `terms_of_service_url`, `created_at`, `updated_at`, `revoked_at`, `is_revoked` (BOOLEAN, DEFAULT FALSE), `INDEX(tenant_id, is_revoked)`

- [ ] **Table: `client_credentials` (client secrets, keys)**
  - `credential_id` (PK), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `credential_type` (‘secret’, ‘certificate’, ‘jwt’), `value_hash` (NOT NULL), `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `INDEX(client_id)`

### OpenID Scopes
- [ ] **Table: `openid_scopes` (OIDC scope definitions)**
  - `scope_id` (PK), `scope` (UNIQUE, NOT NULL), `description`, `is_default` (BOOLEAN, DEFAULT FALSE), `is_deprecated` (BOOLEAN, DEFAULT FALSE), `resource_server`, `claims_included` (ARRAY or JSON), `metadata` (JSON), `created_at`, `updated_at`

### Authorization Flow
- [ ] **Table: `auth_codes` (authorization codes)**
  - `code_hash` (PK), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `user_id` (FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `redirect_uri`, `scope` (ARRAY), `code_challenge`, `challenge_method`, `nonce`, `state`, `issued_at` (NOT NULL), `expires_at` (NOT NULL), `is_consumed` (BOOLEAN, DEFAULT FALSE), `consumed_at`, `INDEX(client_id, user_id), INDEX(expires_at)`

### Token Management
- [ ] **Table: `access_tokens` (JWT/opaque tokens)**
  - `token_hash` (PK), `jti` (UNIQUE, NOT NULL), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `user_id` (FK → `auth-session-db.users.user_id`), `scope` (ARRAY), `audience` (ARRAY), `issued_at` (NOT NULL), `expires_at` (NOT NULL), `not_before`, `token_type` (VARCHAR), `is_revoked` (BOOLEAN, DEFAULT FALSE), `revoked_at`, `revocation_reason`, `INDEX(client_id, user_id), INDEX(jti), INDEX(expires_at)`

- [ ] **Table: `refresh_tokens` (token refresh)**
  - `token_hash` (PK), `jti` (UNIQUE, NOT NULL), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `user_id` (FK → `auth-session-db.users.user_id`), `access_token_jti` (NOT NULL; FK → `access_tokens.jti`), `scope` (ARRAY), `issued_at` (NOT NULL), `expires_at` (NOT NULL), `rotation_count` (INT, DEFAULT 0), `is_revoked` (BOOLEAN, DEFAULT FALSE), `revoked_at`, `family_id` (UUID), `INDEX(client_id, user_id), INDEX(family_id)`

- [ ] **Table: `token_revocations` (blacklisted tokens)**
  - `revocation_id` (PK), `token_jti` (NOT NULL), `token_type` (‘access’, ‘refresh’), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `user_id` (FK → `auth-session-db.users.user_id`), `reason` (‘user_request’, ‘admin_action’, ‘security_breach’, ‘rotation’), `revoked_at` (NOT NULL), `revoked_by` (FK → `auth-session-db.users.user_id`), `ip_address`, `user_agent`

### Device & CIBA Flows
- [ ] **Table: `device_codes` (device flow)**
  - `device_code_hash` (PK), `user_code` (UNIQUE, NOT NULL), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `scope` (ARRAY), `verification_uri`, `verification_uri_complete`, `issued_at` (NOT NULL), `expires_at` (NOT NULL), `status` (‘pending’, ‘authorized’, ‘denied’, ‘expired’), `user_id` (FK → `auth-session-db.users.user_id`), `authorized_at`, `INDEX(user_code), INDEX(client_id, status)`

- [ ] **Table: `ciba_requests` (CIBA flow)**
  - `auth_req_id` (PK), `client_id` (NOT NULL; FK → `oauth_clients.client_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `login_hint`, `login_hint_token`, `id_token_hint`, `scope` (ARRAY), `binding_message`, `user_code`, `requested_expiry`, `issued_at` (NOT NULL), `expires_at` (NOT NULL), `status` (‘pending’, ‘authorized’, ‘denied’, ‘expired’), `user_id` (FK → `auth-session-db.users.user_id`), `authorized_at`, `INDEX(client_id, status)`

### Key Management
- [ ] **Table: `jwks` (JSON Web Key Sets)**
  - `key_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `kid` (UNIQUE, NOT NULL), `public_key` (NOT NULL), `private_key_enc` (NOT NULL), `algorithm` (VARCHAR), `key_type` (‘sig’, ‘enc’), `use` (‘sig’, ‘enc’), `created_at`, `expires_at`, `rotated_at`, `status`, `rotation_policy`, `is_primary` (BOOLEAN, DEFAULT FALSE), `INDEX(tenant_id, use, status)`

---

# 6. Tenant & Organization Service (`tenant-org-db`)
## Priority: MEDIUM - Essential for multi-tenancy and organization management

### Tenant Core
- [ ] **Table: `tenants` (organizations/workspaces)**
  - `tenant_id` (PK), `name` (NOT NULL), `slug` (UNIQUE, NOT NULL), `description`, `deployment_type` (‘shared’, ‘self_hosted’), `primary_domain` (UNIQUE, NOT NULL), `alternate_domains` (ARRAY), `status` (‘active’, ‘suspended’, ‘deleted’), `subscription_tier`, `config_json` (JSON), `created_at`, `updated_at`, `deleted_at`, `INDEX(slug), INDEX(primary_domain)`

- [ ] **Table: `tenant_aliases` (Additional domains and redirects)**
  - `alias_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `domain` (UNIQUE, NOT NULL), `redirect_type` (‘permanent’, ‘temporary’), `created_at`, `updated_at`, `INDEX(tenant_id), INDEX(domain)`

- [ ] **Table: `tenant_status_logs` (Tracking status changes)**
  - `log_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `old_status` (‘active’, ‘suspended’, ‘deleted’), `new_status` (‘active’, ‘suspended’, ‘deleted’), `changed_by` (VARCHAR), `reason` (TEXT), `changed_at` (TIMESTAMP), `INDEX(tenant_id), INDEX(changed_at)`

### Tenant Settings
- [ ] **Table: `tenant_settings` (tenant configuration)**
  - `tenant_id` (PK; FK → `tenants.tenant_id`), `settings_json` (JSON), `created_at`, `updated_at`

### Tenant Membership
- [ ] **Table: `tenant_users` (user-tenant relationships)**
  - `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `is_root_admin` (BOOLEAN, DEFAULT FALSE), `status` (‘active’, ‘suspended’, ‘pending’, ‘left’), `joined_at` (NOT NULL), `left_at`, `invited_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `invitation_accepted_at`, `PRIMARY KEY (tenant_id, user_id), INDEX(user_id)`

- [ ] **Table: `tenant_invitations` (pending invites)**
  - `invitation_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `inviter_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `email` (NOT NULL), `role_id` (NOT NULL; FK → `tenant_roles.role_id`), `token_hash` (UNIQUE, NOT NULL), `message`, `status` (‘pending’, ‘accepted’, ‘expired’, ‘revoked’), `invited_at` (NOT NULL), `expires_at`, `accepted_at`, `INDEX(token_hash), INDEX(email, tenant_id)`

### Tenant Requests
- [ ] **Table: `tenant_requests` (join/create/transfer requests)**
  - `request_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `request_type` (‘join’, ‘create’, ‘transfer’), `status` (‘pending’, ‘approved’, ‘rejected’, ‘expired’), `message`, `requested_at` (NOT NULL), `responded_at`, `responded_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `rejection_reason`, `expires_at`, `INDEX(tenant_id, status), INDEX(user_id, status)`

### Tenant Roles
- [ ] **Table: `tenant_roles` (tenant-specific roles)**
  - `role_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `name` (NOT NULL), `description`, `is_system_role` (BOOLEAN, DEFAULT FALSE), `permissions_json` (JSON), `created_at`, `updated_at`, `UNIQUE(tenant_id, name)`

- [ ] **Table: `user_tenant_roles` (user roles per tenant)**
  - `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `role_id` (NOT NULL; FK → `tenant_roles.role_id`), `assigned_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `assigned_at`, `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `PRIMARY KEY (user_id, tenant_id, role_id), INDEX(tenant_id, role_id)`

---

# 7. Access Policy Engine Service (`policy-engine-db`)
## Priority: MEDIUM - Core for policy management and enforcement

### Policy Management
- [ ] **Table: `policies` (ABAC/RBAC policies)**
  - `policy_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `name` (NOT NULL), `description`, `policy_type` (‘rbac’, ‘abac’, ‘custom’), `definition` (TEXT or JSON), `language` (‘rego’, ‘json’, ‘cedar’), `version` (INT, DEFAULT 1), `status` (‘draft’, ‘active’, ‘deprecated’, ‘archived’), `environment` (‘development’, ‘staging’, ‘production’), `priority` (INT), `created_at`, `updated_at`, `UNIQUE(tenant_id, name, version)`

- [ ] **Table: `policy_metadata` (policy info)**
  - `policy_id` (PK; FK → `policies.policy_id`), `owner_user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tags` (ARRAY or JSON), `documentation` (TEXT), `test_cases` (JSON), `impact_analysis` (TEXT), `created_at`, `updated_at`

- [ ] **Table: `policy_versions` (versioning)**
  - `version_id` (PK), `policy_id` (NOT NULL; FK → `policies.policy_id`), `version_number` (INT, NOT NULL), `definition` (TEXT or JSON), `change_summary` (TEXT), `created_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `created_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(policy_id, version_number)`

- [ ] **Table: `policy_rules` (rule definitions)**
  - `rule_id` (PK), `policy_id` (NOT NULL; FK → `policies.policy_id`), `rule_name` (NOT NULL), `rule_condition` (JSON or TEXT), `rule_action` (VARCHAR), `priority` (INT), `is_enabled` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(policy_id, rule_name)`

### Policy Decision Point (PDP)
- [ ] **Table: `pdp_cache` (decision cache)**
  - `cache_id` (PK), `policy_id` (NOT NULL; FK → `policies.policy_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `compiled_policy` (BLOB or JSON), `bundle_hash` (VARCHAR, NOT NULL), `last_compiled` (TIMESTAMP), `compilation_time_ms` (INT), `cache_size_bytes` (BIGINT), `INDEX(policy_id, tenant_id), INDEX(bundle_hash)`

- [ ] **Table: `decision_logs` (access decisions)**
  - `decision_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `policy_id` (NOT NULL; FK → `policies.policy_id`), `requestor_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `subject_type`, `subject_id`, `resource_type`, `resource_id`, `action`, `decision` (‘allow’, ‘deny’), `reason`, `evaluated_at` (NOT NULL), `evaluation_time_ms` (INT), `trace_id` (UUID), `session_id`, `ip_address`, `INDEX(tenant_id, evaluated_at), INDEX(trace_id), INDEX(policy_id, decision)`

### Policy Enforcement Point (PEP)
- [ ] **Table: `pep_logs` (enforcement logs)**
  - `pep_log_id` (PK), `decision_id` (NOT NULL; FK → `decision_logs.decision_id`), `enforcement_point` (VARCHAR), `enforcement_action` (VARCHAR), `enforcement_time` (TIMESTAMP), `outcome` (‘enforced’, ‘bypassed’, ‘error’), `policy_version`, `error_details`, `INDEX(decision_id)`

### Policy Testing
- [ ] **Table: `policy_simulations` (testing)**
  - `simulation_id` (PK), `policy_id` (NOT NULL; FK → `policies.policy_id`), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `simulation_name` (NOT NULL), `test_scenarios` (JSON), `results` (JSON), `created_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `created_at`, `INDEX(policy_id, tenant_id)`

---

# 8. Rate Limiting Service (`rate-limit-db`)
## Priority: MEDIUM - Important for API protection and abuse prevention

### Rate Limit Rules
- [ ] **Table: `rate_limit_rules` (limit definitions)**
  - `rule_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `rule_name` (NOT NULL), `resource_type` (‘endpoint’, ‘user_action’, ‘ip_address’), `resource_identifier` (NOT NULL), `limit_type` (‘requests_per_minute’, ‘requests_per_hour’, ‘requests_per_day’), `limit_value` (INT, NOT NULL), `window_size_seconds` (INT, NOT NULL), `burst_capacity` (INT), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id, resource_type)`

### Rate Limit Tracking
- [ ] **Table: `rate_limit_buckets` (token buckets)**
  - `bucket_id` (PK), `rule_id` (NOT NULL; FK → `rate_limit_rules.rule_id`), `identifier_hash` (NOT NULL), `current_count` (INT, DEFAULT 0), `last_refill_at` (TIMESTAMP), `window_start` (TIMESTAMP), `is_blocked` (BOOLEAN, DEFAULT FALSE), `block_expires_at` (TIMESTAMP), `created_at`, `updated_at`, `INDEX(rule_id, identifier_hash), INDEX(window_start)`

- [ ] **Table: `rate_limit_violations` (breach logs)**
  - `violation_id` (PK), `rule_id` (NOT NULL; FK → `rate_limit_rules.rule_id`), `identifier_hash` (NOT NULL), `user_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `ip_address`, `exceeded_limit` (INT), `violation_count` (INT), `blocked_duration_seconds` (INT), `violated_at` (TIMESTAMP), `INDEX(rule_id, violated_at), INDEX(ip_address, violated_at)`

- [ ] **Table: `rate_limit_policies` (rule assignments)**
  - `policy_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `policy_name` (NOT NULL), `description`, `rules_json` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, policy_name)`

---

# 9. Security Monitoring Service (`security-monitor-db`)
## Priority: MEDIUM - Essential for security event tracking and threat intelligence

### Security Event Tracking
- [ ] **Table: `security_events` (security incidents)**
  - `event_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `event_type` (‘suspicious_login’, ‘privilege_escalation’, ‘data_exfiltration’, ‘brute_force’), `severity` (‘low’, ‘medium’, ‘high’, ‘critical’), `user_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `ip_address`, `user_agent`, `event_data` (JSON), `threat_indicators` (JSON), `risk_score` (FLOAT), `detected_at` (NOT NULL), `investigation_status` (‘new’, ‘investigating’, ‘resolved’, ‘false_positive’), `assigned_to` (NULLABLE; FK → `auth-session-db.users.user_id`), `INDEX(tenant_id, event_type, detected_at), INDEX(risk_score, investigation_status)`

### Threat Intelligence
- [ ] **Table: `threat_intelligence` (threat data)**
  - `intel_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `threat_type` (‘ip_reputation’, ‘domain_reputation’, ‘malware_signature’), `indicator` (NOT NULL), `indicator_hash` (UNIQUE, NOT NULL), `severity` (FLOAT), `confidence_score` (FLOAT), `source` (VARCHAR), `description`, `first_seen` (TIMESTAMP), `last_seen` (TIMESTAMP), `expiry_date` (TIMESTAMP), `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(indicator_hash), INDEX(threat_type, is_active)`

### Security Rules & Policies
- [ ] **Table: `security_rules` (detection rules)**
  - `rule_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `rule_name` (NOT NULL), `rule_type` (‘behavioral’, ‘signature’, ‘anomaly’), `condition_json` (JSON), `action` (‘alert’, ‘block’, ‘quarantine’), `severity` (‘low’, ‘medium’, ‘high’, ‘critical’), `is_enabled` (BOOLEAN, DEFAULT TRUE), `false_positive_rate` (FLOAT), `created_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `created_at`, `updated_at`, `INDEX(tenant_id, rule_type, is_enabled)`

### Behavioral Analysis
- [ ] **Table: `behavioral_baselines` (normal patterns)**
  - `baseline_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `metric_type` (‘login_frequency’, ‘access_patterns’, ‘location_patterns’), `baseline_data` (JSON), `confidence_level` (FLOAT), `last_calculated` (TIMESTAMP), `sample_size` (INT), `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(user_id, metric_type)`

- [ ] **Table: `risk_scores` (calculated risks)**
  - `risk_score_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `score_type` (‘login_risk’, ‘access_risk’, ‘behavioral_risk’), `score_value` (FLOAT), `calculation_method` (VARCHAR), `last_calculated` (TIMESTAMP), `confidence_level` (FLOAT), `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(user_id, score_type)`

- [ ] **Table: `anomaly_detections` (unusual activities)**
  - `anomaly_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `user_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `anomaly_type` (‘login_anomaly’, ‘access_anomaly’, ‘behavioral_anomaly’), `anomaly_data` (JSON), `risk_score` (FLOAT), `detected_at` (TIMESTAMP), `investigation_status` (‘new’, ‘investigating’, ‘resolved’, ‘false_positive’), `assigned_to` (NULLABLE; FK → `auth-session-db.users.user_id`), `INDEX(tenant_id, anomaly_type, detected_at)`

---

# 10. ACL & Security Labels Service (`acl-labels-db`)
## Priority: MEDIUM - Important for fine-grained access control and resource classification

### Access Control Lists
- [ ] **Table: `acl_entries` (access control lists)**
  - `entry_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `subject_type` (‘user’, ‘group’, ‘role’), `subject_id` (NOT NULL), `resource_type` (NOT NULL), `resource_id` (NOT NULL), `permissions` (ARRAY or JSON), `effect` (‘allow’, ‘deny’), `condition_json` (JSON), `priority` (INT), `is_inherited` (BOOLEAN, DEFAULT FALSE), `created_at`, `updated_at`, `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(tenant_id, resource_type, resource_id), INDEX(subject_type, subject_id)`

- [ ] **Table: `acl_inheritance` (permission inheritance)**
  - `parent_entry_id` (NOT NULL; FK → `acl_entries.entry_id`), `child_entry_id` (NOT NULL; FK → `acl_entries.entry_id`), `inheritance_type` (‘explicit’, ‘implicit’), `depth` (INT), `PRIMARY KEY (parent_entry_id, child_entry_id)`

- [ ] **Table: `acl_logs` (ACL changes)**
  - `log_id` (PK), `entry_id` (NOT NULL; FK → `acl_entries.entry_id`), `change_type` (‘created’, ‘updated’, ‘deleted’, ‘inherited’, ‘revoked’), `old_values` (JSON), `new_values` (JSON), `changed_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `changed_at` (TIMESTAMP), `reason`, `INDEX(entry_id, changed_at)`

### Security Labels
- [ ] **Table: `security_labels` (classification labels)**
  - `label_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `name` (UNIQUE, NOT NULL), `display_name`, `level` (INT), `color` (VARCHAR), `description`, `classification_level` (VARCHAR), `handling_instructions` (TEXT), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id, level)`

- [ ] **Table: `label_hierarchy` (label relationships)**
  - `parent_label_id` (NOT NULL; FK → `security_labels.label_id`), `child_label_id` (NOT NULL; FK → `security_labels.label_id`), `relationship_type` (‘dominates’, ‘equivalent’, ‘incomparable’), `depth` (INT), `PRIMARY KEY (parent_label_id, child_label_id)`

- [ ] **Table: `object_labels` (resource ↔ labels)**
  - `labeling_id` (PK), `object_type` (NOT NULL), `object_id` (NOT NULL), `label_id` (NOT NULL; FK → `security_labels.label_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `assigned_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `assigned_at` (TIMESTAMP), `expires_at`, `reason`, `is_active` (BOOLEAN, DEFAULT TRUE), `INDEX(object_type, object_id), INDEX(label_id)`

- [ ] **Table: `clearance_levels` (user clearances)**
  - `clearance_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `label_id` (NOT NULL; FK → `security_labels.label_id`), `granted_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `granted_at` (TIMESTAMP), `expires_at`, `is_active` (BOOLEAN, DEFAULT TRUE), `justification`, `INDEX(user_id, tenant_id)`

---

# 11. Audit & Compliance Service (`audit-compliance-db`)
## Priority: MEDIUM - Important for compliance and security auditing

### Audit Records
- [ ] **Table: `audit_records` (audit trail)**
  - `record_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `service_name` (NOT NULL), `event_type` (NOT NULL), `actor_type` (‘user’, ‘system’, ‘service’), `actor_id` (NOT NULL), `target_type`, `target_id`, `action` (VARCHAR), `result` (‘success’, ‘failure’, ‘partial’), `payload` (JSON), `sensitive_data_hash` (VARCHAR), `ip_address`, `user_agent`, `session_id`, `request_id`, `timestamp` (NOT NULL), `correlation_id` (UUID), `severity` (‘low’, ‘medium’, ‘high’, ‘critical’), `INDEX(tenant_id, timestamp), INDEX(event_type, timestamp), INDEX(actor_id, timestamp), INDEX(correlation_id)`

### Log Management
- [ ] **Table: `log_streams` (log streams)**
  - `stream_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `name` (NOT NULL), `description`, `event_types` (ARRAY or JSON), `retention_days` (INT), `compression_enabled` (BOOLEAN, DEFAULT TRUE), `encryption_enabled` (BOOLEAN, DEFAULT TRUE), `export_settings` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id)`

- [ ] **Table: `audit_configs` (audit settings)**
  - `config_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `service_name` (NOT NULL), `enabled_events` (ARRAY or JSON), `sampling_rate` (FLOAT), `retention_days` (INT), `pii_masking_enabled` (BOOLEAN, DEFAULT TRUE), `real_time_alerts` (BOOLEAN, DEFAULT FALSE), `export_destinations` (ARRAY or JSON), `compliance_standards` (ARRAY), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, service_name)`

### Alerting & Compliance
- [ ] **Table: `audit_alerts` (compliance alerts)**
  - `alert_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `record_id` (NULLABLE; FK → `audit_records.record_id`), `alert_type` (‘security_breach’, ‘policy_violation’, ‘anomaly’, ‘compliance’), `severity` (‘low’, ‘medium’, ‘high’, ‘critical’), `title`, `description`, `rule_triggered`, `threshold_values` (JSON), `is_resolved` (BOOLEAN, DEFAULT FALSE), `assigned_to` (NULLABLE; FK → `auth-session-db.users.user_id`), `created_at` (NOT NULL), `resolved_at`, `resolution_notes`, `INDEX(tenant_id, alert_type, is_resolved), INDEX(severity, created_at)`

- [ ] **Table: `audit_exports` (report exports)**
  - `export_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `export_name` (NOT NULL), `date_range_start` (DATE), `date_range_end` (DATE), `event_types` (ARRAY or JSON), `export_format` (‘json’, ‘csv’, ‘parquet’), `file_path` (VARCHAR), `file_size_bytes` (BIGINT), `record_count` (BIGINT), `status` (‘pending’, ‘processing’, ‘completed’, ‘failed’), `requested_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `requested_at` (NOT NULL), `completed_at`, `error_message`, `INDEX(tenant_id, status)`

- [ ] **Table: `compliance_reports` (regulatory reports)**
  - `report_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `report_type` (‘soc2’, ‘gdpr’, ‘hipaa’, ‘pci’), `reporting_period_start` (DATE), `reporting_period_end` (DATE), `report_data` (JSON or BLOB), `generated_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `generated_at` (NOT NULL), `report_status` (‘draft’, ‘final’, ‘submitted’), `file_path` (VARCHAR), `INDEX(tenant_id, report_type, reporting_period_start)`

- [ ] **Table: `retention_policies` (data retention)**
  - `policy_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `policy_name` (NOT NULL), `description`, `data_types` (ARRAY), `retention_period_days` (INT), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, policy_name)`

---

# 12. Data Privacy & Consent Service (`privacy-consent-db`)
## Priority: MEDIUM - Important for compliance with data protection regulations

### Consent Management
- [ ] **Table: `consent_purposes` (data usage purposes)**
  - `purpose_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `purpose_name` (NOT NULL), `description`, `legal_basis` (‘consent’, ‘contract’, ‘legal_obligation’, ‘vital_interests’, ‘public_task’, ‘legitimate_interests’), `data_categories` (ARRAY), `retention_period_days` (INT), `is_required` (BOOLEAN, DEFAULT FALSE), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id, legal_basis)`

- [ ] **Table: `user_consents` (consent records)**
  - `consent_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `purpose_id` (NOT NULL; FK → `consent_purposes.purpose_id`), `consent_status` (‘granted’, ‘denied’, ‘withdrawn’, ‘expired’), `consent_method` (‘explicit’, ‘implicit’, ‘pre_ticked’), `consent_version` (INT), `ip_address`, `user_agent`, `granted_at` (NOT NULL), `withdrawn_at`, `expires_at`, `INDEX(user_id, tenant_id), INDEX(purpose_id, consent_status)`

### Data Processing Activities
- [ ] **Table: `data_processing_activities` (processing logs)**
  - `activity_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `activity_name` (NOT NULL), `description`, `purpose_ids` (ARRAY of FK → `consent_purposes.purpose_id`), `data_categories` (ARRAY), `data_sources` (ARRAY), `recipients` (ARRAY), `retention_period` (INT), `cross_border_transfers` (BOOLEAN, DEFAULT FALSE), `security_measures` (JSON), `created_at`, `updated_at`, `INDEX(tenant_id)`

### Data Subject Rights
- [ ] **Table: `data_subject_requests` (GDPR requests)**
  - `request_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `request_type` (‘access’, ‘rectification’, ‘erasure’, ‘portability’, ‘restriction’, ‘objection’), `status` (‘submitted’, ‘verified’, ‘processing’, ‘completed’, ‘rejected’), `request_details` (TEXT), `verification_method` (VARCHAR), `requested_at` (NOT NULL), `verified_at`, `completed_at`, `response_data` (JSON), `handled_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `INDEX(user_id, request_type), INDEX(tenant_id, status)`

- [ ] **Table: `privacy_policies` (policy versions)**
  - `policy_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `version` (INT, NOT NULL), `content` (TEXT or JSON), `effective_date` (DATE), `expiration_date` (DATE), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, version)`

- [ ] **Table: `data_retention_rules` (retention policies)**
  - `rule_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `data_type` (NOT NULL), `retention_period_days` (INT), `conditions_json` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, data_type)`

---

# 13. Federation & Identity Providers Service (`federation-idp-db`)
## Priority: MEDIUM - Important for federated identity management and SSO

### Identity Provider Management
- [ ] **Table: `identity_providers` (external IdPs)**
  - `provider_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `provider_name` (NOT NULL), `provider_type` (‘saml’, ‘oidc’, ‘ldap’, ‘active_directory’), `issuer` (NOT NULL), `metadata_url`, `client_id`, `client_secret_encrypted`, `certificate` (TEXT or BLOB), `signing_key` (TEXT or BLOB), `attribute_mapping` (JSON), `user_provisioning_enabled` (BOOLEAN, DEFAULT FALSE), `group_mapping` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id, provider_type)`

### Federated Identity Mapping
- [ ] **Table: `federated_identities` (linked accounts)**
  - `federation_id` (PK), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `provider_id` (NOT NULL; FK → `identity_providers.provider_id`), `external_user_id` (NOT NULL), `external_username`, `attributes` (JSON), `last_sync_at`, `sync_status` (‘pending’, ‘synced’, ‘error’), `created_at`, `updated_at`, `UNIQUE(provider_id, external_user_id), INDEX(user_id)`

### SAML Assertion Management
- [ ] **Table: `saml_assertions` (SAML data)**
  - `assertion_id` (PK), `provider_id` (NOT NULL; FK → `identity_providers.provider_id`), `user_id` (NOT NULL; FK → `auth-session-db.users.user_id`), `assertion_xml` (XML or TEXT), `subject_name_id` (NOT NULL), `session_index` (NOT NULL), `authn_instant` (TIMESTAMP), `not_before` (TIMESTAMP), `not_on_or_after` (TIMESTAMP), `audience`, `issuer`, `created_at`, `INDEX(provider_id, user_id), INDEX(session_index)`

### User Provisioning Logs
- [ ] **Table: `provisioning_logs` (SCIM logs)**
  - `log_id` (PK), `provider_id` (NOT NULL; FK → `identity_providers.provider_id`), `user_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `operation` (‘create’, ‘update’, ‘delete’, ‘sync’), `status` (‘success’, ‘failure’, ‘partial’), `details` (JSON), `error_message` (TEXT), `processed_at`, `INDEX(provider_id, processed_at)`

### IdP Configuration & Mappings
- [ ] **Table: `idp_configurations` (IdP settings)**
  - `config_id` (PK), `provider_id` (NOT NULL; FK → `identity_providers.provider_id`), `config_name` (NOT NULL), `config_value` (TEXT or JSON), `is_sensitive` (BOOLEAN, DEFAULT FALSE), `created_at`, `updated_at`, `UNIQUE(provider_id, config_name)`

- [ ] **Table: `federation_mappings` (attribute mappings)**
  - `mapping_id` (PK), `provider_id` (NOT NULL; FK → `identity_providers.provider_id`), `local_attribute` (NOT NULL), `external_attribute` (NOT NULL), `mapping_type` (‘user’, ‘group’, ‘role’), `is_required` (BOOLEAN, DEFAULT FALSE), `created_at`, `updated_at`, `UNIQUE(provider_id, local_attribute, external_attribute)`

---

# 14. API Gateway & Management Service (`api-gateway-db`)
## Priority: LOW - Core for API access control, usage tracking, and rate limiting

### API Key Management
- [ ] **Table: `api_keys` (API credentials)**
  - `key_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `user_id` (NULLABLE; FK → `auth-session-db.users.user_id`), `client_id` (NULLABLE; FK → `oidc-oauth-db.oauth_clients.client_id`), `key_name` (NOT NULL), `key_hash` (UNIQUE, NOT NULL), `key_prefix` (VARCHAR), `scopes` (ARRAY), `rate_limit_tier` (VARCHAR), `allowed_ips` (ARRAY), `allowed_origins` (ARRAY), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `expires_at`, `last_used_at`, `usage_count` (INT, DEFAULT 0), `INDEX(key_hash), INDEX(tenant_id, is_active)`

### API Usage Tracking
- [ ] **Table: `api_usage` (usage statistics)**
  - `usage_id` (PK), `key_id` (NULLABLE; FK → `api_keys.key_id`), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `endpoint` (NOT NULL), `method` (NOT NULL), `response_status` (INT), `response_time_ms` (INT), `request_size_bytes` (INT), `response_size_bytes` (INT), `ip_address`, `user_agent`, `timestamp` (NOT NULL), `INDEX(key_id, timestamp), INDEX(tenant_id, endpoint, timestamp)`

### API Quota Management
- [ ] **Table: `api_quotas` (usage limits)**
  - `quota_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `resource_type` (‘api_key’, ‘user’, ‘tenant’), `resource_id` (NOT NULL), `quota_type` (‘requests_per_hour’, ‘requests_per_day’, ‘bandwidth_per_month’), `limit_value` (INT, NOT NULL), `current_usage` (INT, DEFAULT 0), `reset_interval` (INTERVAL or INT), `last_reset_at` (TIMESTAMP), `INDEX(resource_type, resource_id), INDEX(quota_type)`

- [ ] **Table: `api_routes` (endpoint definitions)**
  - `route_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `path` (NOT NULL), `method` (VARCHAR, NOT NULL), `description`, `is_public` (BOOLEAN, DEFAULT FALSE), `requires_authentication` (BOOLEAN, DEFAULT TRUE), `rate_limit_tier` (VARCHAR), `allowed_roles` (ARRAY), `allowed_scopes` (ARRAY), `created_at`, `updated_at`, `UNIQUE(tenant_id, LOWER(path), method)`

- [ ] **Table: `api_policies` (API-level policies)**
  - `policy_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `policy_name` (NOT NULL), `description`, `policy_type` (‘rate_limit’, ‘access_control’, ‘caching’), `definition` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `UNIQUE(tenant_id, policy_name)`

---

# 15. Graph Access Control Service (`graph-access-db`)
## Priority: LOW - Useful for complex access control scenarios involving relationships

### Graph Structure
- [ ] **Table: `graph_nodes` (entities)**
  - `node_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `node_type` (‘user’, ‘group’, ‘resource’, ‘role’), `external_id` (VARCHAR), `display_name` (VARCHAR), `properties` (JSON), `metadata` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP), `INDEX(tenant_id, node_type), INDEX(external_id)`

- [ ] **Table: `graph_edges` (relationships)**
  - `edge_id` (PK), `from_node_id` (FK → `graph_nodes.node_id`), `to_node_id` (FK → `graph_nodes.node_id`), `relation_type` (‘member_of’, ‘owns’, ‘can_access’, ‘inherits_from’), `properties` (JSON), `weight` (FLOAT), `is_bidirectional` (BOOLEAN, DEFAULT FALSE), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP), `expires_at` (TIMESTAMP), `INDEX(from_node_id, relation_type), INDEX(to_node_id, relation_type), UNIQUE(from_node_id, to_node_id, relation_type)`

### Graph Analytics
- [ ] **Table: `graph_paths` (access paths)**
  - `path_id` (PK), `source_node_id` (FK → `graph_nodes.node_id`), `target_node_id` (FK → `graph_nodes.node_id`), `path_length` (INT), `path_nodes` (ARRAY of node IDs), `path_edges` (ARRAY of edge IDs), `path_weight` (FLOAT), `is_shortest` (BOOLEAN, DEFAULT FALSE), `computed_at` (TIMESTAMP), `INDEX(source_node_id, target_node_id)`

- [ ] **Table: `graph_queries` (query patterns)**
  - `query_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `query_name` (NOT NULL), `query_definition` (JSON or TEXT), `query_type` (‘traversal’, ‘shortest_path’, ‘reachability’), `created_by` (NOT NULL; FK → `auth-session-db.users.user_id`), `created_at` (TIMESTAMP), `last_executed` (TIMESTAMP), `execution_count` (INT, DEFAULT 0), `INDEX(tenant_id)`

- [ ] **Table: `graph_snapshots` (point-in-time views)**
  - `snapshot_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `snapshot_name` (NOT NULL), `node_count` (INT), `edge_count` (INT), `snapshot_data` (BLOB or JSON), `created_at` (TIMESTAMP), `INDEX(tenant_id, created_at)`

- [ ] **Table: `graph_policies` (graph-based rules)**
  - `policy_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `policy_name` (NOT NULL), `description` (TEXT), `graph_query` (JSON or TEXT), `conditions` (JSON), `actions` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP), `UNIQUE(tenant_id, policy_name)`

---

# 16. Billing Service (`billing-db`)
## Priority: MEDIUM - Handles tenant “free or paid” billing, usage, invoices, and payments

### Plans & Pricing
- [ ] **Table: `plans` (service plans per tenant)**
  - `plan_id` (PK), `tenant_id` (NULLABLE; FK → `tenants.tenant_id`), `name` (NOT NULL), `description`, `billing_cycle` (‘monthly’, ‘annual’), `price_amount` (DECIMAL, NOT NULL), `currency` (CHAR(3), NOT NULL), `features_json` (JSON), `is_active` (BOOLEAN, DEFAULT TRUE), `created_at`, `updated_at`, `INDEX(tenant_id)`

### Subscriptions
- [ ] **Table: `subscriptions` (active subscriptions)**
  - `subscription_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `plan_id` (FK → `plans.plan_id`), `start_date` (DATE, NOT NULL), `end_date` (DATE), `status` (‘active’, ‘past_due’, ‘canceled’, ‘expired’), `auto_renew` (BOOLEAN, DEFAULT TRUE), `next_billing_date` (DATE), `created_at`, `updated_at`, `INDEX(tenant_id), INDEX(status)`

### Usage & Charges
- [ ] **Table: `usage_records` (tenant usage metrics)**
  - `usage_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `metric_name` (VARCHAR, NOT NULL), `usage_value` (DECIMAL, NOT NULL), `period_start` (DATE), `period_end` (DATE), `calculated_cost` (DECIMAL), `created_at` (TIMESTAMP), `INDEX(tenant_id, metric_name, period_start)`

- [ ] **Table: `invoices` (generated invoices)**
  - `invoice_id` (PK), `tenant_id` (NOT NULL; FK → `tenants.tenant_id`), `subscription_id` (FK → `subscriptions.subscription_id` NULLABLE), `invoice_date` (DATE, NOT NULL), `due_date` (DATE), `total_amount` (DECIMAL, NOT NULL), `currency` (CHAR(3), NOT NULL), `status` (‘draft’, ‘sent’, ‘paid’, ‘overdue’), `billing_period_start` (DATE), `billing_period_end` (DATE), `created_at`, `updated_at`, `INDEX(tenant_id, status), INDEX(invoice_date)`

- [ ] **Table: `invoice_line_items` (individual line items)**
  - `line_item_id` (PK), `invoice_id` (FK → `invoices.invoice_id`), `description` (TEXT), `quantity` (DECIMAL, DEFAULT 1), `unit_price` (DECIMAL, NOT NULL), `total_price` (DECIMAL, NOT NULL), `created_at`, `updated_at`, `INDEX(invoice_id)`

### Payment History
- [ ] **Table: `payments` (payment records)**
  - `payment_id` (PK), `invoice_id` (FK → `invoices.invoice_id`), `tenant_id` (FK → `tenants.tenant_id`), `payment_method` (‘credit_card’, ‘paypal’, ‘bank_transfer’, ‘stripe’, ‘manual’), `transaction_id` (VARCHAR), `amount` (DECIMAL, NOT NULL), `currency` (CHAR(3), NOT NULL), `paid_at` (TIMESTAMP, NOT NULL), `status` (‘pending’, ‘completed’, ‘failed’, ‘refunded’), `created_at`, `updated_at`, `INDEX(tenant_id, status), INDEX(paid_at)`

---

# 17. Analytics Service (`analytics-db`)
## Priority: LOW - Collects and aggregates usage/behavior metrics per tenant

### Event Tracking
- [ ] **Table: `events` (raw event ingestion)**
  - `event_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `user_id` (FK → `auth-session-db.users.user_id` NULLABLE), `event_type` (VARCHAR, NOT NULL), `resource_type` (VARCHAR), `resource_id` (BIGINT), `properties` (JSON), `timestamp` (TIMESTAMP, NOT NULL), `INDEX(tenant_id, event_type, timestamp), INDEX(user_id, timestamp)`

### Aggregated Metrics
- [ ] **Table: `daily_metrics` (daily aggregates)**
  - `metric_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `date` (DATE, NOT NULL), `metric_name` (VARCHAR, NOT NULL), `metric_value` (DECIMAL, NOT NULL), `INDEX(tenant_id, date, metric_name)`

- [ ] **Table: `monthly_metrics` (monthly aggregates)**
  - `metric_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `month` (DATE, NOT NULL), `metric_name` (VARCHAR, NOT NULL), `metric_value` (DECIMAL, NOT NULL), `INDEX(tenant_id, month, metric_name)`

### Dashboards & Reports
- [ ] **Table: `dashboard_configs` (tenant dashboard definitions)**
  - `dashboard_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `name` (VARCHAR, NOT NULL), `layout_json` (JSON), `filters_json` (JSON), `created_by` (FK → `auth-session-db.users.user_id`), `created_at`, `updated_at`, `INDEX(tenant_id)`

- [ ] **Table: `report_definitions` (custom report templates)**
  - `report_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `name` (VARCHAR, NOT NULL), `query_json` (JSON), `schedule_cron` (VARCHAR), `format` (‘PDF’, ‘CSV’, ‘JSON’, ‘XLSX’), `created_by` (FK → `auth-session-db.users.user_id`), `created_at`, `updated_at`, `INDEX(tenant_id)`

- [ ] **Table: `generated_reports` (instances of executed reports)**
  - `instance_id` (PK), `report_id` (FK → `report_definitions.report_id`), `tenant_id` (FK → `tenants.tenant_id`), `run_time` (TIMESTAMP, NOT NULL), `status` (‘pending’, ‘running’, ‘completed’, ‘failed’), `file_path` (VARCHAR), `record_count` (BIGINT), `duration_ms` (INT), `error_message` (TEXT), `INDEX(report_id, run_time), INDEX(tenant_id)`

---

