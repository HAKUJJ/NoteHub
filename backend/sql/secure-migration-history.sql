-- Prisma owns this metadata table. Application/browser roles do not need access.
-- Applied after the user-approved baseline, via the Backend Prisma connection.
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public._prisma_migrations FROM anon, authenticated;
