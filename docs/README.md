## 1. Authentication & Session (`auth-session-core`)

### Database Schema

- [x] **Table: `users_credentials`**  
  - `user_id` (PK), `password_hash`, `salt`, `algo`, `pepper_version`, `created_at`, `updated_at`
- [x] **Table: `user_password_history`**  
  - `id` (PK), `user_id` (FK), `password_hash`, `salt`, `algo`, `pepper_version`, `created_at`
- [x] **Table: `device_sessions`**  
  - `session_id` (PK), `device_id` (FK), `user_id` (FK), `active_flag`, `ip_address`, `started_at`, `last_seen_at`, `geo_location`
- [x] **Table: `session_policies`**  
  - `policy_id` (PK), `max_sessions`, `inactivity_timeout`, `created_at`
- [x] **Table: `login_attempts`**  
  - `id` (PK), `user_id` (FK), `timestamp`, `success_flag`, `ip_address`, `user_agent`, `risk_score`
- [x] **Table: `password_resets`**  
  - `id` (PK), `user_id` (FK), `token`, `requested_at`, `expires_at`, `used_flag`, `ip_address`


## 2. OAuth2 / OIDC (`oidc-oauth-core`)

### Database Schema

- [ ] **Table: `jwks`**  
  - `key_id` (PK), `public_key`, `private_key_encrypted`, `algorithm`, `use`, `created_at`, `expires_at`, `status`, `rotation_policy`
- [ ] **Table: `openid_scopes`**  
  - `scope` (PK), `description`, `default_flag`, `deprecated_flag`, `metadata` (JSON)
- [ ] **Table: `pkce_challenges`**  
  - `code` (PK), `challenge`, `method`, `issued_at`
- [ ] **Table: `oauth_clients`**  
  - `client_id` (PK), `secret_hash`, `redirect_uris` (JSON), `grant_types` (enum list), `scopes` (array), `auth_method`, `owner_id`, `created_at`, `revoked_flag`, `trust_level`
- [ ] **Table: `auth_codes`**  
  - `code` (PK), `client_id` (FK), `user_id` (FK), `redirect_uri`, `code_challenge`, `method`, `issued_at`, `expires_at`, `consumed_flag`, `nonce`
- [ ] **Table: `access_tokens`**  
  - `token` (PK), `client_id`, `user_id`, `scopes` (array), `issued_at`, `expires_at`, `token_type`, `revoked_flag`, `audience`
- [ ] **Table: `refresh_tokens`**  
  - `token` (PK), `client_id`, `user_id`, `issued_at`, `expires_at`, `revoked_flag`, `rotation_count`
- [ ] **Table: `revocation_logs`**  
  - `id` (PK), `token`, `client_id`, `user_id`, `reason`, `revoked_at`, `ip_address`
- [ ] **Table: `client_grant_types`**  
  - `client_id`, `grant_type`, `added_at`
- [ ] **Table: `device_codes`**  
  - `device_code` (PK), `user_code`, `client_id`, `scope`, `issued_at`, `expires_at`, `status`
- [ ] **Table: `ciba_requests`**  
  - `auth_req_id` (PK), `client_id`, `login_hint`, `scope`, `binding_message`, `expires_at`, `status`


## 3. User & Device Management (`identity-device-core`)

### Database Schema

- [x] **Table: `users_profile`**  
  - `user_id` (PK), `first_name`, `last_name`, `username` (unique), `displayName`, `email` (unique), `locale`, `avatar_url`, `status`, `created_at`, `updated_at`
- [x] **Table: `user_preferences`**  
  - `user_id` (FK), `key`, `value`, `updated_at`, `source` (UI/API/bulk)
- [x] **Table: `user_contacts`**  
  - `id` (PK), `user_id` (FK), `type`, `value`, `verified_flag`, `verified_at`, `is_default`
- [x] **Table: `contact_verifications`**  
  - `id` (PK), `contact_id` (FK), `purpose`, `token_hash`, `code`, `expires_at`, `used_flag`, `requested_at`, `used_at`, `ip_address`, `user_agent`, `created_at`, `updated_at`
- [x] **Table: `devices`**  
  - `device_id` (PK), `user_id` (FK), `device_info` (JSON), `created_at`, `last_seen`, `status`, `trust_score`
- [x] **Table: `user_devices`**  
  - `user_id` (FK), `device_id` (FK), `is_active` (BOOLEAN NOT NULL DEFAULT FALSE), `linked_at` (TIMESTAMP)  
  - PRIMARY KEY(`user_id`, `device_id`),  
  - UNIQUE INDEX on (`device_id`) WHERE `is_active` = TRUE


## 4. Roles, Permissions & Attributes (`access-model-core`)

### Database Schema

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


## 5. Access Control Policy Engine (`access-policy-engine`)

### Database Schema

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


## 6. ACL & Security Labels (`access-dsl-core`)

### Database Schema

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


## 7. Graph-Based Access Control (`graph-access-core`)

### Database Schema

- [ ] **Table: `graph_nodes`**  
  - `node_id` (PK), `type`, `properties` (JSON), `created_at`, `updated_at`
- [ ] **Table: `graph_edges`**  
  - `edge_id` (PK), `from_node_id` (FK), `to_node_id` (FK), `relation_type`, `properties` (JSON), `created_at`, `updated_at`


## 8. Auditing & Logging (`audit-core`)

### Database Schema

- [ ] **Table: `audit_records`**  
  - `record_id` (PK), `service_name`, `event_type`, `payload` (JSON), `timestamp`, `correlation_id`, `severity`
- [ ] **Table: `log_streams`**  
  - `stream_id` (PK), `name`, `retention_policy_days`, `created_at`
- [ ] **Table: `audit_alerts`**  
  - `alert_id` (PK), `record_id` (FK), `alert_type`, `resolved_flag`, `created_at`, `resolved_at`
- [ ] **Table: `audit_configs`**  
  - `config_id` (PK), `service_name`, `enabled_events`, `retention_days`
