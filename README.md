# Microservices Implementation Checklist

Below is a comprehensive checklist for each **Combined Service Name**, including their **APIs** and **Database Tables**. Mark each item with an `x` when completed.

---

## IdentityService

### APIs

* [ ] `POST /auth/login`
* [ ] `POST /auth/logout`
* [ ] `POST /oauth/authorize`
* [ ] `POST /oauth/token`
* [ ] `GET /sessions`
* [ ] `DELETE /sessions/{id}`

### Database Tables

* [ ] `users`
* [ ] `sessions`
* [ ] `clients`
* [ ] `authorization_codes`
* [ ] `access_tokens`
* [ ] `refresh_tokens`

---

## AccessControlService

### APIs

* [ ] `GET /roles`
* [ ] `POST /roles`
* [ ] `GET /permissions`
* [ ] `POST /permissions`
* [ ] `GET /attributes`
* [ ] `POST /attributes`
* [ ] `GET /acl`
* [ ] `POST /acl`

### Database Tables

* [ ] `roles`
* [ ] `permissions`
* [ ] `role_assignments`
* [ ] `attributes`
* [ ] `attribute_values`
* [ ] `acl_entries`

---

## PolicyService

### APIs

* [ ] `GET /policies`
* [ ] `POST /policies`
* [ ] `GET /policies/{id}/versions`
* [ ] `POST /evaluate`
* [ ] `GET /decisions`
* [ ] `POST /enforce`

### Database Tables

* [ ] `policies`
* [ ] `policy_versions`
* [ ] `decision_logs`
* [ ] `enforcement_logs`

---

## SecurityGraphService

### APIs

* [ ] `GET /labels`
* [ ] `POST /labels`
* [ ] `GET /nodes`
* [ ] `POST /nodes`
* [ ] `GET /edges`
* [ ] `POST /edges`

### Database Tables

* [ ] `security_labels`
* [ ] `label_assignments`
* [ ] `nodes`
* [ ] `edges`

---

## UserDeviceService

### APIs

* [ ] `GET /profiles`
* [ ] `POST /profiles`
* [ ] `GET /devices`
* [ ] `POST /devices`

### Database Tables

* [ ] `user_profiles`
* [ ] `user_settings`
* [ ] `devices`
* [ ] `device_status`

---

## LoggingService

### APIs

* [ ] `GET /logs`
* [ ] `POST /logs`

### Database Tables

* [ ] `audit_logs`
* [ ] `log_metadata`

---

 