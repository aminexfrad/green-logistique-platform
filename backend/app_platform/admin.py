from django.contrib import admin
from .models import AuditLog, CarbonProject, Carrier, Company, Shipment, TrackingEvent, User, Vehicle

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'siret', 'sector', 'green_score', 'certification_level')
    search_fields = ('name', 'siret')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'company', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'name')

@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ('user', 'green_certification', 'green_score', 'zone', 'is_verified', 'rating')
    list_filter = ('green_certification', 'is_verified')
    search_fields = ('user__email', 'user__name', 'zone')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('carrier', 'type', 'fuel_type', 'capacity_kg', 'plate')
    search_fields = ('carrier__user__email', 'plate')

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'origin', 'destination', 'status', 'shipper', 'carrier', 'client', 'delivery_date')
    list_filter = ('status', 'transport_mode')
    search_fields = ('tracking_number', 'origin', 'destination')

@admin.register(TrackingEvent)
class TrackingEventAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'status', 'timestamp', 'location')
    search_fields = ('shipment__tracking_number', 'status')

@admin.register(CarbonProject)
class CarbonProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'project_type', 'location', 'certification', 'co2_tons_available', 'price_per_ton')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action', 'resource', 'status', 'ip_address')
    list_filter = ('status', 'action')
    search_fields = ('user__email', 'action', 'resource', 'details')
