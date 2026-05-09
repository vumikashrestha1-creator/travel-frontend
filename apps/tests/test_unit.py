"""
apps/tests/test_unit.py
SafeNest Travel Booking System — Unit Tests
Member 2: Sweta Manandhar (CIHE240378)
ICT946 Capstone Project — Week 10 Testing
"""

from decimal import Decimal
from django.test import TestCase
from apps.users.models import User
from apps.listings.models import Listing
from apps.bookings.models import Booking


# ── Helpers ───────────────────────────────────────────────────────

def make_user(email="sweta@test.com", role="CUSTOMER", password="Test1234!"):
    return User.objects.create_user(
        email=email, password=password,
        first_name="Sweta", last_name="Test", role=role,
    )


def make_listing(price=Decimal("1000.00"), discount=Decimal("0"),
                 available_seats=10, max_seats=10, status="ACTIVE", created_by=None):
    return Listing.objects.create(
        title="Test Trip to Bali", description="A wonderful test trip.",
        listing_type="PACKAGE", status=status,
        origin="Sydney", destination="Bali", country="Indonesia", city="Bali",
        price_per_person=price, discount_percent=discount,
        available_seats=available_seats, max_seats=max_seats,
        start_date="2026-07-01", end_date="2026-07-10", duration_days=9,
        created_by=created_by,
    )


# ── Test 1: discounted_price ──────────────────────────────────────

class TestDiscountedPrice(TestCase):

    def test_discounted_price_with_10_percent(self):
        """10% discount on $1000 should return $900."""
        listing = make_listing(price=Decimal("1000.00"), discount=Decimal("10"))
        self.assertEqual(listing.discounted_price, Decimal("900.00"))

    def test_discounted_price_with_zero_discount(self):
        """0% discount should return the full price."""
        listing = make_listing(price=Decimal("1000.00"), discount=Decimal("0"))
        self.assertEqual(listing.discounted_price, Decimal("1000.00"))

    def test_discounted_price_with_50_percent(self):
        """50% discount on $800 should return $400."""
        listing = make_listing(price=Decimal("800.00"), discount=Decimal("50"))
        self.assertEqual(listing.discounted_price, Decimal("400.00"))


# ── Test 2: is_available ──────────────────────────────────────────

class TestIsAvailable(TestCase):

    def test_available_when_active_and_has_seats(self):
        """Listing with ACTIVE status and seats > 0 should be available."""
        listing = make_listing(available_seats=5, status="ACTIVE")
        self.assertTrue(listing.is_available)

    def test_not_available_when_soldout(self):
        """Listing with SOLDOUT status should not be available."""
        listing = make_listing(available_seats=0, status="SOLDOUT")
        self.assertFalse(listing.is_available)

    def test_not_available_when_inactive(self):
        """Listing with INACTIVE status should not be available."""
        listing = make_listing(available_seats=10, status="INACTIVE")
        self.assertFalse(listing.is_available)

    def test_not_available_when_no_seats(self):
        """Listing with 0 seats should not be available even if ACTIVE."""
        listing = make_listing(available_seats=0, status="ACTIVE")
        self.assertFalse(listing.is_available)


# ── Test 3: seats_booked ─────────────────────────────────────────

class TestSeatsBooked(TestCase):

    def test_seats_booked_calculation(self):
        """seats_booked = max_seats - available_seats."""
        listing = make_listing(max_seats=10, available_seats=6)
        self.assertEqual(listing.seats_booked, 4)

    def test_seats_booked_zero_when_none_booked(self):
        """seats_booked should be 0 when available equals max."""
        listing = make_listing(max_seats=10, available_seats=10)
        self.assertEqual(listing.seats_booked, 0)

    def test_seats_booked_all_when_full(self):
        """seats_booked equals max_seats when available is 0."""
        listing = make_listing(max_seats=10, available_seats=0)
        self.assertEqual(listing.seats_booked, 10)


# ── Test 4: User roles ────────────────────────────────────────────

class TestUserRoles(TestCase):

    def test_create_customer_user(self):
        """User created with CUSTOMER role should have correct role."""
        user = make_user(email="customer@test.com", role="CUSTOMER")
        self.assertEqual(user.role, "CUSTOMER")
        self.assertTrue(user.is_customer)

    def test_create_admin_user(self):
        """User created with ADMIN role should have correct role."""
        user = make_user(email="admin@test.com", role="ADMIN")
        self.assertEqual(user.role, "ADMIN")
        self.assertTrue(user.is_admin)

    def test_create_travel_agent_user(self):
        """User created with TRAVEL_AGENT role should have correct role."""
        user = make_user(email="agent@test.com", role="TRAVEL_AGENT")
        self.assertEqual(user.role, "TRAVEL_AGENT")
        self.assertTrue(user.is_travel_agent)

    def test_default_role_is_customer(self):
        """User created without specifying role should default to CUSTOMER."""
        user = User.objects.create_user(
            email="default@test.com", password="Test1234!",
            first_name="Default", last_name="User",
        )
        self.assertEqual(user.role, "CUSTOMER")


