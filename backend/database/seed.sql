-- =============================================
-- CTP RED CORP Database Seed Data
-- Clean data extracted from TypeScript files
-- =============================================

USE ctpredcorp_db;

-- Clear existing data
TRUNCATE TABLE financial_data;
TRUNCATE TABLE units;
TRUNCATE TABLE building_floor_plans;
TRUNCATE TABLE building_features;
TRUNCATE TABLE buildings;

-- =============================================
-- INSERT BUILDINGS
-- =============================================

-- CTP Asean Tower (ctp-red-corp)
INSERT INTO buildings (id, name, display_name, location, short_location, description, stats, building_hours, contact, hero_image, badge, cta_title, cta_description) VALUES (
  'ctp-red-corp',
  'CTP Red Corp',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  '["Situated on Asean Drive in Filinvest City, Alabang, Muntinlupa City, CTP Asean is positioned within a masterfully planned development that emphasizes sustainability and modern living.","Filinvest City is a flagship project renowned for its strategic connectivity and accessibility, serving as a major gateway for commuters and a dynamic business district attracting multinational corporations and BPO companies.","CTP Asean is a Grade A, 14-storey office building (Ground Floor, 2nd-12th Floor, plus Lower and Upper Penthouse) developed by CTP R.E.D. III Corp. It offers a substantial Net Leasable Area of 24,933 square meters, indicating a large-scale, modern facility designed to accommodate various business and organizations. The building\'s prime location within Filinvest City offers convenient access to a diverse range of dining, entertainment, and retail options, thereby enhancing the overall work experience for occupants."]',
  '{"totalFloors":12,"totalUnits":62,"occupancyRate":90,"availableUnits":6}',
  '{"weekdays":"9:00 AM - 5:00 PM","saturday":"8:00 AM - 8:00 PM","sunday":"10:00 AM - 6:00 PM","security":"24/7"}',
  '{"phone":"(02) 8334-2091","email":"aseantower@ctpred.com.ph","address":"Asean Drive, Filinvest City, Alabang, Muntinlupa"}',
  '/images/CTP_Asean.PNG',
  'Premium Location',
  'Explore Premium Office Solutions',
  'Discover the perfect workspace for your business in our modern facility with state-of-the-art amenities and prime location.'
);

-- CTP Alpha Tower
INSERT INTO buildings (id, name, display_name, location, short_location, description, stats, building_hours, contact, hero_image, badge, cta_title, cta_description) VALUES (
  'ctp-alpha-tower',
  'CTP Alpha Tower',
  'CTP Alpha Tower',
  '1709 Investment Dr, Muntinlupa, Metro Manila',
  '1709 Investment Dr, Muntinlupa',
  '["CTP Alpha Tower stands as a premier commercial address in the heart of Muntinlupa\'s thriving business district.","The building features modern architecture and state-of-the-art facilities designed for today\'s dynamic businesses.","With its strategic location and comprehensive amenities, CTP Alpha Tower offers an ideal environment for growing companies."]',
  '{"totalFloors":11,"totalUnits":21,"occupancyRate":85,"availableUnits":2}',
  '{"weekdays":"9:00 AM - 5:00 PM","saturday":"8:00 AM - 8:00 PM","sunday":"10:00 AM - 6:00 PM","security":"24/7"}',
  '{"phone":"(02) 8334-2091","email":"alphatower@ctpred.com.ph","address":"1709 Investment Dr, Muntinlupa, Metro Manila"}',
  '/images/CTP_Alpha_Tower.jpg',
  'Modern Workspace',
  'Your Next Business Address',
  'Experience premium office space in a strategically located building with modern facilities.'
);

-- CTP BF Building
INSERT INTO buildings (id, name, display_name, location, short_location, description, stats, building_hours, contact, hero_image, badge, cta_title, cta_description) VALUES (
  'ctp-bf-building',
  'CTP BF Building',
  'CTP BF Building',
  '11 President\'s Ave, BF Homes, Parañaque, Metro Manila',
  '11 President\'s Ave, Parañaque',
  '["CTP BF Building offers flexible office solutions in the established BF Homes area of Parañaque.","The building provides a professional environment perfect for small to medium-sized businesses.","With accessible location and quality facilities, CTP BF Building delivers excellent value for growing enterprises."]',
  '{"totalFloors":4,"totalUnits":9,"occupancyRate":88,"availableUnits":1}',
  '{"weekdays":"9:00 AM - 5:00 PM","saturday":"8:00 AM - 8:00 PM","sunday":"10:00 AM - 6:00 PM","security":"24/7"}',
  '{"phone":"(02) 8334-2091","email":"bfbuilding@ctpred.com.ph","address":"11 President\'s Ave, BF Homes, Parañaque, Metro Manila"}',
  '/images/CTP_BF_Feature.jpg',
  'Flexible Spaces',
  'Flexible Office Solutions',
  'Discover versatile office spaces designed for businesses of all sizes in a strategic location.'
);

