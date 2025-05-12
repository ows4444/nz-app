# Microservices Combined Contexts Checklist

Use this README as a pro‑developer checklist to track completed APIs and database schemas for each combined service context. Checkboxes (`- [ ]`) let you mark items as done.

---

## 1. Identity & Access Management (`iam-service`)

### APIs

* [ ] **Auth Endpoints**

  * [ ] `POST /auth/register`
  * [ ] `POST /auth/login/email`
  * [ ] `POST /auth/login/username`
  * [ ] `POST /auth/logout`
  * [ ] `POST /auth/password-reset`
* [ ] **OAuth2/OIDC Endpoints**

  * [ ] `POST /oauth/token`
  * [ ] `GET /oauth/authorize`
  * [ ] `POST /oauth/revoke`
* [ ] **User Management**

  * [ ] `GET /users`
  * [ ] `GET /users/:id`
  * [ ] `POST /users`
  * [ ] `PUT /users/:id`
  * [ ] `DELETE /users/:id`

### Database Schemas

* [ ] `users_credentials` (id, user\_id, password\_hash, salt, created\_at)
* [ ] `password_resets` (id, user\_id, token, expires\_at)
* [ ] `login_attempts` (id, user\_id, timestamp, success\_flag)
* [ ] `oauth_clients` (client\_id, secret\_hash, redirect\_uris)
* [ ] `auth_codes` (code, client\_id, user\_id, expires\_at)
* [ ] `access_tokens` (token, client\_id, user\_id, scope, expires\_at)
* [ ] `refresh_tokens` (token, client\_id, user\_id, expires\_at)
* [ ] `users_profile` (user\_id, name, email, phone, locale)
* [ ] `user_preferences` (user\_id, key, value)
* [ ] `user_contacts` (user\_id, contact\_type, contact\_value)

---

## 2. Authorization Core (`authz-core`)

### APIs

* [ ] **RBAC**

  * [ ] `GET /roles`
  * [ ] `POST /roles`
  * [ ] `PUT /roles/:roleId`
  * [ ] `DELETE /roles/:roleId`
  * [ ] `GET /permissions`
  * [ ] `POST /permissions`
  * [ ] `PUT /permissions/:permId`
  * [ ] `DELETE /permissions/:permId`
  * [ ] `POST /roles/:roleId/permissions`
  * [ ] `DELETE /roles/:roleId/permissions/:permId`
  * [ ] `GET /users/:userId/roles`
  * [ ] `POST /users/:userId/roles`
  * [ ] `DELETE /users/:userId/roles/:roleId`
* [ ] **ABAC**

  * [ ] `GET /attributes`
  * [ ] `POST /attributes`
  * [ ] `PUT /attributes/:attrId`
  * [ ] `DELETE /attributes/:attrId`
  * [ ] `GET /resources/:resourceId/attributes`
  * [ ] `POST /resources/:resourceId/attributes`
* [ ] **Policy Administration**

  * [ ] `GET /policies`
  * [ ] `POST /policies`
  * [ ] `PUT /policies/:policyId`
  * [ ] `DELETE /policies/:policyId`
* [ ] **PDP Engine**

  * [ ] `POST /pdp/evaluate`
  * [ ] `GET /pdp/policies`
* [ ] **PEP Guard**

  * [ ] `POST /pep/enforce`
  * [ ] `GET /pep/metrics`

### Database Schemas

* [ ] `roles` (role\_id, name, description)
* [ ] `permissions` (perm\_id, name, description)
* [ ] `role_permissions` (role\_id, perm\_id)
* [ ] `user_roles` (user\_id, role\_id)
* [ ] `attributes` (attr\_id, name, description)
* [ ] `attribute_values` (value\_id, attr\_id, value)
* [ ] `subject_attributes` (subject\_id, attr\_id, value\_id)
* [ ] `resource_attributes` (resource\_id, attr\_id, value\_id)
* [ ] `policies` (policy\_id, name, definition, version)
* [ ] `policy_metadata` (policy\_id, owner, created\_at, status)
* [ ] `pdp_cache` (policy\_id, compiled\_rules, last\_loaded)
* [ ] `decision_logs` (request\_id, policy\_id, decision, evaluated\_at)
* [ ] `pep_logs` (pep\_id, request\_id, enforcement\_time, outcome)

---

## 3. Access Models (`access-models`)

### APIs

* [ ] **ACL Service**

  * [ ] `GET /acl/entries`
  * [ ] `POST /acl/entries`
  * [ ] `PUT /acl/entries/:entryId`
  * [ ] `DELETE /acl/entries/:entryId`
  * [ ] `GET /acl/resources/:resourceId`
* [ ] **MAC Service**

  * [ ] `GET /labels`
  * [ ] `POST /labels`
  * [ ] `PUT /labels/:labelId`
  * [ ] `DELETE /labels/:labelId`
* [ ] **GBAC Service**

  * [ ] `GET /graph/nodes`
  * [ ] `POST /graph/nodes`
  * [ ] `PUT /graph/nodes/:nodeId`
  * [ ] `DELETE /graph/nodes/:nodeId`
  * [ ] `GET /graph/edges`
  * [ ] `POST /graph/edges`

### Database Schemas

* [ ] `acl_entries` (entry\_id, user\_or\_group, resource\_id, permissions)
* [ ] `acl_logs` (entry\_id, change\_type, changed\_by, changed\_at)
* [ ] `security_labels` (label\_id, name, level)
* [ ] `label_hierarchy` (parent\_label\_id, child\_label\_id)
* [ ] `object_labels` (object\_id, label\_id)
* [ ] `graph_nodes` (node\_id, type, properties)
* [ ] `graph_edges` (edge\_id, from\_node, to\_node, relation\_type)

