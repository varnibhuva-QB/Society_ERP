BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Member] (
    [member_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [contact_number] NVARCHAR(15) NOT NULL,
    [email] NVARCHAR(150) NOT NULL,
    [blood_group] NVARCHAR(5),
    [flat_no] NVARCHAR(20) NOT NULL,
    [role] NVARCHAR(20) NOT NULL CONSTRAINT [Member_role_df] DEFAULT 'member',
    [is_security] BIT NOT NULL CONSTRAINT [Member_is_security_df] DEFAULT 0,
    [password_hash] NVARCHAR(255) NOT NULL,
    [password_change_required] BIT NOT NULL CONSTRAINT [Member_password_change_required_df] DEFAULT 0,
    [is_active] BIT NOT NULL CONSTRAINT [Member_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Member_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Member_pkey] PRIMARY KEY CLUSTERED ([member_id]),
    CONSTRAINT [Member_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[FamilyMember] (
    [family_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [relation] NVARCHAR(50) NOT NULL,
    [contact_number] NVARCHAR(15),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [FamilyMember_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [FamilyMember_pkey] PRIMARY KEY CLUSTERED ([family_id])
);

-- CreateTable
CREATE TABLE [dbo].[Vehicle] (
    [vehicle_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [vehicle_type] NVARCHAR(50) NOT NULL,
    [vehicle_number] NVARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Vehicle_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Vehicle_pkey] PRIMARY KEY CLUSTERED ([vehicle_id])
);

-- CreateTable
CREATE TABLE [dbo].[Notice] (
    [notice_id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(200) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [created_by] INT NOT NULL,
    [priority] NVARCHAR(20) NOT NULL CONSTRAINT [Notice_priority_df] DEFAULT 'normal',
    [is_active] BIT NOT NULL CONSTRAINT [Notice_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Notice_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Notice_pkey] PRIMARY KEY CLUSTERED ([notice_id])
);

-- CreateTable
CREATE TABLE [dbo].[MaintenanceBill] (
    [bill_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [amount] DECIMAL(10,2) NOT NULL,
    [due_date] DATETIME2 NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [MaintenanceBill_status_df] DEFAULT 'unpaid',
    [payment_date] DATETIME2,
    [description] NVARCHAR(200),
    [month_year] NVARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [MaintenanceBill_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [MaintenanceBill_pkey] PRIMARY KEY CLUSTERED ([bill_id])
);

-- CreateTable
CREATE TABLE [dbo].[AmenityBooking] (
    [booking_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [amenity_type] NVARCHAR(50) NOT NULL,
    [booking_date] DATETIME2 NOT NULL,
    [start_time] NVARCHAR(10) NOT NULL CONSTRAINT [AmenityBooking_start_time_df] DEFAULT '00:00',
    [end_time] NVARCHAR(10) NOT NULL CONSTRAINT [AmenityBooking_end_time_df] DEFAULT '00:00',
    [payment_status] NVARCHAR(20) NOT NULL CONSTRAINT [AmenityBooking_payment_status_df] DEFAULT 'pending',
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [AmenityBooking_status_df] DEFAULT 'confirmed',
    [amount] DECIMAL(10,2) NOT NULL CONSTRAINT [AmenityBooking_amount_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [AmenityBooking_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AmenityBooking_pkey] PRIMARY KEY CLUSTERED ([booking_id])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [payment_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [bill_id] INT,
    [amount] DECIMAL(10,2) NOT NULL,
    [payment_method] NVARCHAR(50) NOT NULL,
    [transaction_id] NVARCHAR(100),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Payment_status_df] DEFAULT 'pending',
    [remarks] NVARCHAR(200),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Payment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([payment_id]),
    CONSTRAINT [Payment_bill_id_key] UNIQUE NONCLUSTERED ([bill_id])
);

-- CreateTable
CREATE TABLE [dbo].[ImportantContact] (
    [contact_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [service_type] NVARCHAR(50) NOT NULL,
    [phone_number] NVARCHAR(15) NOT NULL,
    [description] NVARCHAR(300),
    [available_time] NVARCHAR(100),
    [added_by] INT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [ImportantContact_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ImportantContact_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [ImportantContact_pkey] PRIMARY KEY CLUSTERED ([contact_id])
);

-- CreateTable
CREATE TABLE [dbo].[Amenity] (
    [amenity_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(100) NOT NULL,
    [type] NVARCHAR(50) NOT NULL,
    [rent_amount] DECIMAL(10,2) NOT NULL,
    [description] NVARCHAR(300),
    [is_active] BIT NOT NULL CONSTRAINT [Amenity_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Amenity_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Amenity_pkey] PRIMARY KEY CLUSTERED ([amenity_id]),
    CONSTRAINT [Amenity_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Complaint] (
    [complaint_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Complaint_status_df] DEFAULT 'pending',
    [priority] NVARCHAR(20) NOT NULL CONSTRAINT [Complaint_priority_df] DEFAULT 'normal',
    [is_active] BIT NOT NULL CONSTRAINT [Complaint_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Complaint_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Complaint_pkey] PRIMARY KEY CLUSTERED ([complaint_id])
);

-- CreateTable
CREATE TABLE [dbo].[Visitor] (
    [visitor_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [visitor_name] NVARCHAR(100) NOT NULL,
    [visitor_mobile] NVARCHAR(15) NOT NULL,
    [visitor_photo] NVARCHAR(max),
    [requested_by] INT NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Visitor_status_df] DEFAULT 'pending',
    [approval_date] DATETIME2,
    [rejection_date] DATETIME2,
    [reason] NVARCHAR(300),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Visitor_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Visitor_pkey] PRIMARY KEY CLUSTERED ([visitor_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[FamilyMember] ADD CONSTRAINT [FamilyMember_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Vehicle] ADD CONSTRAINT [Vehicle_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notice] ADD CONSTRAINT [Notice_created_by_fkey] FOREIGN KEY ([created_by]) REFERENCES [dbo].[Member]([member_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MaintenanceBill] ADD CONSTRAINT [MaintenanceBill_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AmenityBooking] ADD CONSTRAINT [AmenityBooking_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_bill_id_fkey] FOREIGN KEY ([bill_id]) REFERENCES [dbo].[MaintenanceBill]([bill_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ImportantContact] ADD CONSTRAINT [ImportantContact_added_by_fkey] FOREIGN KEY ([added_by]) REFERENCES [dbo].[Member]([member_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Complaint] ADD CONSTRAINT [Complaint_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Visitor] ADD CONSTRAINT [Visitor_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[Member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Visitor] ADD CONSTRAINT [Visitor_requested_by_fkey] FOREIGN KEY ([requested_by]) REFERENCES [dbo].[Member]([member_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