-- =============================================
-- INSERT BUILDING FEATURES
-- =============================================

-- CTP Asean Tower Features
INSERT INTO building_features (building_id, title, description) VALUES
('ctp-red-corp', 'High-Speed Internet', 'Fiber optic ready'),
('ctp-red-corp', '24/7 Security', 'Advanced security systems and on-site guards'),
('ctp-red-corp', 'Parking', 'Reserved and visitor parking available'),
('ctp-red-corp', 'Passenger Lifts', '12 high-speed elevators'),
('ctp-red-corp', 'Backup Power', '100% emergency power supply'),
('ctp-red-corp', 'Floor Efficiency', '83%');

-- CTP Alpha Tower Features
INSERT INTO building_features (building_id, title, description) VALUES
('ctp-alpha-tower', 'High-Speed Internet', 'Fiber optic connectivity'),
('ctp-alpha-tower', '24/7 Security', 'CCTV monitoring and security personnel'),
('ctp-alpha-tower', 'Parking', 'Ample parking space'),
('ctp-alpha-tower', 'Elevators', 'Modern high-speed elevators'),
('ctp-alpha-tower', 'Backup Power', 'Full generator backup');

-- CTP BF Building Features
INSERT INTO building_features (building_id, title, description) VALUES
('ctp-bf-building', 'Secure Access', 'Controlled entry system'),
('ctp-bf-building', 'Parking', 'Dedicated parking slots'),
('ctp-bf-building', 'Backup Power', 'Emergency power supply'),
('ctp-bf-building', 'Internet Ready', 'Fiber optic infrastructure');

-- =============================================
-- INSERT BUILDING FLOOR PLANS
-- =============================================

-- CTP Asean Tower Floor Plans
INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES
('ctp-red-corp', 0, 10, 1741.98, 1, 'Bare'),
('ctp-red-corp', 4, 1, 35.96, 0, 'Bare'),
('ctp-red-corp', 5, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 6, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 7, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 8, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 9, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 10, 6, 2568.62, 2, 'Warm Shell'),
('ctp-red-corp', 11, 6, 2527.96, 0, 'Bare'),
('ctp-red-corp', 12, 6, 2573.52, 0, 'Bare'),
('ctp-red-corp', 13, 4, 2107.48, 2, 'Bare'),
('ctp-red-corp', 14, 3, 960.27, 1, 'Bare');

-- CTP Alpha Tower Floor Plans (sample data)
INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES
('ctp-alpha-tower', 0, 3, 450.50, 0, 'Fitted'),
('ctp-alpha-tower', 2, 2, 380.25, 1, 'Warm Shell'),
('ctp-alpha-tower', 3, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 4, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 5, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 6, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 7, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 8, 2, 380.25, 0, 'Bare'),
('ctp-alpha-tower', 9, 2, 380.25, 1, 'Fitted'),
('ctp-alpha-tower', 10, 1, 450.50, 0, 'Fitted'),
('ctp-alpha-tower', 11, 1, 450.50, 0, 'Fitted');

-- CTP BF Building Floor Plans (sample data)
INSERT INTO building_floor_plans (building_id, floor, units, total_sqft, available, `condition`) VALUES
('ctp-bf-building', 0, 3, 280.50, 0, 'Fitted'),
('ctp-bf-building', 1, 2, 240.80, 0, 'Warm Shell'),
('ctp-bf-building', 2, 2, 240.80, 1, 'Bare'),
('ctp-bf-building', 3, 2, 240.80, 0, 'Bare');

-- =============================================
-- INSERT UNITS (CTP Asean Tower - Available Units Only)
-- =============================================

