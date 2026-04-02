# Backend Actor Mapping and Django/MySQL Schema

## Real platform actors

- `admin`
  - Manage platform users
  - Validate and monitor carriers
  - Review audit logs
  - Access admin dashboard metrics
- `shipper`
  - Create and manage shipments
  - Browse and select carriers
  - View carbon and ESG reports
  - Access shipper dashboard and shipments list
- `carrier`
  - Receive and accept/reject missions
  - Manage fleet and vehicle details
  - View carrier profile
  - Access carrier dashboard and mission workflow
- `client`
  - Track shipments
  - View orders
  - Review environmental impact
  - Submit feedback

## Current frontend route access by actor

- `admin`
  - `/dashboard/admin`
  - `/dashboard/admin/users`
  - `/dashboard/admin/carriers`
  - `/dashboard/admin/audit-logs`
- `shipper`
  - `/dashboard/shipper`
  - `/dashboard/shipper/shipments`
  - `/dashboard/shipper/carriers`
  - `/dashboard/shipper/carbon`
  - `/dashboard/shipper/reports`
- `carrier`
  - `/dashboard/carrier`
  - `/dashboard/carrier/missions`
  - `/dashboard/carrier/fleet`
  - `/dashboard/carrier/profile`
- `client`
  - `/dashboard/client/track`
  - `/dashboard/client/orders`
  - `/dashboard/client/impact`
  - `/dashboard/client/feedback`

Additional shared pages:
- `/dashboard/notifications`
- `/dashboard/settings`

## Recommended role and permission model

- `Role` enum: `ADMIN`, `SHIPPER`, `CARRIER`, `CLIENT`
- `User` model should include:
  - email, name, role, company
  - is_active, is_staff, is_superuser
  - optional profile fields depending on role
- Permissions should map to internal groups or custom Django permissions for:
  - user administration (`admin.manage_users`)
  - carrier validation (`admin.validate_carriers`)
  - audit log review (`admin.view_audit_logs`)
  - shipment CRUD for shippers
  - mission management for carriers
  - client shipment tracking and order viewing

## Django model schema

### `companies.Company`
- `name`: `CharField(max_length=255)`
- `siret`: `CharField(max_length=20, unique=True)`
- `sector`: `CharField(max_length=100)`
- `green_score`: `IntegerField(default=0)`
- `carbon_balance`: `DecimalField(max_digits=10, decimal_places=2, default=0.0)`
- `certification_level`: `CharField(max_length=10, choices=[('bronze', 'Bronze'), ('silver', 'Silver'), ('gold', 'Gold')])`

### `users.User` (custom user)
- `email`: `EmailField(unique=True)`
- `name`: `CharField(max_length=255)`
- `role`: `CharField(max_length=10, choices=[('admin','Admin'), ('shipper','Shipper'), ('carrier','Carrier'), ('client','Client')])`
- `company`: `ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)`
- `is_active`, `is_staff`, `is_superuser`
- `created_at`: `DateTimeField(auto_now_add=True)`
- `updated_at`: `DateTimeField(auto_now=True)`

### `logistics.Carrier`
- `user`: `OneToOneField(User, on_delete=models.CASCADE, related_name='carrier_profile')`
- `green_certification`: `CharField(max_length=10, choices=[('bronze','Bronze'), ('silver','Silver'), ('gold','Gold')])`
- `green_score`: `IntegerField(default=0)`
- `zone`: `CharField(max_length=100)`
- `is_verified`: `BooleanField(default=False)`
- `rating`: `DecimalField(max_digits=3, decimal_places=2, default=0.0)`
- `review_count`: `IntegerField(default=0)`

