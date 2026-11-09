-- Additive only: preserve all existing rows, IDs, Auth FK and RLS policies.
BEGIN;
ALTER TABLE public.notes ADD COLUMN content TEXT NOT NULL DEFAULT '',
  ADD COLUMN subject_name VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN attachment JSONB,
  ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'approved';
ALTER TABLE public.notes ADD CONSTRAINT notes_status_check CHECK (status IN ('pending','approved'));
CREATE INDEX notes_created_at_id_idx ON public.notes(created_at, id);
CREATE TABLE public.book_favorites (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  book_id VARCHAR(30) NOT NULL,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(1000) NOT NULL DEFAULT '',
  cover_id INTEGER,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, book_id),
  CONSTRAINT book_id_check CHECK (book_id ~ '^OL[0-9]+W$')
);
ALTER TABLE public.book_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY book_favorites_read_own ON public.book_favorites FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY book_favorites_insert_own ON public.book_favorites FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY book_favorites_delete_own ON public.book_favorites FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
REVOKE ALL ON public.book_favorites FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.book_favorites TO authenticated;
COMMIT;
