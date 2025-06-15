-- Migration script to change UserId from int IDENTITY to string while preserving data
-- Step 1: Create temporary tables with new structure

-- Create temporary Users table with string UserId
CREATE TABLE Users_Temp (
    UserId NVARCHAR(450) NOT NULL PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Username NVARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedDate DATETIME2 NULL,
    RoleId INT NOT NULL
);

-- Create temporary ModulePermissions table with string UserId
CREATE TABLE ModulePermissions_Temp (
    PermissionId INT IDENTITY(1,1) PRIMARY KEY,
    ModuleName NVARCHAR(100) NOT NULL,
    UserId NVARCHAR(450) NOT NULL,
    CanRead BIT NOT NULL DEFAULT 0,
    CanWrite BIT NOT NULL DEFAULT 0,
    CanDelete BIT NOT NULL DEFAULT 0
);

-- Step 2: Copy data from existing tables to temporary tables
-- Convert integer UserId to string by casting to NVARCHAR
INSERT INTO Users_Temp (UserId, FirstName, LastName, Email, Phone, Username, PasswordHash, CreatedDate, UpdatedDate, RoleId)
SELECT 
    CAST(UserId AS NVARCHAR(450)) AS UserId,
    FirstName,
    LastName,
    Email,
    Phone,
    Username,
    PasswordHash,
    CreatedDate,
    UpdatedDate,
    RoleId
FROM Users;

-- Copy ModulePermissions data (if the table exists and has data)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ModulePermissions')
BEGIN
    INSERT INTO ModulePermissions_Temp (ModuleName, UserId, CanRead, CanWrite, CanDelete)
    SELECT 
        ModuleName,
        CAST(UserId AS NVARCHAR(450)) AS UserId,
        CanRead,
        CanWrite,
        CanDelete
    FROM ModulePermissions;
END

-- Step 3: Drop existing tables and constraints
-- Drop foreign key constraints first
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_ModulePermissions_Users')
BEGIN
    ALTER TABLE ModulePermissions DROP CONSTRAINT FK_ModulePermissions_Users;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Users_Roles_RoleId')
BEGIN
    ALTER TABLE Users DROP CONSTRAINT FK_Users_Roles_RoleId;
END

-- Drop existing tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ModulePermissions')
BEGIN
    DROP TABLE ModulePermissions;
END

DROP TABLE Users;

-- Step 4: Rename temporary tables to original names
EXEC sp_rename 'Users_Temp', 'Users';
EXEC sp_rename 'ModulePermissions_Temp', 'ModulePermissions';

-- Step 5: Recreate foreign key constraints
-- Add foreign key constraint from Users to Roles
ALTER TABLE Users
ADD CONSTRAINT FK_Users_Roles_RoleId 
FOREIGN KEY (RoleId) REFERENCES Roles(RoleId);

-- Add foreign key constraint from ModulePermissions to Users
ALTER TABLE ModulePermissions
ADD CONSTRAINT FK_ModulePermissions_Users 
FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE;

-- Add unique constraint for UserId + ModuleName in ModulePermissions
ALTER TABLE ModulePermissions
ADD CONSTRAINT UQ_UserId_ModuleName UNIQUE (UserId, ModuleName);

-- Create index for better query performance
CREATE INDEX IX_ModulePermissions_UserId ON ModulePermissions(UserId);

PRINT 'Migration completed successfully. UserId is now a string field.';
PRINT 'Existing user IDs have been converted from integers to strings.';
PRINT 'All data has been preserved.';

-- Show the converted data
SELECT TOP 5 UserId, FirstName, LastName, Email FROM Users;
SELECT COUNT(*) as TotalUsers FROM Users;
SELECT COUNT(*) as TotalPermissions FROM ModulePermissions;