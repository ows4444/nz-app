## 1. Authentication & Session (`auth-session-core`)

### Database Schema

- [ ] **Table: `users`**
  - `user_id` (PK), `email`, `username`, `first_name`, `last_name`, `display_name`, `locale`, `status`, `created_at`, `updated_at`
- [ ] **Table: `user_credentials`**
  - `user_id` (PK, FK → `users.user_id`), `password_hash`, `salt`, `hash_algo`, `pepper_version`, `created_at`, `updated_at`
- [ ] **Table: `user_password_history`**
  - `history_id` (PK), `user_id` (FK → `users.user_id`), `password_hash`, `salt`, `hash_algo`, `pepper_version`, `changed_at`
- [ ] **Table: `password_resets`**
  - `reset_id` (PK), `user_id` (FK → `users.user_id`), `token`, `requested_at`, `expires_at`, `used_flag`, `used_at`, `ip_address`
- [ ] **Table: `login_attempts`**
  - `attempt_id` (PK), `user_id` (FK → `users.user_id`), `timestamp`, `success_flag`, `ip_address`, `user_agent`, `risk_score`
- [ ] **Table: `session_policies`**
  - `policy_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `max_sessions`, `inactivity_timeout`, `created_at`

---

## 2. User & Device Management (`identity-device-core`)

### Database Schema

- [ ] **Table: `user_profiles`**
  - `user_id` (PK, FK → `users.user_id`), `first_name`, `last_name`, `display_name`, `locale`, `avatar_url`, `status`, `created_at`, `updated_at`
- [ ] **Table: `user_preferences`**
  - `user_id` (FK → `users.user_id`), `tenant_id` (FK → `tenants.tenant_id`, nullable), `preference_key`, `preference_value`, `updated_at`
- [ ] **Table: `user_contacts`**
  - `contact_id` (PK), `user_id` (FK → `users.user_id`), `type`, `value`, `verified_flag`, `verified_at`, `is_default`, `created_at`
- [ ] **Table: `contact_verifications`**
  - `verification_id` (PK), `contact_id` (FK → `user_contacts.contact_id`), `purpose`, `token_hash`, `code`, `expires_at`, `used_flag`, `used_at`, `requested_at`, `ip_address`, `user_agent`
- [ ] **Table: `devices`**
  - `device_id` (PK), `device_info`, `status`, `trust_score`, `last_seen`, `created_at`
- [ ] **Table: `device_sessions`**
  - `session_id` (PK), `device_id` (FK → `devices.device_id`), `user_id` (FK → `users.user_id`), `tenant_id` (FK → `tenants.tenant_id`), `active_flag`, `ip_address`, `started_at`, `last_seen_at`, `geo_location`

---

## 3. Tenant Onboarding & Membership (`tenant-membership-core`)

### Database Schema

- [ ] **Table: `tenants`**
  - `tenant_id` (PK), `name`, `description`, `domain`, `status`, `created_at`, `updated_at`
- [ ] **Table: `tenant_requests`**
  - `request_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `user_id` (FK → `users.user_id`), `status`, `requested_at`, `responded_at`, `responded_by` (FK → `users.user_id`), `reason`
- [ ] **Table: `tenant_users`**
  - `tenant_id` (FK → `tenants.tenant_id`), `user_id` (FK → `users.user_id`), `is_root_admin`, `joined_at`, `status`
- [ ] **Table: `tenant_roles`**
  - `role_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `name`, `description`, `created_at`, `updated_at`
- [ ] **Table: `user_tenant_roles`**
  - `user_id` (FK → `users.user_id`), `tenant_id` (FK → `tenants.tenant_id`), `role_id` (FK → `tenant_roles.role_id`), `assigned_by` (FK → `users.user_id`), `assigned_at`

---

## 4. OAuth2 / OIDC (`oidc-oauth-core`)

### Database Schema

- [ ] **Table: `jwks`**
  - `key_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `public_key`, `private_key_enc`, `algorithm`, `use`, `created_at`, `expires_at`, `status`, `rotation_policy`
- [ ] **Table: `openid_scopes`**
  - `scope` (PK), `description`, `default_flag`, `deprecated_flag`, `metadata`
