from django.core.management.base import BaseCommand
from django.utils import timezone

from app_platform.models import (
    AuditLog,
    CarbonProject,
    Carrier,
    Company,
    Shipment,
    TrackingEvent,
    User,
    Vehicle,
)


class Command(BaseCommand):
    help = 'Seed demo data for the Green Logistique backend.'

    def handle(self, *args, **options):
        company, created = Company.objects.get_or_create(
            siret='12345678901234',
            defaults={
                'name': 'Green Logistique',
                'sector': 'Logistics',
                'green_score': 85,
                'carbon_balance': 1250.0,
                'certification_level': 'gold',
            },
        )

        if User.objects.filter(email='admin@greenlogistique.com').exists():
            self.stdout.write(self.style.WARNING('Demo data already exists.'))
            return

        admin = User.objects.create_superuser(
            email='admin@greenlogistique.com',
            password='Password123',
            name='Admin User',
            role='admin',
            company=company,
        )

        shipper = User.objects.create_user(
            email='shipper@cargo.com',
            password='Password123',
            name='Marie Bernard',
            role='shipper',
            company=company,
        )

        client = User.objects.create_user(
            email='client@retailco.com',
            password='Password123',
            name='Sophie Laurent',
            role='client',
            company=company,
        )

        carrier_user = User.objects.create_user(
            email='carrier@ecotrans.com',
            password='Password123',
            name='Pierre Martin',
            role='carrier',
            company=company,
        )

        carrier = Carrier.objects.create(
            user=carrier_user,
            green_certification='gold',
            green_score=92,
            zone='Central Europe',
            is_verified=True,
            rating=4.8,
            review_count=145,
        )

        vehicles = [
            Vehicle.objects.create(
                carrier=carrier,
                type='electric_truck',
                fuel_type='electric',
                co2_factor=10,
                capacity_kg=5000,
                plate='EC-001-BZ',
            ),
            Vehicle.objects.create(
                carrier=carrier,
                type='hybrid_truck',
                fuel_type='hybrid',
                co2_factor=35,
                capacity_kg=8000,
                plate='HY-002-BZ',
            ),
        ]

        shipment1 = Shipment.objects.create(
            shipper=shipper,
            client=client,
            carrier=carrier,
            origin='Paris, France',
            destination='Lyon, France',
            weight=500,
            volume=12,
            cargo_type='Electronics',
            transport_mode='road',
            status='in_transit',
            co2_kg=45.5,
            tracking_number='TRK-2026-0001',
            delivery_date=timezone.now().date(),
        )

        shipment2 = Shipment.objects.create(
            shipper=shipper,
            client=client,
            carrier=carrier,
            origin='Marseille, France',
            destination='Barcelona, Spain',
            weight=2000,
            volume=50,
            cargo_type='Food & Beverages',
            transport_mode='maritime',
            status='delivered',
            co2_kg=156,
            tracking_number='TRK-2026-0002',
            delivery_date=timezone.now().date(),
        )

        TrackingEvent.objects.bulk_create([
            TrackingEvent(
                shipment=shipment1,
                status='created',
                timestamp=timezone.now(),
                location='Paris Warehouse',
                message='Shipment created and registered',
            ),
            TrackingEvent(
                shipment=shipment1,
                status='in_transit',
                timestamp=timezone.now(),
                location='Orléans',
                message='In transit towards destination',
            ),
            TrackingEvent(
                shipment=shipment2,
                status='created',
                timestamp=timezone.now(),
                message='Shipment created',
            ),
            TrackingEvent(
                shipment=shipment2,
                status='delivered',
                timestamp=timezone.now(),
                location='Barcelona Port',
                message='Successfully delivered',
            ),
        ])

        CarbonProject.objects.bulk_create([
            CarbonProject(
                name='Amazon Reforestation',
                project_type='reforestation',
                location='Brazil',
                certification='Gold Standard',
                co2_tons_available=1200,
                price_per_ton=35.0,
                image='https://example.com/images/reforestation.jpg',
            ),
            CarbonProject(
                name='Solar Farm Expansion',
                project_type='solar',
                location='Spain',
                certification='VCS',
                co2_tons_available=900,
                price_per_ton=28.5,
                image='https://example.com/images/solar.jpg',
            ),
        ])

        AuditLog.objects.bulk_create([
            AuditLog(
                user=admin,
                action='login',
                resource='Authentication',
                details='Successful login from 127.0.0.1',
                status='success',
                ip_address='127.0.0.1',
            ),
            AuditLog(
                user=shipper,
                action='shipment_created',
                resource='Shipments',
                details='Created a new shipment request',
                status='success',
                ip_address='127.0.0.1',
            ),
        ])

        self.stdout.write(self.style.SUCCESS('Demo data created successfully.'))
