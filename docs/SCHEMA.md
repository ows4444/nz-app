# Microservices Schema - Multi-Tenant Optimized

  large-scale, multi-tenant systems, this document presents an optimized database schema for Authentication, OAuth/OIDC, User & Device Management, Access Control, Auditing, and Tenant Management. It emphasizes best practices in normalization, indexing, data integrity, and multi-tenancy.*

---

## 1. Authentication & Session (`auth_session_core`)

### Overview

* **Scope:** Centralized authentication, credential storage, session tracking.
* **Tenancy Model:** Shared schema; user credentials are global, but session context may include `tenant_id` for tenant-specific sessions if needed.
* **Key Considerations:** Encryption-at-rest for sensitive fields, rigorous indexing on lookup columns, strong referential integrity.

### Tables

1. **`users`**

   * **Description:** Master table for user identities across all tenants.
   * **Columns:**

     * `user_id`           UUID, PK, default `gen_random_uuid()`
     * `email`             VARCHAR(320), unique, not null
     * `username`          VARCHAR(100), unique, not null
     * `first_name`        VARCHAR(100), not null
     * `last_name`         VARCHAR(100), not null
     * `display_name`      VARCHAR(150)
     * `locale`            VARCHAR(10)
     * `status`            ENUM('ACTIVE','INACTIVE','SUSPENDED'), default 'ACTIVE'
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Primary Key on `user_id`
     * Unique index on `email`,`username`

2. **`user_credentials`**

   * **Description:** Stores password and hashing metadata. One-to-one with `users`.
   * **Columns:**

     * `user_id`           UUID, PK, FK → `users.user_id`
     * `password_hash`     BYTEA, not null
     * `salt`              BYTEA, not null
     * `hash_algo`         VARCHAR(50), not null
     * `pepper_version`    VARCHAR(10)
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Constraints:**

     * PK/FK constraint enforces one-to-one relationship with `users`

3. **`user_password_history`**

   * **Description:** Retains historical password data for rotation/audit.
   * **Columns:**

     * `history_id`        BIGSERIAL, PK
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `password_hash`     BYTEA, not null
     * `salt`              BYTEA, not null
     * `hash_algo`         VARCHAR(50), not null
     * `pepper_version`    VARCHAR(10)
     * `changed_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Index on (`user_id`, `changed_at DESC`)

4. **`password_resets`**

   * **Description:** Tracks password reset tokens and their lifecycle.
   * **Columns:**

     * `reset_id`          UUID, PK, default `gen_random_uuid()`
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `token`             VARCHAR(256), unique, not null
     * `requested_at`      TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`        TIMESTAMP WITH TIME ZONE, not null
     * `used_flag`         BOOLEAN, default false
     * `used_at`           TIMESTAMP WITH TIME ZONE
     * `ip_address`        INET
   * **Indexes:**

     * Unique index on `token`
     * Index on `user_id`

