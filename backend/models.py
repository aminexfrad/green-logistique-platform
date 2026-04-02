from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Company(models.Model):
    name = models.CharField(max_length=255)
    siret = models.CharField(max_length=20, unique=True)
    sector = models.CharField(max_length=100)
    green_score = models.IntegerField(default=0)
    carbon_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    certification_level = models.CharField(
        max_length=10,
        choices=[
            ('bronze', 'Bronze'),
            ('silver', 'Silver'),
            ('gold', 'Gold'),
        ],
        default='bronze',
    )

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('shipper', 'Shipper'),
        ('carrier', 'Carrier'),
        ('client', 'Client'),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class Carrier(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='carrier_profile')
    green_certification = models.CharField(
        max_length=10,
        choices=[
            ('bronze', 'Bronze'),
            ('silver', 'Silver'),
            ('gold', 'Gold'),
        ],
        default='bronze',
    )
    green_score = models.IntegerField(default=0)
    zone = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    review_count = models.IntegerField(default=0)

    def __str__(self):
        return self.user.name


class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('diesel_truck', 'Diesel Truck'),
        ('electric_truck', 'Electric Truck'),
        ('hybrid_truck', 'Hybrid Truck'),
        ('van', 'Van'),
    ]
    FUEL_TYPE_CHOICES = [
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
        ('gnv', 'GNV'),
    ]

    carrier = models.ForeignKey(Carrier, on_delete=models.CASCADE, related_name='vehicles')
    type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPE_CHOICES)
    co2_factor = models.DecimalField(max_digits=8, decimal_places=2)
    capacity_kg = models.IntegerField()
    plate = models.CharField(max_length=20)

    def __str__(self):
        return self.plate


class Shipment(models.Model):
    TRANSPORT_MODE_CHOICES = [
        ('road', 'Road'),
        ('rail', 'Rail'),
        ('maritime', 'Maritime'),
        ('air', 'Air'),
        ('multimodal', 'Multimodal'),
    ]
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('incident', 'Incident'),
    ]

    shipper = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shipments')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_orders', null=True, blank=True)
    carrier = models.ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments')
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.DecimalField(max_digits=10, decimal_places=2)
    cargo_type = models.CharField(max_length=100)
    transport_mode = models.CharField(max_length=20, choices=TRANSPORT_MODE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    co2_kg = models.DecimalField(max_digits=10, decimal_places=2)
    tracking_number = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.tracking_number


class TrackingEvent(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='timeline')
    status = models.CharField(max_length=50)
    timestamp = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    message = models.TextField()

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.shipment.tracking_number} - {self.status}"


class CarbonProject(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('reforestation', 'Reforestation'),
        ('solar', 'Solar'),
        ('wind', 'Wind'),
        ('ocean', 'Ocean'),
    ]

    name = models.CharField(max_length=255)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    location = models.CharField(max_length=255)
    certification = models.CharField(max_length=100)
    co2_tons_available = models.IntegerField()
    price_per_ton = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)

    def __str__(self):
        return self.name


class AuditLog(models.Model):
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    resource = models.CharField(max_length=100)
    details = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - {self.action}"