### `logistics.Vehicle`
- `carrier`: `ForeignKey(Carrier, on_delete=models.CASCADE, related_name='vehicles')`
- `type`: `CharField(max_length=20, choices=[('diesel_truck','Diesel Truck'), ('electric_truck','Electric Truck'), ('hybrid_truck','Hybrid Truck'), ('van','Van')])`
- `fuel_type`: `CharField(max_length=20, choices=[('diesel','Diesel'), ('electric','Electric'), ('hybrid','Hybrid'), ('gnv','GNV')])`
- `co2_factor`: `DecimalField(max_digits=8, decimal_places=2)`
- `capacity_kg`: `IntegerField()`
- `plate`: `CharField(max_length=20)`

### `logistics.Shipment`
- `shipper`: `ForeignKey(User, on_delete=models.CASCADE, related_name='shipments')`
- `client`: `ForeignKey(User, on_delete=models.CASCADE, related_name='client_orders', null=True, blank=True)`
- `carrier`: `ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments')`
- `origin`, `destination`: `CharField(max_length=255)`
- `weight`: `DecimalField(max_digits=10, decimal_places=2)`
- `volume`: `DecimalField(max_digits=10, decimal_places=2)`
- `cargo_type`: `CharField(max_length=100)`
- `transport_mode`: `CharField(max_length=20, choices=[('road','Road'), ('rail','Rail'), ('maritime','Maritime'), ('air','Air'), ('multimodal','Multimodal')])`
- `status`: `CharField(max_length=20, choices=[('created','Created'), ('in_transit','In Transit'), ('delivered','Delivered'), ('cancelled','Cancelled'), ('incident','Incident')])`
- `co2_kg`: `DecimalField(max_digits=10, decimal_places=2)`
- `tracking_number`: `CharField(max_length=40, unique=True)`
- `created_at`: `DateTimeField(auto_now_add=True)`
- `delivery_date`: `DateField(null=True, blank=True)`

### `logistics.TrackingEvent`
- `shipment`: `ForeignKey(Shipment, on_delete=models.CASCADE, related_name='timeline')`
- `status`: `CharField(max_length=50)`
- `timestamp`: `DateTimeField()`
- `location`: `CharField(max_length=255, blank=True)`
- `latitude`, `longitude`: `DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)`
- `message`: `TextField()`

### `carbon.CarbonProject`
- `name`: `CharField(max_length=255)`
- `project_type`: `CharField(max_length=20, choices=[('reforestation','Reforestation'), ('solar','Solar'), ('wind','Wind'), ('ocean','Ocean')])`
- `location`: `CharField(max_length=255)`
- `certification`: `CharField(max_length=100)`
- `co2_tons_available`: `IntegerField()`
- `price_per_ton`: `DecimalField(max_digits=10, decimal_places=2)`
- `image`: `URLField(blank=True)`

### `audit.AuditLog`
- `user`: `ForeignKey(User, on_delete=models.SET_NULL, null=True)`
- `action`: `CharField(max_length=100)`
- `resource`: `CharField(max_length=100)`
- `details`: `TextField()`
- `status`: `CharField(max_length=20, choices=[('success','Success'), ('warning','Warning'), ('error','Error')])`
- `ip_address`: `GenericIPAddressField(blank=True, null=True)`
- `timestamp`: `DateTimeField(auto_now_add=True)`

## MySQL readiness notes

- Use `utf8mb4` charset for multi-language support
- Add indexes on `User.email`, `Shipment.tracking_number`, `Carrier.is_verified`, and `AuditLog.timestamp`
- Use `ForeignKey` constraints to preserve referential integrity
- Normalize company and carrier details to separate tables for reuse

## Next recommended step

1. Add a Django app with `users`, `logistics`, `carbon`, and `audit` apps.
2. Implement a custom `User` model with role-based group/permission mapping.
3. Use these Django models to expose API endpoints for the frontend roles:
   - `/api/auth/login`
   - `/api/shipments/`
   - `/api/carriers/`
   - `/api/missions/`
   - `/api/client/orders/`
   - `/api/audit-logs/`
4. Align frontend auth cookie names and route guard checks with the backend session/auth response.
