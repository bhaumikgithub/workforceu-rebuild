-- -------------------------------------------------------
-- Migration: [Pemission table creation]
-- Date: 2025-09-19
-- -------------------------------------------------------

-- Permission Profiles
CREATE TABLE permission_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    profile_name VARCHAR(255) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_owner (owner_id),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Permission Types (Hierarchical)
CREATE TABLE permission_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    output_name VARCHAR(255) NOT NULL,
    opt_add TINYINT(1) NOT NULL DEFAULT 0,
    opt_edit TINYINT(1) NOT NULL DEFAULT 0,
    opt_view TINYINT(1) NOT NULL DEFAULT 0,
    opt_remove TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_parent (parent_id),
    CONSTRAINT fk_permission_types_parent FOREIGN KEY (parent_id)
        REFERENCES permission_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Profile ↔ Permission Mapping
CREATE TABLE profile_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    permission_type_id INT NOT NULL,
    is_add TINYINT(1) NOT NULL DEFAULT 0,
    is_edit TINYINT(1) NOT NULL DEFAULT 0,
    is_view TINYINT(1) NOT NULL DEFAULT 0,
    is_remove TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_profile (profile_id),
    INDEX idx_permission_type (permission_type_id),
    CONSTRAINT fk_profile_permissions_profile FOREIGN KEY (profile_id)
        REFERENCES permission_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_profile_permissions_type FOREIGN KEY (permission_type_id)
        REFERENCES permission_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Legacy Permissions (ON/OFF style)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_id INT NOT NULL,
    permission_type_id INT NOT NULL,
    value TINYINT(1) NOT NULL,
    INDEX idx_user (user_id),
    INDEX idx_owner (owner_id),
    INDEX idx_permission_type (permission_type_id),
    -- Uncomment this if users table already exists
    -- CONSTRAINT fk_permissions_user FOREIGN KEY (user_id)
    --     REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_permissions_type FOREIGN KEY (permission_type_id)
        REFERENCES permission_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_id INT NOT NULL,
    permission_type_id INT NOT NULL,
    is_add TINYINT(1) DEFAULT 0,
    is_edit TINYINT(1) DEFAULT 0,
    is_view TINYINT(1) DEFAULT 0,
    is_remove TINYINT(1) DEFAULT 0,

    -- Indexes for faster lookups
    INDEX idx_user (user_id),
    INDEX idx_owner (owner_id),
    INDEX idx_permission_type (permission_type_id),

    -- Composite index: quickly check if user has a given permission type
    UNIQUE KEY uq_user_permission (user_id, permission_type_id),

    -- Foreign keys (optional but recommended)
    CONSTRAINT fk_user_permissions_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_user_permissions_owner 
        FOREIGN KEY (owner_id) REFERENCES users(id) 
        ON DELETE CASCADE,

    CONSTRAINT fk_user_permissions_type 
        FOREIGN KEY (permission_type_id) REFERENCES permission_types(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