5. **`device_sessions`**

   * **Description:** Tracks each user’s session per device, optionally scoped to a tenant.
   * **Columns:**

     * `session_id`        UUID, PK, default `gen_random_uuid()`
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `device_id`         UUID, FK → `devices.device_id`, not null
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global sessions or tenant-scoped)
     * `active_flag`       BOOLEAN, default true
     * `ip_address`        INET
     * `started_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `last_seen_at`      TIMESTAMP WITH TIME ZONE
     * `geo_location`      VARCHAR(100)
   * **Indexes:**

     * Composite index on (`user_id`, `active_flag`)
     * Index on `device_id`

6. **`session_policies`**

   * **Description:** Defines global/in-tenant session constraints.
   * **Columns:**

     * `policy_id`         UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (if global)
     * `max_sessions`      INT, not null
     * `inactivity_timeout` INTERVAL, not null
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Index on `tenant_id`

7. **`login_attempts`**

   * **Description:** Logs all login attempts for security monitoring, risk scoring.
   * **Columns:**

     * `attempt_id`        BIGSERIAL, PK
     * `user_id`           UUID, FK → `users.user_id`, null (when user not found)
     * `timestamp`         TIMESTAMP WITH TIME ZONE, default now()
     * `success_flag`      BOOLEAN, not null
     * `ip_address`        INET
     * `user_agent`        VARCHAR(255)
     * `risk_score`        DECIMAL(5,2)
   * **Indexes:**

     * Index on (`user_id`, `timestamp DESC`)

---

## 2. OAuth2 / OIDC (`oidc_oauth_core`)

### Overview

* **Scope:** Authorization server capabilities for OAuth2 flows and OpenID Connect.
* **Tenancy Model:** Multi-tenant—clients and tokens are scoped per tenant.
* **Key Considerations:** Secure key management, PKCE support, token lifecycle, efficient lookup on token usage.

### Tables

1. **`tenants`** *(Referenced from Section 9)*

   * Ensures each client and token is associated with a specific tenant.

2. **`jwks`**

   * **Description:** Stores JSON Web Key Set entries for signing/verification.
   * **Columns:**

     * `key_id`             VARCHAR(100), PK
     * `tenant_id`          UUID, FK → `tenants.tenant_id`, not null
     * `public_key`         TEXT, not null
     * `private_key_enc`    BYTEA, not null
     * `algorithm`          VARCHAR(50), not null
     * `use`                VARCHAR(20), not null
     * `created_at`         TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`         TIMESTAMP WITH TIME ZONE
     * `status`             ENUM('ACTIVE','INACTIVE','REVOKED'), default 'ACTIVE'
     * `rotation_policy`    JSON, null
   * **Indexes:**

     * Composite index on (`tenant_id`,`status`)

3. **`openid_scopes`**

   * **Description:** Defines OpenID Connect scopes, global across all tenants.
   * **Columns:**

     * `scope`              VARCHAR(100), PK
     * `description`        TEXT
     * `default_flag`       BOOLEAN, default false
     * `deprecated_flag`    BOOLEAN, default false
     * `metadata`           JSON
   * **Indexes:**

     * Index on `default_flag`

4. **`oauth_clients`**

   * **Description:** Registered OAuth2 clients under each tenant.
   * **Columns:**

     * `client_id`          UUID, PK, default `gen_random_uuid()`
     * `tenant_id`          UUID, FK → `tenants.tenant_id`, not null
     * `client_name`        VARCHAR(150), not null
     * `secret_hash`        BYTEA, not null
     * `redirect_uris`      JSON ARRAY of VARCHAR, not null
     * `grant_types`        VARCHAR(100)\[], not null
     * `scopes`             VARCHAR(100)\[], not null
     * `auth_method`        ENUM('CLIENT\_SECRET\_BASIC','CLIENT\_SECRET\_POST','NONE'), default 'CLIENT\_SECRET\_BASIC'
     * `owner_user_id`      UUID, FK → `users.user_id`, not null
     * `trust_level`        SMALLINT, default 0
     * `created_at`         TIMESTAMP WITH TIME ZONE, default now()
     * `revoked_at`         TIMESTAMP WITH TIME ZONE
     * `revoked_flag`       BOOLEAN, default false
   * **Indexes:**

     * Unique composite index on (`tenant_id`,`client_name`)
     * Index on `owner_user_id`

5. **`auth_codes`**

   * **Description:** Stores authorization codes for Authorization Code flow with PKCE.
   * **Columns:**

     * `code`               VARCHAR(200), PK
     * `client_id`          UUID, FK → `oauth_clients.client_id`, not null
     * `user_id`            UUID, FK → `users.user_id`, not null
     * `redirect_uri`       VARCHAR(2083)
     * `code_challenge`     VARCHAR(100)
     * `challenge_method`   ENUM('S256','plain'), default 'S256'
     * `issued_at`          TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`         TIMESTAMP WITH TIME ZONE, not null
     * `consumed_flag`      BOOLEAN, default false
     * `nonce`              VARCHAR(100)
   * **Indexes:**

     * Index on (`client_id`,`user_id`)

6. **`access_tokens`**

   * **Description:** Bearer tokens issued for resource access.
   * **Columns:**

     * `token`              VARCHAR(500), PK
     * `tenant_id`          UUID, FK → `tenants.tenant_id`, not null
     * `client_id`          UUID, FK → `oauth_clients.client_id`, not null
     * `user_id`            UUID, FK → `users.user_id`, null (client credentials flow)
     * `scopes`             VARCHAR(100)\[], not null
     * `issued_at`          TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`         TIMESTAMP WITH TIME ZONE, not null
     * `token_type`         ENUM('Bearer','MAC'), default 'Bearer'
     * `audience`           VARCHAR(200)
     * `revoked_flag`       BOOLEAN, default false
     * `revoked_at`         TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Composite index on (`tenant_id`,`user_id`,`expires_at`)
     * Index on `client_id`

