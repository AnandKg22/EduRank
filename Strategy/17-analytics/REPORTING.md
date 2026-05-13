# Reporting Strategy

## 1. Purpose
Defines how the system extracts, formats, and delivers data to end-users (Faculty/Admins) to prove the value of the platform.

## 2. Why It Matters
Students play the game for fun; Universities pay for the data. If the reporting is inaccurate, slow, or hard to export, the B2B buyer will churn. Reporting is the core product for the secondary audience.

## 3. Example Structure
- **Report Types**: The standard exports.
- **Data Freshness**: Real-time vs Batch.
- **Export Formats**: CSV, PDF, JSON.
- **Data Aggregation**: How we summarize millions of rows.

## 4. Example Content
**Report Types**:
1. *Department Leaderboard*: Weekly summary of top students.
2. *Topic Weakness Report*: Aggregation of the most frequently failed questions in a specific semester.
3. *Student Engagement Report*: Days active, matches played.

**Data Freshness**:
- Analytics do NOT need to be real-time. To save database load, analytical views are refreshed nightly via a Materialized View.

**Export Formats**:
- All data tables must have an "Export to CSV" button.
- CSVs must be generated entirely on the client-side (using a library like `papaparse` or native JS blobs) if the dataset is < 10,000 rows, to save server costs.

**Data Aggregation**:
- Do not run `COUNT(*)` on massive tables in real-time. Maintain a `department_stats` summary table that increments/decrements via triggers when matches finish.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When tasked with building an Analytics UI component, the AI must automatically implement an "Export to CSV" functionality, as this is a strict requirement for the Faculty Persona.

## 6. Developer Usage Instructions
- Ensure all dates in exported reports are standardized to ISO 8601 or the specific timezone of the University.
- Strip all internal UUIDs from user-facing CSVs. Replace them with human-readable names or student ID numbers.

## 7. Best Practices
- **Do**: Use pagination or infinite scroll for UI reports, but allow the CSV export to download the entire dataset.
- **Don't**: Expose raw database column names in reports. Map `created_at` to "Date Enrolled".

## 8. Maintenance Strategy
- **Owner**: Data Analyst / Product Manager.
- **Update Frequency**: Every quarter.
- **Trigger**: Faculty requesting new data cuts or compliance reporting.