INSERT INTO units (id, title, building, location, floor, size, capacity, price, status, `condition`, image, images, description, floor_plan, availability) VALUES
(
  'CRC-GF12',
  'Ground Floor (Unit GF12)',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  0,
  109.40,
  16,
  '900 per sq m',
  'Available',
  'Bare',
  '/images/units/CTP_ASEAN/GF12/GF12_1.jpg',
  '["/images/units/CTP_ASEAN/GF12/GF12_1.jpg","/images/units/CTP_ASEAN/GF12/GF12_2.jpg","/images/units/CTP_ASEAN/GF12/GF12_3.jpg"]',
  'Spacious ground floor commercial suite with direct street access and excellent visibility for businesses.',
  '{"totalArea":109.40,"privateOffices":3,"openWorkspace":2,"meetingRooms":2,"bathrooms":2,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["6 months","1 year","2 years"],"includedUtilities":["Security","Cleaning"],"additionalCosts":["HVAC: ₱100","Parking: ₱150"]}'
),
(
  'CRC-1001',
  '10th Floor (Unit 1001)',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  10,
  372.63,
  56,
  '900 per sq m',
  'Available',
  'Warm Shell',
  '/images/units/CTP_ASEAN/1001/1001_1.jpg',
  '["/images/units/CTP_ASEAN/1001/1001_1.jpg","/images/units/CTP_ASEAN/1001/1001_2.png","/images/units/CTP_ASEAN/1001/1001_3.png"]',
  'Large high floor executive office with city views and warm shell condition ready for tenant improvements.',
  '{"totalArea":372.63,"privateOffices":8,"openWorkspace":4,"meetingRooms":3,"bathrooms":3,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["1 year","2 years","3 years"],"includedUtilities":["Internet","Security","Cleaning","HVAC"],"additionalCosts":["Parking: ₱150"]}'
),
(
  'CRC-1008',
  '10th Floor (UNIT 1008)',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  10,
  395.57,
  59,
  '900 per sq m',
  'Available',
  'Fitted',
  '/images/units/CTP_ASEAN/1008/1008_1.jpg',
  '["/images/units/CTP_ASEAN/1008/1008_1.jpg","/images/units/CTP_ASEAN/1008/1008_2.png","/images/units/CTP_ASEAN/1008/1008_3.png"]',
  'Large premium fitted office suite on the 10th floor with modern finishes and move-in ready amenities.',
  '{"totalArea":395.57,"privateOffices":8,"openWorkspace":4,"meetingRooms":3,"bathrooms":3,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["1 year","2 years","3 years"],"includedUtilities":["Internet","Security","Cleaning","HVAC"],"additionalCosts":["Parking: ₱150"]}'
),
(
  'CRC-LP03',
  'Lower Penthouse (Unit LP03)',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  13,
  461.20,
  69,
  '900 per sq m',
  'Available',
  'Bare',
  '/images/units/CTP_ASEAN/LP03_LP04/LP03_1.png',
  '["/images/units/CTP_ASEAN/LP03_LP04/LP03_1.png","/images/units/CTP_ASEAN/LP03_LP04/LP03_2.png","/images/units/CTP_ASEAN/LP03_LP04/LP03_3.png"]',
  'Expansive lower penthouse suite with panoramic city views and customizable bare shell condition.',
  '{"totalArea":461.20,"privateOffices":10,"openWorkspace":5,"meetingRooms":4,"bathrooms":4,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["2 years","3 years","5 years"],"includedUtilities":["Security","Cleaning"],"additionalCosts":["HVAC: ₱200","Parking: ₱200"]}'
),
(
  'CRC-LP04',
  'Lower Penthouse (Unit LP04)',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  13,
  466.87,
  70,
  '900 per sq m',
  'Available',
  'Bare',
  '/images/units/CTP_ASEAN/LP03_LP04/LP04_1.png',
  '["/images/units/CTP_ASEAN/LP03_LP04/LP04_1.png","/images/units/CTP_ASEAN/LP03_LP04/LP04_2.png","/images/units/CTP_ASEAN/LP03_LP04/LP04_3.png"]',
  'Premium expansive lower penthouse office with excellent customization potential.',
  '{"totalArea":466.87,"privateOffices":10,"openWorkspace":5,"meetingRooms":4,"bathrooms":4,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["2 years","3 years","5 years"],"includedUtilities":["Security","Cleaning"],"additionalCosts":["HVAC: ₱200","Parking: ₱200"]}'
),
(
  'CRC-UP02',
  'Upper Penthouse Exclusive Suite',
  'CTP Asean Tower',
  'Asean Drive, Filinvest City, Alabang, Muntinlupa',
  14,
  310.12,
  47,
  '900 per sq m',
  'Available',
  'Bare',
  '/images/units/CTP_ASEAN/UP02/UP02_1.png',
  '["/images/units/CTP_ASEAN/UP02/UP02_1.png","/images/units/CTP_ASEAN/UP02/UP02_2.png","/images/units/CTP_ASEAN/UP02/UP02_3.png"]',
  'Exclusive expansive upper penthouse with top floor privacy and 360-degree city views.',
  '{"totalArea":310.12,"privateOffices":6,"openWorkspace":3,"meetingRooms":3,"bathrooms":3,"kitchenette":true,"storage":true}',
  '{"availableFrom":"Immediate","leaseTerms":["3 years","5 years"],"includedUtilities":["Security","Cleaning"],"additionalCosts":["HVAC: ₱250","Parking: ₱300"]}'
);

-- =============================================
-- INSERT FINANCIAL DATA
-- =============================================

INSERT INTO financial_data (year, quarter, revenue, profit, occupancy, expenses) VALUES
(2023, 'Q1', 11.2, 3.1, 92.5, 8.1),
(2023, 'Q2', 12.1, 3.4, 94.2, 8.7),
(2023, 'Q3', 11.8, 3.2, 93.8, 8.6),
(2023, 'Q4', 12.2, 3.5, 95.1, 8.7),
(2024, 'Q1', 12.8, 3.7, 94.8, 9.1),
(2024, 'Q2', 13.4, 3.9, 95.6, 9.5),
(2024, 'Q3', 13.1, 3.8, 96.2, 9.3),
(2024, 'Q4', 13.4, 4.0, 96.4, 9.4);

-- =============================================
-- SEED DATA COMPLETE
-- =============================================