7. **`refresh_tokens`**

   * **Description:** Long-lived tokens used to obtain new access tokens.
   * **Columns:**

     * `token`              VARCHAR(500), PK
     * `client_id`          UUID, FK → `oauth_clients.client_id`, not null
     * `user_id`            UUID, FK → `users.user_id`, null
     * `issued_at`          TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`         TIMESTAMP WITH TIME ZONE, not null
     * `rotation_count`     INT, default 0
     * `revoked_flag`       BOOLEAN, default false
     * `revoked_at`         TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Index on (`client_id`,`user_id`)

8. **`revocation_logs`**

   * **Description:** Records token revocation events for auditing.
   * **Columns:**

     * `log_id`             BIGSERIAL, PK
     * `token`              VARCHAR(500), not null
     * `client_id`          UUID, FK → `oauth_clients.client_id`
     * `user_id`            UUID, FK → `users.user_id`
     * `reason`             TEXT
     * `revoked_at`         TIMESTAMP WITH TIME ZONE, default now()
     * `ip_address`         INET
   * **Indexes:**

     * Index on `client_id`
     * Index on `user_id`

9. **`device_codes`**

   * **Description:** Supports Device Authorization Grant (RFC 8628).
   * **Columns:**

     * `device_code`        VARCHAR(200), PK
     * `user_code`          VARCHAR(100), unique
     * `client_id`          UUID, FK → `oauth_clients.client_id`, not null
     * `tenant_id`          UUID, FK → `tenants.tenant_id`, not null
     * `scope`              VARCHAR(100)
     * `issued_at`          TIMESTAMP WITH TIME ZONE, default now()
     * `expires_at`         TIMESTAMP WITH TIME ZONE, not null
     * `status`             ENUM('PENDING','APPROVED','EXPIRED'), default 'PENDING'
   * **Indexes:**

     * Unique index on `user_code`
     * Index on (`client_id`,`tenant_id`)

10. **`ciba_requests`**

    * **Description:** Client-initiated Backchannel Authentication (CIBA) support.
    * **Columns:**

      * `auth_req_id`       VARCHAR(200), PK
      * `client_id`         UUID, FK → `oauth_clients.client_id`, not null
      * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
      * `login_hint`        VARCHAR(200)
      * `scope`             VARCHAR(100)
      * `binding_message`   VARCHAR(200)
      * `issued_at`         TIMESTAMP WITH TIME ZONE, default now()
      * `expires_at`        TIMESTAMP WITH TIME ZONE, not null
      * `status`            ENUM('PENDING','CANCELLED','COMPLETED'), default 'PENDING'
    * **Indexes:**

      * Index on (`client_id`,`tenant_id`)
      * Index on `expires_at`

---

## 3. User & Device Management (`identity_device_core`)

### Overview

* **Scope:** Manages user profiles, preferences, contacts, devices.
* **Tenancy Model:** User profiles are global. Devices and preferences may be scoped per tenant if required by business logic.
* **Key Considerations:** Data normalization, efficient lookups for authentication, cascade delete rules.

### Tables

1. **`users`** *(Reused from Section 1)*

   * Defines global user identity.

2. **`user_preferences`**

   * **Description:** Key-value store for user settings, optionally tenant-scoped.
   * **Columns:**

     * `user_id`           UUID, FK → `users.user_id`, not null
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global preference when null)
     * `preference_key`    VARCHAR(100), not null
     * `preference_value`  JSONB, not null
     * `updated_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Composite PK: (`user_id`,`preference_key`,`tenant_id`)
     * Index on `tenant_id`

