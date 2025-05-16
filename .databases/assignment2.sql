
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    account_type VARCHAR(20) DEFAULT 'Client'
);


CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE
);


CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    description TEXT,
    price DECIMAL(10, 2),
    classification_id INTEGER REFERENCES classification(classification_id)
);


INSERT INTO classification (classification_name) VALUES
('Sport'),
('SUV'),
('Berline');


INSERT INTO inventory (make, model, year, description, price, classification_id) VALUES
('GM', 'Hummer', 2022, 'Voiture avec petits intérieurs', 50000.00, 2),  -- SUV
('Toyota', 'Supra', 2021, 'Voiture de sport rapide', 40000.00, 1),       -- Sport
('Mazda', 'MX-5', 2023, 'Cabriolet sportif', 30000.00, 1);               -- Sport

-- 1. Insérer Tony Stark (compte client par défaut)
INSERT INTO accounts (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modifier le type de compte à "Administrateur"
UPDATE accounts
SET account_type = 'Administrateur'
WHERE email = 'tony@starkent.com';

-- 3. Supprimer Tony Stark
DELETE FROM accounts
WHERE email = 'tony@starkent.com';


UPDATE inventory
SET description = REPLACE(description, 'petits intérieurs', 'un grand intérieur')
WHERE model = 'Hummer';


SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
