# Phase 04 - Finance & Payments

**Date**: 2026-01-22 | **Priority**: High | **Status**: Draft

## Overview

Fee management: fee items, assignments, invoices, payments for school fees.

## Context

From mock data:
- Fee types: mandatory (tuition, insurance) vs voluntary (uniform, boarding)
- Semesters: 1, 2, all
- Invoice statuses: paid, pending, overdue
- Vietnamese currency: VND (amounts in millions)

## Key Insights

1. **Fee items**: Reusable fee definitions (tuition, insurance, uniform, etc.)
2. **Fee assignments**: Assign fee items to grades/classes with due dates
3. **Invoices**: Generated per student from fee assignments
4. **Payment tracking**: Link invoice to payment transactions

## Schema Design

### 1. Fee Items (Các khoản thu)

```sql
CREATE TABLE fee_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'Học phí', 'Bảo hiểm y tế'
  code TEXT UNIQUE NOT NULL, -- e.g., 'HP-HK1', 'BHYT-25'
  description TEXT,

  fee_type TEXT CHECK (fee_type IN ('mandatory', 'voluntary')) NOT NULL,
  amount DECIMAL(15,0) NOT NULL, -- Amount in VND

  semester TEXT CHECK (semester IN ('1', '2', 'all')) DEFAULT 'all',
  academic_year TEXT DEFAULT '2024-2025',

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fee_items_type ON fee_items(fee_type);
CREATE INDEX idx_fee_items_semester ON fee_items(semester);
CREATE INDEX idx_fee_items_status ON fee_items(status);

-- Trigger for updated_at
CREATE TRIGGER update_fee_items_updated_at
  BEFORE UPDATE ON fee_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Note: Fee items will be added dynamically via your custom function
-- No seed data provided
```

### 2. Fee Assignments (Phân bổ học phí)

```sql
CREATE TABLE fee_assignments (
  id TEXT PRIMARY KEY, -- e.g., 'fa-001'
  name TEXT NOT NULL, -- e.g., 'Học phí HK1 - 2025'

  -- Target: which students
  target_grades TEXT[], -- ['6', '7', '8', '9']
  target_classes TEXT[], -- ['6A', '6B', '7A'] (optional, if specific classes)

  -- Fee composition
  fee_items UUID[] NOT NULL, -- Array of fee_item UUIDs

  -- Timeline
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Reminders
  reminder_days INT DEFAULT 7, -- Days before due to remind
  reminder_frequency TEXT CHECK (reminder_frequency IN ('once', 'daily', 'weekly')) DEFAULT 'once',

  -- Computed stats
  total_students INT DEFAULT 0,
  total_amount DECIMAL(15,0) DEFAULT 0,
  collected_amount DECIMAL(15,0) DEFAULT 0,

  -- Status workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),

  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (due_date > start_date)
);

CREATE INDEX idx_fee_assignments_status ON fee_assignments(status);
CREATE INDEX idx_fee_assignments_due ON fee_assignments(due_date);
CREATE INDEX idx_fee_assignments_grades ON fee_assignments USING GIN(target_grades);
CREATE INDEX idx_fee_assignments_classes ON fee_assignments USING GIN(target_classes);

-- Trigger for updated_at
CREATE TRIGGER update_fee_assignments_updated_at
  BEFORE UPDATE ON fee_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate totals when fee items or target changes
CREATE OR REPLACE FUNCTION calculate_assignment_totals()
RETURNS TRIGGER AS $$
DECLARE
  fee_total DECIMAL(15,0);
BEGIN
  -- Sum of all fee items
  SELECT COALESCE(SUM(amount), 0) INTO fee_total
  FROM fee_items
  WHERE id = ANY(NEW.fee_items);

  -- Total = fee_total * estimated student count
  -- Actual count computed after invoice generation
  NEW.total_amount := fee_total * COALESCE(NEW.total_students, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_fee_assignment_totals
  BEFORE INSERT OR UPDATE OF fee_items, total_students ON fee_assignments
  FOR EACH ROW EXECUTE FUNCTION calculate_assignment_totals();
```

### 3. Invoices (Hóa đơn)