3. **`user_contacts`**

   * **Description:** Stores multiple contact methods per user.
   * **Columns:**

     * `contact_id`        UUID, PK, default `gen_random_uuid()`
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `type`              ENUM('EMAIL','PHONE','SOCIAL'), not null
     * `value`             VARCHAR(320), not null
     * `verified_flag`     BOOLEAN, default false
     * `verified_at`       TIMESTAMP WITH TIME ZONE
     * `is_default`        BOOLEAN, default false
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Composite index on (`user_id`,`type`)
     * Unique index on (`user_id`,`type`,`value`)

4. **`contact_verifications`**

   * **Description:** Tracks verification codes for user contacts.
   * **Columns:**

     * `verification_id`   UUID, PK, default `gen_random_uuid()`
     * `contact_id`        UUID, FK → `user_contacts.contact_id`, not null
     * `purpose`           VARCHAR(100), not null
     * `token_hash`        BYTEA, not null
     * `code`              VARCHAR(20), not null
     * `expires_at`        TIMESTAMP WITH TIME ZONE, not null
     * `used_flag`         BOOLEAN, default false
     * `used_at`           TIMESTAMP WITH TIME ZONE
     * `requested_at`      TIMESTAMP WITH TIME ZONE, default now()
     * `ip_address`        INET
     * `user_agent`        VARCHAR(255)
   * **Indexes:**

     * Index on `contact_id`
     * Index on `expires_at`

5. **`devices`**

   * **Description:** Records device metadata.
   * **Columns:**

     * `device_id`         UUID, PK, default `gen_random_uuid()`
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `device_info`       JSONB, not null
     * `status`            ENUM('ACTIVE','INACTIVE','BLOCKED'), default 'ACTIVE'
     * `trust_score`       DECIMAL(3,2), default 0.00
     * `last_seen`         TIMESTAMP WITH TIME ZONE
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Index on (`user_id`,`status`)

---

## 4. Roles, Permissions & Attributes (`access_model_core`)

### Overview

* **Scope:** Defines RBAC constructs, dynamic attributes, and permission assignments.
* **Tenancy Model:** Roles are defined per tenant; global roles (e.g., SUPER\_ADMIN) may exist with `tenant_id = NULL`.
* **Key Considerations:** Hierarchical roles, efficient permission lookup, minimal joins for authorization checks.

### Tables

1. **`roles`**

   * **Description:** Role definitions, which can be hierarchical.
   * **Columns:**

     * `role_id`           UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global role if null)
     * `name`              VARCHAR(100), not null
     * `description`       TEXT
     * `parent_role_id`    UUID, FK → `roles.role_id`, null (for hierarchy)
     * `version`           INT, default 1
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Composite unique index on (`tenant_id`,`name`)
     * Index on `parent_role_id`

2. **`permissions`**

   * **Description:** Atomic permissions that can be assigned to roles.
   * **Columns:**

     * `perm_id`           UUID, PK, default `gen_random_uuid()`
     * `name`              VARCHAR(100), unique, not null
     * `description`       TEXT
     * `resource`          VARCHAR(100)
     * `action`            VARCHAR(50)
     * `tags`              JSONB
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Unique index on `name`
     * Index on `resource`