---

## 4. Device & Session Management (`session-service`)

### APIs

* [ ] **Device Manager**

  * [ ] `GET /devices`
  * [ ] `POST /devices`
  * [ ] `PUT /devices/:deviceId`
  * [ ] `DELETE /devices/:deviceId`
* [ ] **Session Service**

  * [ ] `GET /sessions/active`
  * [ ] `POST /sessions/start`
  * [ ] `POST /sessions/end`
  * [ ] `GET /sessions/:sessionId`

### Database Schemas

* [ ] `devices` (device\_id, user\_id, device\_info)
* [ ] `device_sessions` (session\_id, device\_id, user\_id, active\_flag, last\_seen)

---

## 5. Audit & Logging (`audit-service`)

### APIs

* [ ] `GET /audit/events`
* [ ] `POST /audit/events`
* [ ] `GET /logs`
* [ ] `GET /logs/search`
* [ ] `DELETE /logs/:logId`

### Database Schemas

* [ ] `audit_records` (record\_id, service\_name, event\_type, payload, timestamp)
* [ ] `log_streams` (stream\_id, name, retention\_policy)

---

*Mark each checkbox when the corresponding API or schema is implemented.*



 | Service                             | Code Name         | Notes                                                                                  |
 | ----------------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
 | Authentication Service              | `auth-service`    | Vertical slice: user login, password resets ([Software Engineering Stack Exchange][1]) |
 | OAuth2/OIDC Provider Service        | `oidc-provider`   | Issue and validate tokens; avoids generic “oauth-service” ([Novanet blog][2])          |
 | User Management Service             | `user-management` | CRUD on user profiles, preferences ([Software Engineering Stack Exchange][1])          |
 | Role & Permission Service (RBAC)    | `rbac-service`    | Manage roles, permissions, assignments ([Reddit][3])                                   |
 | Attribute Service (ABAC)            | `abac-service`    | Store and retrieve attribute/key–value pairs ([Novanet blog][2])                       |
 | Policy Administration Service (PAP) | `policy-admin`    | Create, version policies; admin UI interactions ([DEV Community][4])                   |
 | Policy Decision Point (PDP)         | `pdp-engine`      | Stateless evaluation engine; `-engine` suffix clarifies role ([Stack Overflow][5])     |
 | Policy Enforcement Point (PEP)      | `pep-guard`       | Hooks into apps, enforces PDP decisions ([Restful API][6])                             |
 | Access Control List Service (DAC)   | `acl-service`     | Direct ACL lookups                                                                     |
 | Security Labeling Service (MAC)     | `mac-service`     | Mandatory labels enforcement ([Medium][7])                                             |
 | Graph Enforcement Service (GBAC)    | `gbac-service`    | Relationship‑heavy access checks                                                       |
 | Device Management Service           | `device-manager`  | Multi‑device sessions, single active session logic ([Stack Overflow][8])               |
 | Audit & Logging Service             | `audit-logging`   | Centralized, append‑only logs ([GeeksforGeeks][9])                                     |

[1]: https://softwareengineering.stackexchange.com/questions/348710/what-is-the-best-practice-when-it-comes-to-naming-microservices?utm_source=chatgpt.com "What is the best practice when it comes to naming microservices?"
[2]: https://blog.novanet.no/how-to-structure-your-microservice/?utm_source=chatgpt.com "How to structure your microservice - Novanet blog"
[3]: https://www.reddit.com/r/kubernetes/comments/1gqg6o2/seeking_best_practices_for_kubernetes_namespace/?utm_source=chatgpt.com "Seeking Best Practices for Kubernetes Namespace Naming ... - Reddit"
[4]: https://dev.to/slimcoder/microservices-naming-convention-2he8?utm_source=chatgpt.com "Microservices Naming Convention - DEV Community"
[5]: https://stackoverflow.com/questions/62951664/microservices-naming-convention-with-api-and-background-workers-messagebus-sche?utm_source=chatgpt.com "Microservices naming convention with API and background workers ..."
[6]: https://restfulapi.net/resource-naming/?utm_source=chatgpt.com "REST API URI Naming Conventions and Best Practices"
[7]: https://medium.com/russmiles/friends-dont-allow-friends-to-create-microservices-with-codenames-7350b5241cde?utm_source=chatgpt.com "Friends don't allow Friends to create Microservices with Codenames"
[8]: https://stackoverflow.com/questions/66609650/what-is-the-best-practice-to-make-microservice-aware-about-name-of-another-micro?utm_source=chatgpt.com "What is the best practice to make microservice aware about name of ..."
[9]: https://www.geeksforgeeks.org/naming-problem-in-microservice-system-design/?utm_source=chatgpt.com "Naming Problem in Microservices System Design - GeeksforGeeks"



| Context                          | Combined Services                                                         | Suggested Code Name | Database Name      |
| -------------------------------- | ------------------------------------------------------------------------- | ------------------- | ------------------ |
| **Identity & Access Management** | `auth-service`, `oidc-provider`, `user-management`                        | `iam-service`       | `iam_db`           |
| **Authorization Core**           | `rbac-service`, `abac-service`, `policy-admin`, `pdp-engine`, `pep-guard` | `authz-core`        | `authz_core_db`    |
| **Access Models**                | `acl-service`, `mac-service`, `gbac-service`                              | `access-models`     | `access_models_db` |
| **Device & Session Management**  | `device-manager`, (session logic from `auth-service`)                     | `session-service`   | `session_db`       |
| **Audit & Logging**              | `audit-logging`                                                           | `audit-service`     | `audit_db`         |