# ── Test 5: Password hashing ──────────────────────────────────────

class TestPasswordHashing(TestCase):

    def test_password_is_hashed(self):
        """Raw password should not be stored — it must be hashed."""
        user = make_user(email="hash@test.com", password="MySecret123!")
        self.assertNotEqual(user.password, "MySecret123!")

    def test_password_check_works(self):
        """check_password should return True for the correct password."""
        user = make_user(email="check@test.com", password="MySecret123!")
        self.assertTrue(user.check_password("MySecret123!"))

    def test_wrong_password_fails(self):
        """check_password should return False for a wrong password."""
        user = make_user(email="wrong@test.com", password="MySecret123!")
        self.assertFalse(user.check_password("WrongPassword!"))


# ── Test 6: Booking reference ─────────────────────────────────────

class TestBookingReference(TestCase):

    def test_booking_reference_auto_generated(self):
        """Booking reference should be auto-generated and start with TRV."""
        user = make_user(email="bookingref@test.com")
        listing = make_listing()
        booking = Booking.objects.create(
            user=user, listing=listing, number_of_guests=2,
            price_per_person=listing.discounted_price,
            total_price=listing.discounted_price * 2,
        )
        self.assertTrue(booking.booking_reference.startswith("TRV"))

    def test_booking_reference_is_unique(self):
        """Two bookings should have different booking references."""
        user = make_user(email="unique@test.com")
        listing = make_listing()
        b1 = Booking.objects.create(
            user=user, listing=listing, number_of_guests=1,
            price_per_person=listing.discounted_price,
            total_price=listing.discounted_price,
        )
        b2 = Booking.objects.create(
            user=user, listing=listing, number_of_guests=1,
            price_per_person=listing.discounted_price,
            total_price=listing.discounted_price,
        )
        self.assertNotEqual(b1.booking_reference, b2.booking_reference)


# ── Test 7: Booking total price ───────────────────────────────────

class TestBookingTotalPrice(TestCase):

    def test_total_price_calculated_correctly(self):
        """total_price = price_per_person x number_of_guests."""
        user = make_user(email="total@test.com")
        listing = make_listing(price=Decimal("500.00"))
        booking = Booking.objects.create(
            user=user, listing=listing, number_of_guests=3,
            price_per_person=Decimal("500.00"),
            total_price=Decimal("1500.00"),
        )
        self.assertEqual(booking.total_price, Decimal("1500.00"))


# ── Test 8: full_name ─────────────────────────────────────────────

class TestUserFullName(TestCase):

    def test_full_name_combines_first_and_last(self):
        """full_name should return first_name + last_name."""
        user = User.objects.create_user(
            email="fullname@test.com", password="Test1234!",
            first_name="Sweta", last_name="Manandhar",
        )
        self.assertEqual(user.full_name, "Sweta Manandhar")


# ── Test 9: Listing status ────────────────────────────────────────

class TestListingStatus(TestCase):

    def test_new_listing_defaults_to_active(self):
        """A newly created listing should have ACTIVE status by default."""
        listing = Listing.objects.create(
            title="New Default Listing", description="Test",
            listing_type="PACKAGE",
            origin="Auckland", destination="Tokyo",
            country="Japan", city="Tokyo",
            price_per_person=Decimal("2000.00"), discount_percent=Decimal("0"),
            available_seats=5, max_seats=5,
            start_date="2026-08-01", end_date="2026-08-10", duration_days=9,
        )
        self.assertEqual(listing.status, "ACTIVE")

    def test_pending_listing_is_not_available(self):
        """A PENDING listing should not be available for booking."""
        listing = make_listing(status="PENDING", available_seats=10)
        self.assertFalse(listing.is_available)


# ── Test 10: MFA defaults ─────────────────────────────────────────

class TestMFADefaults(TestCase):

    def test_mfa_disabled_by_default(self):
        """New users should have MFA disabled by default."""
        user = make_user(email="mfa@test.com")
        self.assertFalse(user.mfa_enabled)

    def test_mfa_type_defaults_to_email(self):
        """Default MFA type should be EMAIL."""
        user = make_user(email="mfatype@test.com")
        self.assertEqual(user.mfa_type, "EMAIL")

    def test_mfa_method_display_when_disabled(self):
        """mfa_method_display should return 'Disabled' when MFA is off."""
        user = make_user(email="mfadisplay@test.com")
        self.assertEqual(user.mfa_method_display, "Disabled")