3. **`role_permissions`**

   * **Description:** Junction table mapping roles to permissions.
   * **Columns:**

     * `role_id`           UUID, FK → `roles.role_id`, not null
     * `perm_id`           UUID, FK → `permissions.perm_id`, not null
     * `granted_by`        UUID, FK → `users.user_id`, not null
     * `granted_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`role_id`,`perm_id`)
   * **Indexes:**

     * Index on `granted_by`

4. **`user_roles`**

   * **Description:** Maps users to roles within a tenant or globally.
   * **Columns:**

     * `user_id`           UUID, FK → `users.user_id`, not null
     * `role_id`           UUID, FK → `roles.role_id`, not null
     * `assigned_by`       UUID, FK → `users.user_id`, not null
     * `assigned_at`       TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`user_id`,`role_id`)

5. **`attributes`**

   * **Description:** Defines custom attributes (for ABAC/PBAC scenarios).
   * **Columns:**

     * `attr_id`           UUID, PK, default `gen_random_uuid()`
     * `name`              VARCHAR(100), unique, not null
     * `description`       TEXT
     * `data_type`         ENUM('STRING','NUMBER','BOOLEAN','JSON'), not null
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Unique index on `name`

6. **`attribute_values`**

   * **Description:** Stores allowed values for enumerated attributes.
   * **Columns:**

     * `value_id`          UUID, PK, default `gen_random_uuid()`
     * `attr_id`           UUID, FK → `attributes.attr_id`, not null
     * `value_string`      VARCHAR(255)
     * `value_number`      DECIMAL
     * `value_boolean`     BOOLEAN
     * `value_json`        JSONB
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Index on `attr_id`

7. **`subject_attributes`**

   * **Description:** Maps dynamic attributes to users or resources.
   * **Columns:**

     * `subject_type`      ENUM('USER','ROLE','RESOURCE'), not null
     * `subject_id`        UUID, not null
     * `attr_id`           UUID, FK → `attributes.attr_id`, not null
     * `value_id`          UUID, FK → `attribute_values.value_id`, not null
     * `assigned_at`       TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`subject_type`,`subject_id`,`attr_id`,`value_id`)
   * **Indexes:**

     * Composite index on (`subject_type`,`subject_id`)

8. **`resource_attributes`**

   * **Description:** Associates attributes to arbitrary resources (for PBAC).
   * **Columns:**

     * `resource_type`     VARCHAR(100), not null
     * `resource_id`       UUID, not null
     * `attr_id`           UUID, FK → `attributes.attr_id`, not null
     * `value_id`          UUID, FK → `attribute_values.value_id`, not null
     * `assigned_at`       TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`resource_type`,`resource_id`,`attr_id`,`value_id`)
   * **Indexes:**

     * Composite index on (`resource_type`,`resource_id`)

---

## 5. Access Control Policy Engine (`access_policy_engine`)

### Overview

* **Scope:** Policy management (e.g., ABAC/PBAC) and cached policy distribution (PDP/PEP).
* **Tenancy Model:** Policies may be global or tenant-scoped.
* **Key Considerations:** Low-latency decision logs, efficient policy loading, versioning.

### Tables

1. **`policies`**

   * **Description:** Definition of access policies in JSON or YAML.
   * **Columns:**

     * `policy_id`         UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global if null)
     * `name`              VARCHAR(150), not null
     * `definition`        JSONB, not null
     * `version`           INT, not null
     * `status`            ENUM('DRAFT','ACTIVE','RETIRED'), default 'DRAFT'
     * `environment`       VARCHAR(50)
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Constraints:**

     * Composite unique index on (`tenant_id`,`name`,`version`)

2. **`policy_metadata`**

   * **Description:** Metadata for policies (e.g., tags, owners).
   * **Columns:**

     * `policy_id`         UUID, FK → `policies.policy_id`, PK
     * `owner_user_id`     UUID, FK → `users.user_id`, not null
     * `tags`              JSONB
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE

3. **`pdp_cache`**

   * **Description:** Stores compiled/evaluated policy rules for fast access.
   * **Columns:**

     * `policy_id`         UUID, FK → `policies.policy_id`, PK
     * `compiled_blob`     BYTEA, not null
     * `last_loaded`       TIMESTAMP WITH TIME ZONE, default now()

4. **`decision_logs`**

   * **Description:** Logs each policy decision request/response.
   * **Columns:**

     * `decision_id`       UUID, PK, default `gen_random_uuid()`
     * `policy_id`         UUID, FK → `policies.policy_id`, not null
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null
     * `requestor_id`      UUID, FK → `users.user_id`, null
     * `decision`          ENUM('ALLOW','DENY','NOT\_APPLICABLE'), not null
     * `evaluated_at`      TIMESTAMP WITH TIME ZONE, default now()
     * `latency_ms`        INT
     * `trace_id`          UUID
   * **Indexes:**

     * Composite index on (`tenant_id`,`evaluated_at DESC`)
     * Index on `policy_id`

5. **`pep_logs`**

   * **Description:** Enforcement logs from Policy Enforcement Points.
   * **Columns:**

     * `pep_id`            UUID, PK, default `gen_random_uuid()`
     * `decision_id`       UUID, FK → `decision_logs.decision_id`, not null
     * `enforcement_time`  TIMESTAMP WITH TIME ZONE, default now()
     * `outcome`           ENUM('SUCCESS','FAILURE'), not null
     * `policy_version`    INT, not null
   * **Indexes:**

     * Index on `decision_id`

---

## 6. ACL & Security Labels (`access_dsl_core`)

### Overview

* **Scope:** Fine-grained ACL entries and security labeling for confidentiality/integrity.
* **Tenancy Model:** ACL entries and labels can apply tenant-wide or globally.
* **Key Considerations:** Low-latency checks, label hierarchies for sensitivity classifications.

### Tables

1. **`acl_entries`**

   * **Description:** Access Control List entries mapping users/groups to resources.
   * **Columns:**

     * `entry_id`          UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
     * `user_or_group`     VARCHAR(200), not null
     * `resource_type`     VARCHAR(100), not null
     * `resource_id`       UUID, not null
     * `permissions`       VARCHAR(50)\[]
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Composite index on (`tenant_id`,`resource_type`,`resource_id`)

2. **`acl_logs`**

   * **Description:** Tracks changes to ACL entries for audit.
   * **Columns:**

     * `log_id`            BIGSERIAL, PK
     * `entry_id`          UUID, FK → `acl_entries.entry_id`, not null
     * `change_type`       ENUM('CREATE','UPDATE','DELETE'), not null
     * `changed_by`        UUID, FK → `users.user_id`, not null
     * `changed_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Index on `entry_id`

