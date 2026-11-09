-- Prepared offline after read-only inspection: public has no application tables.
-- Supabase owns auth.users; never recreate or migrate the auth schema.
BEGIN;
SET LOCAL search_path = public;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "grade_levels" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "grade_levels_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" VARCHAR(10) NOT NULL DEFAULT 'note',
    "subject_code" VARCHAR(20) NOT NULL,
    "grade_code" VARCHAR(20) NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "user_id" UUID NOT NULL,
    "note_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("user_id","note_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_name_key" ON "grade_levels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_sort_order_key" ON "grade_levels"("sort_order");

-- CreateIndex
CREATE INDEX "notes_subject_code_idx" ON "notes"("subject_code");

-- CreateIndex
CREATE INDEX "notes_grade_code_idx" ON "notes"("grade_code");

-- CreateIndex
CREATE INDEX "notes_author_id_idx" ON "notes"("author_id");

-- CreateIndex
CREATE INDEX "favorites_note_id_idx" ON "favorites"("note_id");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_subject_code_fkey" FOREIGN KEY ("subject_code") REFERENCES "subjects"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_grade_code_fkey" FOREIGN KEY ("grade_code") REFERENCES "grade_levels"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- SQL-only Supabase integration; preserve this in future migrations.
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_auth_user_fkey"
  FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_display_name_check" CHECK (length(btrim(display_name)) > 0);
ALTER TABLE "notes" ADD CONSTRAINT "notes_title_check" CHECK (length(btrim(title)) > 0);
ALTER TABLE "notes" ADD CONSTRAINT "notes_type_check" CHECK (type IN ('note', 'exam'));

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subjects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grade_levels" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "favorites" ENABLE ROW LEVEL SECURITY;

-- Public profiles contain display names only; email/password stay in Auth.
CREATE POLICY profiles_read ON "profiles" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY profiles_insert_own ON "profiles" FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY profiles_update_own ON "profiles" FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
CREATE POLICY subjects_read ON "subjects" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY grade_levels_read ON "grade_levels" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY notes_read ON "notes" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY notes_insert_own ON "notes" FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);
CREATE POLICY notes_update_own ON "notes" FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = author_id) WITH CHECK ((SELECT auth.uid()) = author_id);
CREATE POLICY notes_delete_own ON "notes" FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = author_id);
CREATE POLICY favorites_read_own ON "favorites" FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
CREATE POLICY favorites_insert_own ON "favorites" FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY favorites_delete_own ON "favorites" FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Explicit grants avoid relying on changing Supabase default privileges.
REVOKE ALL ON "profiles", "subjects", "grade_levels", "notes", "favorites" FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON "profiles", "subjects", "grade_levels", "notes" TO anon, authenticated;
GRANT INSERT, UPDATE ON "profiles" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON "notes" TO authenticated;
GRANT SELECT, INSERT, DELETE ON "favorites" TO authenticated;
COMMIT;
