-- Seed data for CTP RED Corp Database
-- Run this after creating the schema

USE ctpredcorp_db;

-- ===== INSERT BUILDINGS =====
INSERT INTO buildings (id, name, display_name, location, short_location, description, stats, building_hours, contact, hero_image, badge, cta_title, cta_description)
VALUES 
(
  'ctp-red-corp',
  'CTP Red Corp',
  'CTP Asean Tower',
  'Filinvest City, Alabang, Muntinlupa',
  'Downtown Business District',
  JSON_ARRAY(
    'Situated on Asean Drive in Filinvest City, Alabang, Muntinlupa City, CTP Asean is positioned within a masterfully planned development that emphasizes sustainability and modern living.',
    'Filinvest City is a flagship project renowned for its strategic connectivity and accessibility, serving as a major gateway for commuters and a dynamic business district attracting multinational corporations and BPO companies.',
    'CTP Asean is a Grade A, 13-storey office building developed by CTP R.E.D. III Corp. It offers a substantial Net Leasable Area of 24,933 square meters, indicating a large-scale, modern facility designed to accommodate various business and organizations.'
  ),
  JSON_OBJECT('totalFloors', 1, 'totalUnits', 1, 'occupancyRate', 0, 'availableUnits', 1),
  JSON_OBJECT('weekdays', '6:00 AM - 10:00 PM', 'saturday', '8:00 AM - 8:00 PM', 'sunday', '10:00 AM - 6:00 PM', 'security', '24/7'),
  JSON_OBJECT('phone', '(02) 8334-2091', 'email', 'aseantower@ctpred.com.ph', 'address', 'Block 3 Lot 3 Spectrum Filinvest, Alabang, Muntinlupa 1780'),
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Premium Location',
  'Explore Premium Office Solutions',
  'Discover the perfect workspace for your business in our modern facility with state-of-the-art amenities and prime location.'
),
(
  'ctp-alpha-tower',
  'CTP Alpha Tower',
  'CTP Alpha Tower',
  'Makati Central Business District',
  'Makati Central Business District',
  JSON_ARRAY(
    'Located on Investment Drive within Madrigal Business Park, Alabang, Muntinlupa City, CTP Alpha benefits from its position in one of Metro Manila\'s premier business hubs.',
    'The estate also provides essential business support services and boasts a diverse tenant mix, fostering a vibrant and dynamic environment for local enterprises and international corporations alike.',
    'CTP Alpha is classified as a Class B building, completed in 2014 by CTP R.E.D. 1 Corp. This 12-storey structure offers a typical floor area of 454.59 square meters.'
  ),
  JSON_OBJECT('totalFloors', 1, 'totalUnits', 1, 'occupancyRate', 0, 'availableUnits', 1),
  JSON_OBJECT('weekdays', '5:30 AM - 11:00 PM', 'saturday', '7:00 AM - 9:00 PM', 'sunday', '9:00 AM - 7:00 PM', 'security', '24/7'),
  JSON_OBJECT('phone', '(555) 234-ALPHA', 'email', 'alpha@ctpredcorp.com', 'address', 'Makati Central Business District'),
  'https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Alpha Class Building',
  'Experience Alpha-Class Excellence',
  'Join the elite companies that have chosen CTP Alpha Tower as their headquarters.'
),
(
  'ctp-bf-building',
  'CTP BF Building',
  'CTP BF Building',
  'Bonifacio Global City',
  'Bonifacio Global City',
  JSON_ARRAY(
    'CTP BF Building offers modern office solutions in the heart of Bonifacio Global City, one of Metro Manila\'s most dynamic business districts.',
    'Located within walking distance of major shopping centers, restaurants, and transportation hubs.',
    'With its sustainable design features and modern amenities, CTP BF Building represents an ideal choice for companies seeking quality office space.'
  ),
  JSON_OBJECT('totalFloors', 1, 'totalUnits', 1, 'occupancyRate', 0, 'availableUnits', 1),
  JSON_OBJECT('weekdays', '6:00 AM - 10:00 PM', 'saturday', '8:00 AM - 8:00 PM', 'sunday', '10:00 AM - 6:00 PM', 'security', '24/7'),
  JSON_OBJECT('phone', '(555) 345-BUILDING', 'email', 'bgc@ctpredcorp.com', 'address', 'Bonifacio Global City'),
  'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'BGC Prime Location',
  'Ready to Join BGC\'s Business Community?',
  'Experience the convenience and connectivity of working in Bonifacio Global City.'
);