- [ ] **Table: `oauth_clients`**
  - `client_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `client_name`, `secret_hash`, `redirect_uris`, `grant_types`, `scopes`, `auth_method`, `owner_user_id` (FK → `users.user_id`), `trust_level`, `created_at`, `revoked_at`, `revoked_flag`
- [ ] **Table: `auth_codes`**
  - `code` (PK), `client_id` (FK → `oauth_clients.client_id`), `user_id` (FK → `users.user_id`), `redirect_uri`, `code_challenge`, `challenge_method`, `issued_at`, `expires_at`, `consumed_flag`, `nonce`
- [ ] **Table: `access_tokens`**
  - `token` (PK), `tenant_id` (FK → `tenants.tenant_id`), `client_id` (FK → `oauth_clients.client_id`), `user_id` (FK → `users.user_id`, nullable), `scopes`, `issued_at`, `expires_at`, `token_type`, `audience`, `revoked_flag`, `revoked_at`
- [ ] **Table: `refresh_tokens`**
  - `token` (PK), `client_id` (FK → `oauth_clients.client_id`), `user_id` (FK → `users.user_id`, nullable), `issued_at`, `expires_at`, `rotation_count`, `revoked_flag`, `revoked_at`
- [ ] **Table: `revocation_logs`**
  - `log_id` (PK), `token`, `client_id` (FK → `oauth_clients.client_id`), `user_id` (FK → `users.user.id`), `reason`, `revoked_at`, `ip_address`
- [ ] **Table: `device_codes`**
  - `device_code` (PK), `user_code`, `client_id` (FK → `oauth_clients.client_id`), `tenant_id` (FK → `tenants.tenant_id`), `scope`, `issued_at`, `expires_at`, `status`
- [ ] **Table: `ciba_requests`**
  - `auth_req_id` (PK), `client_id` (FK → `oauth_clients.client_id`), `tenant_id` (FK → `tenants.tenant_id`), `login_hint`, `scope`, `binding_message`, `issued_at`, `expires_at`, `status`

---

## 5. Roles, Permissions & Attributes (`access-model-core`)

### Database Schema

- [ ] **Table: `roles`**
  - `role_id` (PK), `tenant_id` (FK → `tenants.tenant_id`, nullable), `name`, `description`, `parent_role_id`, `version`, `created_at`, `updated_at`
- [ ] **Table: `permissions`**
  - `perm_id` (PK), `name`, `description`, `resource`, `action`, `tags`, `created_at`, `updated_at`
- [ ] **Table: `role_permissions`**
  - `role_id` (FK → `roles.role_id`), `perm_id` (FK → `permissions.perm_id`), `granted_by` (FK → `users.user_id`), `granted_at`
- [ ] **Table: `user_roles`**
  - `user_id` (FK → `users.user_id`), `role_id` (FK → `roles.role_id`), `assigned_by` (FK → `users.user_id`), `assigned_at`
- [ ] **Table: `attributes`**
  - `attr_id` (PK), `name`, `description`, `data_type`, `created_at`
- [ ] **Table: `attribute_values`**
  - `value_id` (PK), `attr_id` (FK → `attributes.attr_id`), `value_string`, `value_number`, `value_boolean`, `value_json`, `created_at`
- [ ] **Table: `subject_attributes`**
  - `subject_type`, `subject_id`, `attr_id` (FK → `attributes.attr_id`), `value_id` (FK → `attribute_values.value_id`), `assigned_at`
- [ ] **Table: `resource_attributes`**
  - `resource_type`, `resource_id`, `attr_id` (FK → `attributes.attr_id`), `value_id` (FK → `attribute_values.value_id`), `assigned_at`

---

## 6. Access Control Policy Engine (`access-policy-engine`)

### Database Schema

- [ ] **Table: `policies`**
  - `policy_id` (PK), `tenant_id` (FK → `tenants.tenant_id`, nullable), `name`, `definition`, `version`, `status`, `environment`, `created_at`, `updated_at`
- [ ] **Table: `policy_metadata`**
  - `policy_id` (PK, FK → `policies.policy_id`), `owner_user_id` (FK → `users.user.id`), `tags`, `created_at`, `updated_at`
- [ ] **Table: `pdp_cache`**
  - `policy_id` (PK, FK → `policies.policy_id`), `compiled_blob`, `last_loaded`
- [ ] **Table: `decision_logs`**
  - `decision_id` (PK), `policy_id` (FK → `policies.policy_id`), `tenant_id` (FK → `tenants.tenant_id`, nullable), `requestor_id` (FK → `users.user.id`, nullable), `decision`, `evaluated_at`, `latency_ms`, `trace_id`
- [ ] **Table: `pep_logs`**
  - `pep_id` (PK), `decision_id` (FK → `decision_logs.decision_id`), `enforcement_time`, `outcome`, `policy_version`

---

## 7. ACL & Security Labels (`access-dsl-core`)

### Database Schema

- [ ] **Table: `acl_entries`**
  - `entry_id` (PK), `tenant_id` (FK → `tenants.tenant_id`), `user_or_group`, `resource_type`, `resource_id`, `permissions`, `created_at`, `updated_at`
- [ ] **Table: `acl_logs`**
  - `log_id` (PK), `entry_id` (FK → `acl_entries.entry_id`), `change_type`, `changed_by` (FK → `users.user.id`), `changed_at`
- [ ] **Table: `security_labels`**
  - `label_id` (PK), `tenant_id` (FK → `tenants.tenant_id`, nullable), `name`, `level`, `description`, `created_at`
- [ ] **Table: `label_hierarchy`**
  - `parent_label_id` (FK → `security_labels.label_id`), `child_label_id` (FK → `security_labels.label.id`), (composite PK)
- [ ] **Table: `object_labels`**
  - `object_type`, `object_id`, `label_id` (FK → `security_labels.label_id`), `assigned_at`

---

## 8. Graph-Based Access Control (`graph-access-core`)

### Database Schema

- [ ] **Table: `graph_nodes`**
  - `node_id` (PK), `tenant_id` (FK → `tenants.tenant_id`, nullable), `type`, `properties`, `created_at`, `updated_at`
- [ ] **Table: `graph_edges`**
  - `edge_id` (PK), `from_node_id` (FK → `graph_nodes.node_id`), `to_node_id` (FK → `graph_nodes.node_id`), `relation_type`, `properties`, `created_at`, `updated_at`

---

## 9. Auditing & Logging (`audit-core`)

### Database Schema

- [ ] **Table: `audit_records`**
  - `record_id` (PK), `tenant_id` (FK → `tenants.tenant.id`, nullable), `service_name`, `event_type`, `payload`, `timestamp`, `correlation_id`, `severity`
- [ ] **Table: `log_streams`**
  - `stream_id` (PK), `name`, `retention_days`, `created_at`
- [ ] **Table: `audit_alerts`**
  - `alert_id` (PK), `record_id` (FK → `audit_records.record_id`), `alert_type`, `resolved_flag`, `created_at`, `resolved_at`
- [ ] **Table: `audit_configs`**
  - `config_id` (PK), `service_name`, `enabled_events`, `retention_days`, `created_at`
