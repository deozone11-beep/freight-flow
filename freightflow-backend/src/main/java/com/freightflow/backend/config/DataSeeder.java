package com.freightflow.backend.config;

import com.freightflow.backend.entity.*;
import com.freightflow.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WarehouseRegionRepository warehouseRegionRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final ProductRepository productRepository;
    private final PricingPlanRepository pricingPlanRepository;
    private final DeliveryChargeConfigRepository deliveryChargeConfigRepository;

    public DataSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       WarehouseRegionRepository warehouseRegionRepository,
                       VehicleRepository vehicleRepository,
                       WarehouseRepository warehouseRepository,
                       DriverProfileRepository driverProfileRepository,
                       ProductRepository productRepository,
                       PricingPlanRepository pricingPlanRepository,
                       DeliveryChargeConfigRepository deliveryChargeConfigRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.warehouseRegionRepository = warehouseRegionRepository;
        this.vehicleRepository = vehicleRepository;
        this.warehouseRepository = warehouseRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.productRepository = productRepository;
        this.pricingPlanRepository = pricingPlanRepository;
        this.deliveryChargeConfigRepository = deliveryChargeConfigRepository;
    }

    @Override
    public void run(String... args) {
        // Default admin login: username=admin, password=admin123 (CHANGE THIS after first login)
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Admin")
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
        }

        if (warehouseRegionRepository.count() == 0) {
            warehouseRegionRepository.save(WarehouseRegion.builder().region("North").occupancyPercent(82).status("Healthy").componentStock(4200).build());
            warehouseRegionRepository.save(WarehouseRegion.builder().region("West").occupancyPercent(74).status("Stable").componentStock(3100).build());
            warehouseRegionRepository.save(WarehouseRegion.builder().region("South").occupancyPercent(91).status("Critical").componentStock(2890).build());
            warehouseRegionRepository.save(WarehouseRegion.builder().region("East").occupancyPercent(68).status("Healthy").componentStock(2150).build());
        }

        if (vehicleRepository.count() == 0) {
            vehicleRepository.save(Vehicle.builder().vehicleNumber("TN-01-AB-1234").driverName("Ramesh Kumar").route("Chennai-Bangalore").status("Active").safetyScore(9.1).build());
            vehicleRepository.save(Vehicle.builder().vehicleNumber("TN-02-CD-5678").driverName("Suresh Babu").route("Chennai-Coimbatore").status("In Transit").safetyScore(8.7).build());
            vehicleRepository.save(Vehicle.builder().vehicleNumber("TN-03-EF-9012").driverName("Vijay Anand").route("Chennai-Madurai").status("Maintenance").safetyScore(7.9).build());
        }

        // --- Rental / logistics marketplace demo data ---

        Warehouse warehouse = null;
        if (warehouseRepository.count() == 0) {
            warehouse = warehouseRepository.save(Warehouse.builder()
                    .name("Chennai Central Warehouse")
                    .address("Pallavaram, Chennai, Tamil Nadu")
                    .latitude(12.9675)
                    .longitude(80.1491)
                    .status("Active")
                    .build());
        } else {
            warehouse = warehouseRepository.findAll().get(0);
        }

        User manager = ensureUser("manager1", "manager123", "Warehouse Manager - Chennai", "WAREHOUSE_MANAGER");
        if (warehouse.getManagerUserId() == null) {
            warehouse.setManagerUserId(manager.getId());
            warehouseRepository.save(warehouse);
        }

        User driverUser = ensureUser("driver1", "driver123", "Driver - Ramesh Kumar", "DRIVER");
        if (driverProfileRepository.findByUserId(driverUser.getId()).isEmpty()) {
            driverProfileRepository.save(DriverProfile.builder()
                    .userId(driverUser.getId())
                    .vehicleNumber("TN-01-AB-1234")
                    .phone("9840000001")
                    .homeWarehouseId(warehouse.getId())
                    .status("AVAILABLE")
                    .build());
        }

        User customer = ensureUser("customer1", "customer123", "Demo Customer Pvt Ltd", "CUSTOMER");
        User company = ensureUser("company1", "company123", "Demo Buyer Company Pvt Ltd", "COMPANY");

        if (productRepository.findByOwnerUserId(customer.getId()).isEmpty()) {
            Product product = productRepository.save(Product.builder()
                    .name("Packaged Rice Bags")
                    .category("Grocery")
                    .unit("bag")
                    .description("25kg packaged rice bags")
                    .ownerUserId(customer.getId())
                    .build());

            if (pricingPlanRepository.findAllByOrderByIdDesc().isEmpty()) {
                pricingPlanRepository.save(PricingPlan.builder().productId(null).packType("DAILY").minQuantity(1).ratePerUnit(2.0).active(true).build());
                pricingPlanRepository.save(PricingPlan.builder().productId(null).packType("MONTHLY").minQuantity(1).ratePerUnit(45.0).active(true).build());
                pricingPlanRepository.save(PricingPlan.builder().productId(null).packType("YEARLY").minQuantity(1).ratePerUnit(400.0).active(true).build());
                pricingPlanRepository.save(PricingPlan.builder().productId(product.getId()).packType("DAILY").minQuantity(100).ratePerUnit(1.5).active(true).build());
            }
        }

        if (deliveryChargeConfigRepository.count() == 0) {
            deliveryChargeConfigRepository.save(DeliveryChargeConfig.builder()
                    .baseFare(50.0)
                    .perKmRate(12.0)
                    .serviceCharge(20.0)
                    .build());
        }
    }

    private User ensureUser(String username, String rawPassword, String fullName, String role) {
        return userRepository.findByUsername(username).orElseGet(() ->
                userRepository.save(User.builder()
                        .username(username)
                        .password(passwordEncoder.encode(rawPassword))
                        .fullName(fullName)
                        .role(role)
                        .mustChangePassword(false)
                        .build()));
    }
}