```sql
CREATE TABLE invoices (
  id TEXT PRIMARY KEY, -- e.g., 'INV-2025-001', 'inv-fa-001-HS001'
  invoice_number TEXT UNIQUE, -- Human-readable: 'INV-2025-001'

  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_assignment_id TEXT REFERENCES fee_assignments(id) ON DELETE SET NULL,

  -- Invoice details
  name TEXT NOT NULL, -- e.g., 'Học phí HK1 - Nguyễn Văn An'
  description TEXT,

  amount DECIMAL(15,0) NOT NULL,
  discount_amount DECIMAL(15,0) DEFAULT 0,
  total_amount DECIMAL(15,0) GENERATED ALWAYS AS (amount - discount_amount) STORED,

  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,

  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled')),

  -- Payment tracking
  paid_amount DECIMAL(15,0) DEFAULT 0,
  paid_date DATE,

  -- References
  payment_method TEXT, -- 'cash', 'bank_transfer', 'qr_code', etc.
  transaction_ref TEXT, -- Bank transaction ID

  notes TEXT,
  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_assignment ON invoices(fee_assignment_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);

-- Trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update status based on payment
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.paid_amount >= NEW.total_amount THEN
    NEW.status := 'paid';
    NEW.paid_date := COALESCE(NEW.paid_date, CURRENT_DATE);
  ELSIF NEW.paid_amount > 0 THEN
    NEW.status := 'partial';
  ELSEIF NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  ELSE
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_payment_status
  BEFORE INSERT OR UPDATE OF paid_amount, total_amount, due_date ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoice_status();
```

### 4. Payment Transactions (Chi tiết thanh toán)

```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  amount DECIMAL(15,0) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'qr_code', 'card', 'other')),
  transaction_ref TEXT UNIQUE, -- Bank transaction ID, gateway ref

  -- Payment proof
  receipt_number TEXT, -- 'BIEN-LAI-2025-001'
  proof_url TEXT, -- URL to receipt image

  -- Processor info
  processed_by UUID REFERENCES teachers(id), -- Admin who recorded payment
  processed_at TIMESTAMPTZ DEFAULT NOW(),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_ref ON payment_transactions(transaction_ref);
CREATE INDEX idx_payment_transactions_date ON payment_transactions(processed_at);

-- Update invoice paid_amount on payment
CREATE OR REPLACE FUNCTION update_invoice_payment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET paid_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM payment_transactions
    WHERE invoice_id = NEW.invoice_id
  )
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_on_payment
  AFTER INSERT OR UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_invoice_payment();

-- Update fee assignment collected amount
CREATE OR REPLACE FUNCTION update_assignment_collected()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE fee_assignments fa
  SET collected_amount = (
    SELECT COALESCE(SUM(pt.amount), 0)
    FROM payment_transactions pt
    JOIN invoices i ON i.id = pt.invoice_id
    WHERE i.fee_assignment_id = fa.id
  )
  WHERE fa.id = (SELECT fee_assignment_id FROM invoices WHERE id = NEW.invoice_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assignment_on_payment
  AFTER INSERT ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_assignment_collected();
```

### 5. Invoice Items (Chi tiết hóa đơn - breakdown)

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  fee_item_id UUID REFERENCES fee_items(id) ON DELETE SET NULL,

  item_name TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(15,0) NOT NULL,
  amount DECIMAL(15,0) GENERATED ALWAYS AS (quantity * unit_price) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_fee_item ON invoice_items(fee_item_id);
```

## Functions

### Generate Invoices from Fee Assignment

```sql
CREATE OR REPLACE FUNCTION generate_invoices_from_assignment(
  assignment_id TEXT
) RETURNS INT AS $$
DECLARE
  student_record RECORD;
  fee_item_record RECORD;
  invoice_count INT := 0;
  fee_total DECIMAL(15,0);
  new_invoice_id TEXT;
  target_classes_list TEXT[];
BEGIN
  -- Get fee assignment details
  SELECT fa.*, fi.amount INTO fee_total
  FROM fee_assignments fa
  CROSS JOIN LATERAL (
    SELECT COALESCE(SUM(amount), 0) AS amount
    FROM fee_items
    WHERE id = ANY(fa.fee_items)
  ) fi
  WHERE fa.id = assignment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fee assignment not found';
  END IF;

  -- Get target classes
  target_classes_list := (
    SELECT ARRAY(
      SELECT unnest(target_classes)
      UNION
      SELECT c.id
      FROM classes c
      WHERE c.grade_id = ANY(target_grades)
    )
  )
  FROM fee_assignments
  WHERE id = assignment_id;

  -- Generate invoice for each active student
  FOR student_record IN
    SELECT DISTINCT e.student_id, e.class_id, s.student_code, p.full_name
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    JOIN profiles p ON p.id = s.id
    WHERE e.class_id = ANY(target_classes_list)
      AND e.status = 'active'
      AND e.school_year = '2024-2025'
  LOOP
    -- Create invoice
    new_invoice_id := 'inv-' || assignment_id || '-' || student_record.student_code;

    INSERT INTO invoices (
      id,
      invoice_number,
      student_id,
      fee_assignment_id,
      name,
      amount,
      due_date,
      status
    ) VALUES (
      new_invoice_id,
      'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(invoice_count::text, 4, '0'),
      student_record.student_id,
      assignment_id,
      'Học phí - ' || student_record.full_name,
      fee_total,
      (SELECT due_date FROM fee_assignments WHERE id = assignment_id),
      'pending'
    );

    -- Create invoice items for each fee item
    FOR fee_item_record IN
      SELECT id, name, amount
      FROM fee_items
      WHERE id = ANY((SELECT fee_items FROM fee_assignments WHERE id = assignment_id))
    LOOP
      INSERT INTO invoice_items (
        invoice_id,
        fee_item_id,
        item_name,
        quantity,
        unit_price
      ) VALUES (
        new_invoice_id,
        fee_item_record.id,
        fee_item_record.name,
        1,
        fee_item_record.amount
      );
    END LOOP;

    invoice_count := invoice_count + 1;
  END LOOP;

  -- Update assignment student count
  UPDATE fee_assignments
  SET total_students = invoice_count
  WHERE id = assignment_id;

  RETURN invoice_count;