3. **`security_labels`**

   * **Description:** Defines classification labels (e.g., CONFIDENTIAL, TOP\_SECRET).
   * **Columns:**

     * `label_id`          UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global if null)
     * `name`              VARCHAR(100), unique, not null
     * `level`             SMALLINT, not null
     * `description`       TEXT
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Unique index on (`tenant_id`,`name`)
     * Index on `level`

4. **`label_hierarchy`**

   * **Description:** Defines parent-child relationships among security labels.
   * **Columns:**

     * `parent_label_id`   UUID, FK → `security_labels.label_id`, not null
     * `child_label_id`    UUID, FK → `security_labels.label_id`, not null
   * **Primary Key:** Composite (`parent_label_id`,`child_label_id`)

5. **`object_labels`**

   * **Description:** Associates labels to arbitrary objects for classification.
   * **Columns:**

     * `object_type`       VARCHAR(100), not null
     * `object_id`         UUID, not null
     * `label_id`          UUID, FK → `security_labels.label_id`, not null
     * `assigned_at`       TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`object_type`,`object_id`,`label_id`)
   * **Indexes:**

     * Composite index on (`object_type`,`object_id`)

---

## 7. Graph-Based Access Control (`graph_access_core`)

### Overview

* **Scope:** Enables complex relationship modeling (e.g., social graphs, hierarchical resources).
* **Tenancy Model:** Graph nodes and edges are scoped per tenant or, if needed, global.
* **Key Considerations:** High-performance traversal, partitioning by tenant.

### Tables

1. **`graph_nodes`**

   * **Description:** Represents entities in the graph (e.g., user, resource, role).
   * **Columns:**

     * `node_id`           UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global)
     * `type`              VARCHAR(50), not null
     * `properties`        JSONB
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Composite index on (`tenant_id`,`type`)

2. **`graph_edges`**

   * **Description:** Defines relationships between `graph_nodes`.
   * **Columns:**

     * `edge_id`           UUID, PK, default `gen_random_uuid()`
     * `from_node_id`      UUID, FK → `graph_nodes.node_id`, not null
     * `to_node_id`        UUID, FK → `graph_nodes.node_id`, not null
     * `relation_type`     VARCHAR(50), not null
     * `properties`        JSONB
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Composite index on (`from_node_id`,`to_node_id`)

---

## 8. Auditing & Logging (`audit_core`)

### Overview

