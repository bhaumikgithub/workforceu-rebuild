-- -------------------------------------------------------
-- Migration: [City table creation]
-- Date: 2025-09-11
-- -------------------------------------------------------

CREATE TABLE IF NOT EXISTS cities (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    state_id INT UNSIGNED NOT NULL,
    name VARCHAR(191) NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

CREATE INDEX idx_state_id ON cities(state_id);