-- ===== INSERT BUILDING FEATURES =====
INSERT INTO building_features (building_id, title, description) VALUES
('ctp-red-corp', 'High-Speed Internet', 'Fiber optic ready'),
('ctp-red-corp', '24/7 Security', 'Advanced security systems and on-site guards'),
('ctp-red-corp', 'Parking', 'Reserved and visitor parking available'),
('ctp-red-corp', 'Passenger Lifts', '12 high-speed elevators'),
('ctp-red-corp', 'Backup Power', '100% emergency power supply'),

('ctp-alpha-tower', 'Ultra-Fast Internet', '1Gbps+ fiber optic connectivity'),
('ctp-alpha-tower', 'Advanced Security', 'Biometric access and 24/7 monitoring'),
('ctp-alpha-tower', 'Premium Parking', 'Underground parking with EV charging'),
('ctp-alpha-tower', 'Executive Lounge', 'Premium café and networking spaces'),
('ctp-alpha-tower', 'Wellness Center', 'State-of-the-art fitness facilities'),

('ctp-bf-building', 'Reliable Internet', 'High-speed fiber connectivity'),
('ctp-bf-building', 'Complete Security', 'Round-the-clock security services'),
('ctp-bf-building', 'Parking Available', 'Ample parking spaces for tenants'),
('ctp-bf-building', 'Business Lounge', 'Comfortable common areas and café'),
('ctp-bf-building', 'Fitness Facilities', 'On-site gym and wellness center');

-- ===== INSERT BUILDING FLOOR PLANS =====
INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES
('ctp-red-corp', 1, 1, 1200, 1, 'Fitted'),
('ctp-alpha-tower', 1, 1, 1400, 1, 'Warm Shell'),
('ctp-bf-building', 1, 1, 1300, 1, 'Bare');

-- ===== INSERT UNITS =====
INSERT INTO units (id, title, building, location, floor, size, capacity, price, status, `condition`, image, images, description, floor_plan, availability) VALUES
(
  'CRC-101',
  'Ground Floor Executive Suite',
  'CTP Asean Tower',
  'Filinvest City, Alabang, Muntinlupa',
  1, 1200, 8, 3500.00,
  'Available', 'Fitted',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ),
  'This ground floor executive suite offers exceptional convenience with direct access and premium finishes.',
  JSON_OBJECT('totalArea', 1200, 'privateOffices', 3, 'openWorkspace', 1, 'meetingRooms', 1, 'bathrooms', 2, 'kitchenette', true, 'storage', true),
  JSON_OBJECT('availableFrom', 'Immediate', 'leaseTerms', JSON_ARRAY('6 months', '1 year', '2 years'), 'includedUtilities', JSON_ARRAY('Internet', 'Security', 'Cleaning'))
),
(
  'CAT-102',
  'Alpha Executive Ground Floor',
  'CTP Alpha Tower',
  'Makati Central Business District',
  1, 1400, 10, 3800.00,
  'Available', 'Warm Shell',
  'https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1573852858648-0290e8b1f3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ),
  'Premium ground floor executive space in Makati\'s most prestigious business district.',
  JSON_OBJECT('totalArea', 1400, 'privateOffices', 3, 'openWorkspace', 1, 'meetingRooms', 2, 'bathrooms', 2, 'kitchenette', true, 'storage', true),
  JSON_OBJECT('availableFrom', 'Available Now', 'leaseTerms', JSON_ARRAY('1 year', '2 years', '3 years'), 'includedUtilities', JSON_ARRAY('Premium Internet', 'Security', 'Concierge'))
),
(
  'CBF-103',
  'BGC Modern Office Suite',
  'CTP BF Building',
  'Bonifacio Global City',
  1, 1300, 9, 3600.00,
  'Available', 'Bare',
  'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ),
  'Modern street-level office in the heart of BGC\'s dynamic business district.',
  JSON_OBJECT('totalArea', 1300, 'privateOffices', 3, 'openWorkspace', 1, 'meetingRooms', 1, 'bathrooms', 2, 'kitchenette', true, 'storage', false),
  JSON_OBJECT('availableFrom', 'February 15, 2024', 'leaseTerms', JSON_ARRAY('6 months', '1 year', '2 years'), 'includedUtilities', JSON_ARRAY('Internet', 'Security', 'Cleaning'))
);

-- ===== INSERT SAMPLE FINANCIAL DATA =====
INSERT INTO financial_data (year, quarter, revenue, expenses, net_income, occupancy_rate, total_units, leased_units) VALUES
(2024, 1, 450000.00, 280000.00, 170000.00, 75.50, 50, 38),
(2024, 2, 480000.00, 290000.00, 190000.00, 78.00, 50, 39),
(2024, 3, 520000.00, 310000.00, 210000.00, 82.00, 50, 41),
(2024, 4, 550000.00, 320000.00, 230000.00, 85.00, 50, 42);

SELECT 'Database seeded successfully!' AS message;