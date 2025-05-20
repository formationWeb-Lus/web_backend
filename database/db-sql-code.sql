CREATE TABLE accounts (
  account_id SERIAL PRIMARY KEY,                          -- identifiant unique auto-incrémenté
  account_firstname VARCHAR(50) NOT NULL,                 -- prénom obligatoire
  account_lastname VARCHAR(50) NOT NULL,                  -- nom obligatoire
  account_email VARCHAR(100) UNIQUE NOT NULL,             -- email unique et obligatoire
  account_password VARCHAR(100) NOT NULL                  -- mot de passe obligatoire
);

    INSERT INTO accounts (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);
