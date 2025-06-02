# Prisma Migration Errors

This document tracks common Prisma migration issues encountered during development.

## Database Drift Detection Error

**Error:** 
```
Drift detected: Your database schema is not in sync with your migration history.

The following is a summary of the differences between the expected database schema given your migrations files, and the actual schema of the database.

It should be understood as the set of changes to get from the expected schema to the actual schema.

[*] Changed the `chatrooms` table
  [+] Added column `roomUrl`
  [+] Added unique index on columns (roomUrl)

We need to reset the "public" schema at "localhost:5432"
```

**Cause:** The database schema was manually modified or migrations were applied outside of the normal migration flow, causing the actual database structure to differ from what Prisma expects based on the migration history.

**Solution:** Reset the database to sync with migration history:
```bash
npx prisma migrate reset --force
```

## Interactive Migration Error

**Error:**
```
Error: Prisma Migrate has detected that the environment is non-interactive, which is not supported.

`prisma migrate dev` is an interactive command designed to create new migrations and evolve the database in development.
To apply existing migrations in deployments, use prisma migrate deploy.
```

**Cause:** The `prisma migrate dev` command requires an interactive terminal, which may not be available in certain environments.

**Solution:** Use `prisma db push` for development instead:
```bash
npx prisma db push --accept-data-loss
```

## Data Loss Warning

**Error:**
```
⚠️  There might be data loss when applying the changes:

• A unique constraint covering the columns `[roomUrl]` on the table `chatrooms` will be added. If there are existing duplicate values, this will fail.
```

**Cause:** Adding a unique constraint to an existing table with potential duplicate values.

**Solution:** Accept data loss in development:
```bash
npx prisma db push --accept-data-loss
```

## Best Practices Learned

1. **Use `prisma db push` for rapid prototyping** - It's more forgiving during development
2. **Reset database when schema drift occurs** - Use `prisma migrate reset --force`
3. **Accept data loss in development** - Use `--accept-data-loss` flag when needed
4. **Regenerate client after schema changes** - Always run `prisma generate` after schema updates

## Commands Reference

```bash
# Reset database and apply all migrations
npx prisma migrate reset --force

# Push schema changes directly to database (development)
npx prisma db push --accept-data-loss

# Generate Prisma client after schema changes
npx prisma generate

# Create new migration (interactive environments only)
npx prisma migrate dev --name migration_name

# Apply existing migrations (production/non-interactive)
npx prisma migrate deploy
```