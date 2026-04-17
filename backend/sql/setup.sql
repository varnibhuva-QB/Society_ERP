-- ============================================================
-- Society ERP - SQL Server Setup Script
-- Run this in SSMS on: ADMIN\SQLEXPRESS
-- ============================================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SocietyERP')
BEGIN
    CREATE DATABASE SocietyERP;
    PRINT 'Database SocietyERP created.';
END
GO

USE SocietyERP;
GO

-- Members Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Member' AND xtype='U')
CREATE TABLE Member (
    member_id       INT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(100)   NOT NULL,
    contact_number  NVARCHAR(15)    NOT NULL,
    email           NVARCHAR(150)   NOT NULL UNIQUE,
    blood_group     NVARCHAR(5),
    flat_no         NVARCHAR(20)    NOT NULL,
    role            NVARCHAR(20)    NOT NULL DEFAULT 'member',
    password_hash   NVARCHAR(255)   NOT NULL,
    is_active       BIT             NOT NULL DEFAULT 1,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    updated_at      DATETIME2       NOT NULL DEFAULT GETDATE()
);
GO

-- Family Members Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FamilyMember' AND xtype='U')
CREATE TABLE FamilyMember (
    family_id       INT IDENTITY(1,1) PRIMARY KEY,
    member_id       INT             NOT NULL,
    name            NVARCHAR(100)   NOT NULL,
    relation        NVARCHAR(50)    NOT NULL,
    contact_number  NVARCHAR(15),
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Family_Member FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);
GO

-- Vehicles Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Vehicle' AND xtype='U')
CREATE TABLE Vehicle (
    vehicle_id      INT IDENTITY(1,1) PRIMARY KEY,
    member_id       INT             NOT NULL,
    vehicle_type    NVARCHAR(50)    NOT NULL,
    vehicle_number  NVARCHAR(20)    NOT NULL,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Vehicle_Member FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);
GO

-- Notices Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Notice' AND xtype='U')
CREATE TABLE Notice (
    notice_id       INT IDENTITY(1,1) PRIMARY KEY,
    title           NVARCHAR(200)   NOT NULL,
    description     NVARCHAR(MAX)   NOT NULL,
    created_by      INT             NOT NULL,
    priority        NVARCHAR(20)    NOT NULL DEFAULT 'normal',
    is_active       BIT             NOT NULL DEFAULT 1,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    updated_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Notice_Member FOREIGN KEY (created_by) REFERENCES Member(member_id)
);
GO

-- Maintenance Bills Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MaintenanceBill' AND xtype='U')
CREATE TABLE MaintenanceBill (
    bill_id         INT IDENTITY(1,1) PRIMARY KEY,
    member_id       INT             NOT NULL,
    amount          DECIMAL(10,2)   NOT NULL,
    due_date        DATETIME2       NOT NULL,
    status          NVARCHAR(20)    NOT NULL DEFAULT 'unpaid',
    payment_date    DATETIME2,
    description     NVARCHAR(200),
    month_year      NVARCHAR(20)    NOT NULL,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    updated_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Bill_Member FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);
GO

-- Amenity Bookings Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AmenityBooking' AND xtype='U')
CREATE TABLE AmenityBooking (
    booking_id      INT IDENTITY(1,1) PRIMARY KEY,
    member_id       INT             NOT NULL,
    amenity_type    NVARCHAR(50)    NOT NULL,
    booking_date    DATETIME2       NOT NULL,
    time_slot       NVARCHAR(50)    NOT NULL,
    payment_status  NVARCHAR(20)    NOT NULL DEFAULT 'pending',
    status          NVARCHAR(20)    NOT NULL DEFAULT 'confirmed',
    amount          DECIMAL(10,2)   NOT NULL DEFAULT 0,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Booking_Member FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);
GO

-- Payments Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Payment' AND xtype='U')
CREATE TABLE Payment (
    payment_id      INT IDENTITY(1,1) PRIMARY KEY,
    member_id       INT             NOT NULL,
    bill_id         INT             UNIQUE,
    amount          DECIMAL(10,2)   NOT NULL,
    payment_method  NVARCHAR(50)    NOT NULL,
    transaction_id  NVARCHAR(100),
    status          NVARCHAR(20)    NOT NULL DEFAULT 'pending',
    remarks         NVARCHAR(200),
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Payment_Member FOREIGN KEY (member_id) REFERENCES Member(member_id),
    CONSTRAINT FK_Payment_Bill   FOREIGN KEY (bill_id)   REFERENCES MaintenanceBill(bill_id)
);
GO

-- Important Contacts Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ImportantContact' AND xtype='U')
CREATE TABLE ImportantContact (
    contact_id      INT IDENTITY(1,1) PRIMARY KEY,
    name            NVARCHAR(100)   NOT NULL,
    service_type    NVARCHAR(50)    NOT NULL,
    phone_number    NVARCHAR(15)    NOT NULL,
    description     NVARCHAR(300),
    available_time  NVARCHAR(100),
    added_by        INT             NOT NULL,
    is_active       BIT             NOT NULL DEFAULT 1,
    created_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    updated_at      DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Contact_Member FOREIGN KEY (added_by) REFERENCES Member(member_id)
);
GO

PRINT 'All tables created successfully!';
PRINT 'Now run: npm run seed  to populate with sample data';
GO