* **Scope:** Centralized audit trail for actions across all microservices.
* **Tenancy Model:** Audit entries include `tenant_id` where applicable.
* **Key Considerations:** Immutable append-only design, partitioning by date or tenant, retention policies.

### Tables

1. **`audit_records`**

   * **Description:** Singleton table for audit events across services.
   * **Columns:**

     * `record_id`         BIGSERIAL, PK
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, null (global events)
     * `service_name`      VARCHAR(100), not null
     * `event_type`        VARCHAR(100), not null
     * `payload`           JSONB, not null
     * `timestamp`         TIMESTAMP WITH TIME ZONE, default now()
     * `correlation_id`    UUID
     * `severity`          ENUM('INFO','WARN','ERROR','CRITICAL'), default 'INFO'
   * **Indexes:**

     * Composite index on (`tenant_id`,`timestamp DESC`)
     * Index on `service_name`

2. **`log_streams`**

   * **Description:** Defines logical groupings of logs for retention/analysis.
   * **Columns:**

     * `stream_id`         UUID, PK, default `gen_random_uuid()`
     * `name`              VARCHAR(100), unique, not null
     * `retention_days`    INT, not null
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Unique index on `name`

3. **`audit_alerts`**

   * **Description:** Tracks alerts generated from audit records (e.g., suspicious activity).
   * **Columns:**

     * `alert_id`          BIGSERIAL, PK
     * `record_id`         BIGINT, FK → `audit_records.record_id`, not null
     * `alert_type`        VARCHAR(100), not null
     * `resolved_flag`     BOOLEAN, default false
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `resolved_at`       TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Index on `record_id`
     * Index on (`resolved_flag`,`created_at DESC`)

4. **`audit_configs`**

   * **Description:** Configuration for which events/services to audit.
   * **Columns:**

     * `config_id`         UUID, PK, default `gen_random_uuid()`
     * `service_name`      VARCHAR(100), not null
     * `enabled_events`    VARCHAR(100)\[], not null
     * `retention_days`    INT, not null
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
   * **Indexes:**

     * Unique composite index on (`service_name`)

---

## 9. Tenant Onboarding & Membership (`tenant_membership_core`)

### Overview

* **Scope:** Full lifecycle management for tenants, user requests, and membership.
* **Tenancy Model:** Each tenant is isolated at the data level, but shares the schema; data rows include `tenant_id`.
* **Key Considerations:** Enforce strict referential integrity, prevent data leakage across tenants, efficient indexing on multi-tenancy keys.

### Tables

1. **`tenants`**

   * **Description:** Defines each tenant (customer/organization).
   * **Columns:**

     * `tenant_id`         UUID, PK, default `gen_random_uuid()`
     * `name`              VARCHAR(150), unique, not null
     * `description`       TEXT
     * `domain`            VARCHAR(150), unique, not null
     * `status`            ENUM('ACTIVE','SUSPENDED','DELETED'), default 'ACTIVE'
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Indexes:**

     * Unique index on `name`
     * Unique index on `domain`

2. **`tenant_requests`**

   * **Description:** Logs user requests to join a tenant.
   * **Columns:**

     * `request_id`        UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `status`            ENUM('PENDING','APPROVED','REJECTED'), default 'PENDING'
     * `requested_at`      TIMESTAMP WITH TIME ZONE, default now()
     * `responded_at`      TIMESTAMP WITH TIME ZONE
     * `responded_by`      UUID, FK → `users.user_id`
     * `reason`            TEXT
   * **Indexes:**

     * Composite index on (`tenant_id`,`status`)
     * Index on `user_id`

3. **`tenant_users`**

   * **Description:** Associates users to tenants, marking root admins and membership status.
   * **Columns:**

     * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
     * `user_id`           UUID, FK → `users.user_id`, not null
     * `is_root_admin`     BOOLEAN, default false
     * `joined_at`         TIMESTAMP WITH TIME ZONE, default now()
     * `status`            ENUM('ACTIVE','INACTIVE'), default 'ACTIVE'
   * **Primary Key:** Composite (`tenant_id`,`user_id`)
   * **Indexes:**

     * Composite index on (`user_id`,`status`)

