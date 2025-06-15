-- Add random permissions for each user
-- Modules: Users, Reports, Settings, Dashboard, Inventory, Orders, Analytics

-- User 1: John Smith (Role 1 - assuming Admin)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 1, 1, 1, 1),
('Reports', 1, 1, 1, 1),
('Settings', 1, 1, 1, 1),
('Dashboard', 1, 1, 1, 0),
('Inventory', 1, 1, 1, 1),
('Orders', 1, 1, 1, 1),
('Analytics', 1, 1, 1, 0);

-- User 2: Emma Johnson (Role 2)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 2, 1, 0, 0),
('Reports', 2, 1, 1, 0),
('Dashboard', 2, 1, 0, 0),
('Orders', 2, 1, 1, 0),
('Analytics', 2, 1, 0, 0);

-- User 3: Michael Brown (Role 3)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Reports', 3, 1, 0, 0),
('Dashboard', 3, 1, 0, 0),
('Inventory', 3, 1, 1, 0),
('Orders', 3, 1, 1, 1);

-- User 4: Sarah Davis (Role 4)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 4, 1, 1, 0),
('Reports', 4, 1, 0, 0),
('Settings', 4, 1, 0, 0),
('Dashboard', 4, 1, 0, 0);

-- User 5: David Wilson (Role 1)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 5, 1, 1, 1),
('Reports', 5, 1, 1, 0),
('Settings', 5, 1, 1, 0),
('Dashboard', 5, 1, 0, 0),
('Inventory', 5, 1, 1, 1),
('Analytics', 5, 1, 1, 0);

-- User 6: Lisa Martinez (Role 3)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Dashboard', 6, 1, 0, 0),
('Inventory', 6, 1, 1, 1),
('Orders', 6, 1, 1, 0);

-- User 7: Robert Anderson (Role 4)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Reports', 7, 1, 0, 0),
('Dashboard', 7, 1, 0, 0),
('Analytics', 7, 1, 0, 0);

-- User 8: Jennifer Taylor (Role 2)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 8, 1, 0, 0),
('Reports', 8, 1, 1, 0),
('Dashboard', 8, 1, 0, 0),
('Orders', 8, 1, 1, 0),
('Inventory', 8, 1, 0, 0);

-- User 9: William Thomas (Role 3)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Dashboard', 9, 1, 0, 0),
('Inventory', 9, 1, 1, 0),
('Orders', 9, 1, 1, 1),
('Analytics', 9, 1, 0, 0);

-- User 10: Maria Garcia (Role 1)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Users', 10, 1, 1, 1),
('Reports', 10, 1, 1, 1),
('Settings', 10, 1, 1, 1),
('Dashboard', 10, 1, 1, 0),
('Inventory', 10, 1, 1, 0),
('Orders', 10, 1, 1, 1);

-- User 11: Best Try (Role 4)
INSERT INTO ModulePermissions (ModuleName, UserId, CanRead, CanWrite, CanDelete) VALUES
('Dashboard', 11, 1, 0, 0),
('Reports', 11, 1, 0, 0),
('Orders', 11, 1, 0, 0);