# Table & Naming Standards

## 1. Purpose
Enforces strict syntax and formatting rules for database schema objects (Tables, Columns, Indexes, Views).

## 2. Why It Matters
A database where tables are named `User`, `user_profiles`, `TBL_MATCHES`, and `Questions` is a nightmare to query and impossible to auto-generate ORM types for. Strict naming conventions enable tooling automation and reduce cognitive load.

## 3. Example Structure
- **Casing Rules**: snake_case vs camelCase.
- **Pluralization**: Singular or Plural table names.
- **Prefixes/Suffixes**: Rules for views, mapping tables, or boolean columns.
- **Metadata Columns**: Columns that must exist on every table.

## 4. Example Content
**Casing Rules**: 
- PostgreSQL is case-insensitive by default. All identifiers (tables, columns, functions) MUST be lowercase `snake_case`.

**Pluralization**:
- Tables MUST be plural (e.g., `profiles`, not `profile`).
- Foreign Keys MUST be singular, suffixed with `_id` (e.g., `profile_id`).

**Prefixes/Suffixes**:
- Mapping tables for N:M relationships combine the two table names: `table1_table2` (e.g., `profiles_roles`).
- Boolean columns MUST be prefixed with `is_`, `has_`, or `can_` (e.g., `is_active`, `has_completed_tutorial`).

**Required Metadata Columns**:
Every table MUST have:
- `id` (UUID, Primary Key, Default `uuid_generate_v4()`)
- `created_at` (TIMESTAMPTZ, Default `now()`)
- `updated_at` (TIMESTAMPTZ, Default `now()`)

## 5. AI Usage Instructions
> [!NOTE]  
> If an AI agent generates a SQL migration file, it MUST implement the Required Metadata Columns (`id`, `created_at`, `updated_at`) automatically. If it generates a boolean column named `active`, it must auto-correct it to `is_active`.

## 6. Developer Usage Instructions
- Never use reserved SQL keywords (like `user`, `group`, `order`) as table or column names. (We use `profiles`, not `users`).
- Ensure Supabase generated TypeScript types are re-run after any table name change.

## 7. Best Practices
- **Do**: Keep names descriptive but concise.
- **Don't**: Use Hungarian notation (e.g., `str_name`, `int_age`). The schema defines the type.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Rarely.
- **Trigger**: Adopting a new database paradigm (e.g., moving to GraphQL might necessitate different casing in the API layer, though DB remains snake_case).
