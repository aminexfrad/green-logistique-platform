from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AuditLog, CarbonProject, Carrier, Company, Shipment, User, Vehicle
from .serializers import (
    AuditLogSerializer,
    CarbonProjectSerializer,
    CarrierSerializer,
    ShipmentSerializer,
    UserSerializer,
    VehicleSerializer,
)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        user = authenticate(request, username=email, password=password)

        if not user or not user.is_active:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        first_name = request.data.get('firstName', '').strip()
        last_name = request.data.get('lastName', '').strip()
        company_name = request.data.get('companyName', '').strip()
        siret = request.data.get('siret', '').strip()
        sector = request.data.get('sector', '').strip()
        role = request.data.get('role', 'client')

        if not email or not password or not first_name or not last_name or not company_name:
            return Response({'message': 'All required fields must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'message': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if siret and Company.objects.filter(siret=siret).exists():
            return Response({'message': 'A company with this SIRET number already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.create(
                name=company_name,
                siret=siret or 'unknown',
                sector=sector or 'general',
            )
        except IntegrityError:
            return Response({'message': 'Unable to create company; the SIRET number is already in use.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            password=password,
            name=f'{first_name} {last_name}',
            role=role,
            company=company,
        )

        if role == 'carrier':
            Carrier.objects.create(user=user, zone='Unknown', is_verified=False, green_score=0, rating=0.0)

        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.select_related('company').all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]


class CarrierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Carrier.objects.select_related('user').prefetch_related('vehicles').all()
    serializer_class = CarrierSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VehicleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'carrier' and hasattr(user, 'carrier_profile'):
            return Vehicle.objects.filter(carrier=user.carrier_profile)
        if user.role == 'admin':
            return Vehicle.objects.all()
        return Vehicle.objects.none()


class ShipmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShipmentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Shipment.objects.select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        if user.role == 'shipper':
            return Shipment.objects.filter(shipper=user).select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        if user.role == 'carrier' and hasattr(user, 'carrier_profile'):
            return Shipment.objects.filter(carrier=user.carrier_profile).select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        if user.role == 'client':
            return Shipment.objects.filter(client=user).select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        return Shipment.objects.none()


class OrderListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'client':
            shipments = Shipment.objects.filter(client=user).select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        elif user.role == 'admin':
            shipments = Shipment.objects.all().select_related('shipper', 'client', 'carrier__user').prefetch_related('timeline')
        else:
            return Response({'message': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(ShipmentSerializer(shipments, many=True).data)


class TrackShipmentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tracking_number = request.query_params.get('trackingNumber') or request.query_params.get('tracking_number')
        if not tracking_number:
            return Response({'message': 'Tracking number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        shipment = Shipment.objects.filter(tracking_number__iexact=tracking_number).select_related('carrier__user').prefetch_related('timeline').first()
        if not shipment:
            return Response({'message': 'Shipment not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(ShipmentSerializer(shipment).data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related('user').all()
    serializer_class = AuditLogSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]


class CarbonProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarbonProject.objects.all()
    serializer_class = CarbonProjectSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