4. **`tenant_roles`**

   * **Description:** Tenant-scoped roles that define permission boundaries.
   * **Columns:**

     * `role_id`           UUID, PK, default `gen_random_uuid()`
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
     * `name`              VARCHAR(100), not null
     * `description`       TEXT
     * `created_at`        TIMESTAMP WITH TIME ZONE, default now()
     * `updated_at`        TIMESTAMP WITH TIME ZONE
   * **Constraints:**

     * Composite unique index on (`tenant_id`,`name`)

5. **`user_tenant_roles`**

   * **Description:** Maps users to tenant-scoped roles.
   * **Columns:**

     * `user_id`           UUID, FK → `users.user_id`, not null
     * `tenant_id`         UUID, FK → `tenants.tenant_id`, not null
     * `role_id`           UUID, FK → `tenant_roles.role_id`, not null
     * `assigned_by`       UUID, FK → `users.user_id`, not null
     * `assigned_at`       TIMESTAMP WITH TIME ZONE, default now()
   * **Primary Key:** Composite (`user_id`,`tenant_id`,`role_id`)
   * **Indexes:**

     * Composite index on (`tenant_id`,`role_id`)

### Workflow Notes

1. **User Requests to Join**

   * User inserts a record into `tenant_requests` → `status = 'PENDING'`.
   * Unique constraint ensures duplicate requests by same user to same tenant are prevented.

2. **Admin Approval Process**

   * Root admins query `tenant_requests` where `status = 'PENDING'`.
   * Admin updates `status` to `APPROVED` or `REJECTED`, sets `responded_at` and `responded_by`.
   * Business logic enforces only one active root admin per tenant or supervises multiple as needed.

3. **Activating Membership**

   * On `APPROVED`, insert into `tenant_users` with `status = 'ACTIVE'`, capturing `joined_at`.
   * If `REJECTED`, record reason; no row added to `tenant_users`.

4. **Role & Permission Assignment**

   * Tenant roles are created in `tenant_roles`.
   * Permissions scoped to tenant are assigned by extending global `permissions` with `tenant_id` context if necessary.
   * Map users to roles via `user_tenant_roles`.
   * Enforcement layer joins `tenant_users` + `user_tenant_roles` + `role_permissions` for authorization decisions.

5. **Multi-Tenant Membership**

   * Users can exist in multiple tenants → multiple rows in `tenant_users` and `user_tenant_roles`.
   * Each tenant’s data visibility is restricted via `tenant_id` qualifier on all relevant tables.

6. **Audit Trail Integration**

   * All insert/update/delete operations on `tenant_requests`, `tenant_users`, `tenant_roles`, and `user_tenant_roles` are recorded in `audit_records` with `service_name = 'tenant_membership_core'` and relevant `payload`.

---

### Indexing & Performance Notes (Global)

1. **Composite Index Strategy:**

   * Always include `tenant_id` as leading column in indexes for tenant-scoped tables to leverage partition pruning.
2. **Partitioning Recommendations:**

   * Highly active tables like `login_attempts` and `audit_records` should be range-partitioned by `timestamp` and/or hashed by `tenant_id`.
3. **Foreign Key Cascades:**

   * Use `ON DELETE CASCADE` sparingly; prefer `SET NULL` or application-level cleanup to avoid accidental data loss.
4. **Encryption & Masking:**

   * Encrypt sensitive columns at rest (e.g., `password_hash`, `private_key_enc`) and consider dynamic data masking for high-privilege users.
5. **Connection Pooling & Sharding:**

   * For extreme scale, shard by `tenant_id` and route queries via the application layer.
6. **Auditing & GDPR Compliance:**

   * Implement soft-delete (`status = 'DELETED'`) and data erasure workflows for user/tenant `right to be forgotten` requests.

---

**This design ensures:**

* **Tenant Isolation** via `tenant_id` qualifiers.
* **High Performance** through targeted indexing and partitioning.
* **Security** via encryption, strict FK constraints, and audit trails.
* **Extensibility** enabling new modules (e.g., billing, notifications) by inheriting the multi-tenant pattern.

*End of schema document.*
