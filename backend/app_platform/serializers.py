from rest_framework import serializers
from .models import AuditLog, CarbonProject, Carrier, Company, Shipment, TrackingEvent, User, Vehicle


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'siret', 'sector', 'green_score', 'carbon_balance', 'certification_level']


class UserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'company', 'is_active', 'created_at']


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'type', 'fuel_type', 'co2_factor', 'capacity_kg', 'plate']


class CarrierSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vehicles = VehicleSerializer(many=True, read_only=True)

    class Meta:
        model = Carrier
        fields = ['id', 'user', 'green_certification', 'green_score', 'zone', 'is_verified', 'rating', 'review_count', 'vehicles']


class TrackingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEvent
        fields = ['id', 'status', 'timestamp', 'location', 'latitude', 'longitude', 'message']


class ShipmentSerializer(serializers.ModelSerializer):
    carrier = CarrierSerializer(read_only=True)
    timeline = TrackingEventSerializer(many=True, read_only=True)
    shipper = UserSerializer(read_only=True)
    client = UserSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = [
            'id',
            'tracking_number',
            'origin',
            'destination',
            'weight',
            'volume',
            'cargo_type',
            'transport_mode',
            'status',
            'co2_kg',
            'created_at',
            'delivery_date',
            'carrier',
            'shipper',
            'client',
            'timeline',
        ]


class CarbonProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarbonProject
        fields = ['id', 'name', 'project_type', 'location', 'certification', 'co2_tons_available', 'price_per_ton', 'image']


class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'timestamp', 'user', 'action', 'resource', 'details', 'status', 'ip_address']