END;
$$ LANGUAGE plpgsql;
```

### Get Payment Statistics

```sql
CREATE OR REPLACE FUNCTION get_payment_stats(
  academic_year TEXT DEFAULT '2024-2025',
  semester TEXT DEFAULT '1'
) RETURNS TABLE (
  total_invoices BIGINT,
  total_amount DECIMAL(15,0),
  paid_invoices BIGINT,
  paid_amount DECIMAL(15,0),
  pending_invoices BIGINT,
  overdue_invoices BIGINT,
  collection_rate DECIMAL(5,2)
) AS $$
  SELECT
    COUNT(*) AS total_invoices,
    COALESCE(SUM(total_amount), 0) AS total_amount,
    COUNT(*) FILTER (WHERE status = 'paid') AS paid_invoices,
    COALESCE(SUM(paid_amount), 0) AS paid_amount,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_invoices,
    COUNT(*) FILTER (WHERE status = 'overdue') AS overdue_invoices,
    CASE
      WHEN SUM(total_amount) > 0 THEN
        ROUND((SUM(paid_amount) / SUM(total_amount) * 100)::numeric, 2)
      ELSE 0
    END AS collection_rate
  FROM invoices i
  JOIN fee_assignments fa ON fa.id = i.fee_assignment_id
  WHERE fa.academic_year = academic_year
    AND fa.semester = semester OR fa.semester = 'all';
$$ LANGUAGE SQL STABLE;
```

## Views

### Invoice Summary View

```sql
CREATE VIEW invoice_summary AS
SELECT
  i.id,
  i.invoice_number,
  i.student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  i.fee_assignment_id,
  fa.name AS assignment_name,
  i.total_amount,
  i.paid_amount,
  i.total_amount - i.paid_amount AS remaining_amount,
  i.status,
  i.due_date,
  i.paid_date,
  CASE WHEN i.due_date < CURRENT_DATE AND i.status != 'paid' THEN true ELSE false END AS is_overdue
FROM invoices i
JOIN students s ON s.id = i.student_id
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
LEFT JOIN fee_assignments fa ON fa.id = i.fee_assignment_id;
```

### Student Fee Status View

```sql
CREATE VIEW student_fee_status AS
SELECT
  s.id AS student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending_fees,
  COUNT(i.id) FILTER (WHERE i.status = 'overdue') AS overdue_fees,
  COUNT(i.id) FILTER (WHERE i.status = 'paid') AS paid_fees,
  SUM(i.total_amount) AS total_fees,
  SUM(i.paid_amount) AS total_paid,
  SUM(i.total_amount - i.paid_amount) AS total_remaining
FROM students s
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
LEFT JOIN invoices i ON i.student_id = s.id
GROUP BY s.id, s.student_code, p.full_name, e.class_id, c.name;
```

## API Endpoints

```
GET    /fee_items                           -- List fee items
POST   /fee_items                           -- Create fee item

GET    /fee_assignments                     -- List assignments
POST   /fee_assignments                     -- Create assignment
POST   /rpc/generate_invoices_from_assignment -- Generate invoices

GET    /invoices                            -- List invoices
GET    /invoice_summary                     -- Invoice details with student info
POST   /invoices                            -- Create invoice
PATCH  /invoices?id=eq.{id}                 -- Update invoice (record payment)

GET    /payment_transactions                -- List payment transactions
POST   /payment_transactions                -- Record payment

GET    /student_fee_status                  -- Get student fee summary
GET    /rpc/get_payment_stats               -- Payment statistics
```

## Requirements Met

- [x] Fee item management (tuition, insurance, etc.)
- [x] Fee assignment to grades/classes
- [x] Invoice generation per student
- [x] Payment transaction tracking
- [x] Auto-calculate totals and status
- [x] Overdue detection
- [x] Collection rate statistics

## Next Steps

Phase 05: Communications (notifications, messages, leave requests).
