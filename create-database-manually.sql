-- Manual Database Setup for UserManagementDB
-- Run this script in SQL Server Management Studio

USE UserManagementDB;

-- Create Permissions table
CREATE TABLE [Permissions] (
    [PermissionId] nvarchar(450) NOT NULL,
    [PermissionName] nvarchar(100) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_Permissions] PRIMARY KEY ([PermissionId])
);

-- Create Roles table
CREATE TABLE [Roles] (
    [RoleId] nvarchar(450) NOT NULL,
    [RoleName] nvarchar(100) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([RoleId])
);

-- Create Users table
CREATE TABLE [Users] (
    [Id] nvarchar(450) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(20) NULL,
    [Username] nvarchar(50) NOT NULL,
    [Password] nvarchar(255) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [UpdatedDate] datetime2 NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([RoleId])
);

-- Create UserPermissions table
CREATE TABLE [UserPermissions] (
    [Id] nvarchar(450) NOT NULL,
    [UserId] nvarchar(450) NOT NULL,
    [PermissionId] nvarchar(450) NOT NULL,
    [IsReadable] bit NOT NULL,
    [IsWritable] bit NOT NULL,
    [IsDeletable] bit NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    CONSTRAINT [PK_UserPermissions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserPermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([PermissionId]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserPermissions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

-- Create indexes
CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
CREATE INDEX [IX_Users_RoleId] ON [Users] ([RoleId]);
CREATE INDEX [IX_UserPermissions_PermissionId] ON [UserPermissions] ([PermissionId]);
CREATE INDEX [IX_UserPermissions_UserId] ON [UserPermissions] ([UserId]);

-- Insert Permissions data
INSERT INTO [Permissions] ([PermissionId], [CreatedDate], [PermissionName])
VALUES 
    ('employee-access', '2025-06-03 08:25:51.9422755', 'Employee Access'),
    ('hr-operations', '2025-06-03 08:25:51.9422753', 'HR Operations'),
    ('system-admin', '2025-06-03 08:25:51.9422750', 'System Admin'),
    ('user-management', '2025-06-03 08:25:51.9422569', 'User Management');

-- Insert Roles data
INSERT INTO [Roles] ([RoleId], [CreatedDate], [RoleName])
VALUES 
    ('admin', '2025-06-03 08:25:51.9417403', 'Admin'),
    ('employee', '2025-06-03 08:25:51.9417409', 'Employee'),
    ('hr-admin', '2025-06-03 08:25:51.9417406', 'HR Admin'),
    ('super-admin', '2025-06-03 08:25:51.9417191', 'Super Admin');

-- Insert Users data
INSERT INTO [Users] ([Id], [CreatedDate], [Email], [FirstName], [LastName], [Password], [Phone], [RoleId], [UpdatedDate], [Username])
VALUES 
    ('09d6eed1-c5cf-4470-815a-bb0b5139ed3a', '2015-12-18 00:00:00.0000000', 'activevideo@domain.com', 'Devin', 'Harrison', 'password123', '+1-555-0125', 'hr-admin', NULL, 'dharrison'),
    ('4ccf6c55-95f1-4aee-886e-3c094a0532ca', '2015-10-24 00:00:00.0000000', 'activevideo@domine.com', 'David', 'Wagner', 'password123', '+1-555-0123', 'super-admin', NULL, 'dwagner'),
    ('8abce507-6ef9-420e-b8aa-4fcc9dfd303e', '2015-10-24 00:00:00.0000000', 'active.warren@email.net', 'Iva', 'Hogan', 'password123', '+1-555-0124', 'admin', NULL, 'ihogan');

-- Create __EFMigrationsHistory table to track applied migrations
CREATE TABLE [__EFMigrationsHistory] (
    [MigrationId] nvarchar(150) NOT NULL,
    [ProductVersion] nvarchar(32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
);

-- Insert migration record
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250603082552_InitialMigration', '9.0.1');

-- Verify tables were created
SELECT 'Tables created successfully!' as Status;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME;

-- Show data counts
SELECT 'Data inserted successfully!' as Status;
SELECT 'Roles' as TableName, COUNT(*) as Count FROM Roles
UNION ALL
SELECT 'Permissions', COUNT(*) FROM Permissions  
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'UserPermissions', COUNT(*) FROM UserPermissions;
