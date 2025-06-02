# Authentication Production Deployment Plan

## Overview

This document outlines the deployment plan for the NextAuth.js authentication system to a Hetzner production server.

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://zest_user:secure_password@localhost:5432/zest_prod"

# NextAuth.js
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-key-64-chars-long"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"
```

### Security Considerations

1. **NEXTAUTH_SECRET**: Generate a secure 64-character secret:
   ```bash
   openssl rand -base64 64
   ```

2. **Database Credentials**: Use strong passwords for production database user

3. **OAuth Redirect URIs**: Update OAuth app configurations to use production domain:
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - GitHub: `https://yourdomain.com/api/auth/callback/github`

## Database Migration

### 1. Backup Current Database
```bash
pg_dump -h localhost -U current_user -d zest_current > backup_before_auth.sql
```

### 2. Run Prisma Migration
```bash
# Generate Prisma client with new schema
npx prisma generate

# Push schema changes to production database
npx prisma db push --accept-data-loss

# Alternative: Create and run migration
npx prisma migrate deploy
```

### 3. Verify Migration
```bash
# Check that new tables exist
psql -d zest_prod -c "\dt"

# Should show: users, accounts, sessions, verification_tokens, chatrooms
```

## OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret to environment variables

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App:
   - Application name: Yapli Chat
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
3. Copy Client ID and Client Secret to environment variables

## Server Configuration

### 1. Update Reverse Proxy (Nginx/Apache)

Ensure your reverse proxy forwards auth routes correctly:

```nginx
# Nginx configuration
location /api/auth {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 2. SSL Certificate

Ensure HTTPS is configured for authentication security:
```bash
# Using Let's Encrypt
certbot --nginx -d yourdomain.com
```

### 3. Environment File Security

```bash
# Set proper permissions on .env file
chmod 600 .env

# Ensure .env is owned by app user
chown appuser:appuser .env
```

## Deployment Steps

### 1. Pre-deployment Checklist

- [ ] Database backup completed
- [ ] OAuth providers configured with production URLs
- [ ] SSL certificate installed and verified
- [ ] Environment variables prepared
- [ ] Prisma schema changes reviewed

### 2. Deployment Process

```bash
# 1. Pull latest code
git pull origin auth

# 2. Install dependencies
npm ci

# 3. Update environment variables
cp .env.example .env
# Edit .env with production values

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migration
npx prisma db push

# 6. Build application
npm run build

# 7. Restart application
pm2 restart zest
# or
systemctl restart zest
```

### 3. Post-deployment Verification

```bash
# Test authentication endpoints
curl -I https://yourdomain.com/api/auth/providers
curl -I https://yourdomain.com/api/auth/signin

# Test OAuth redirects
curl -I https://yourdomain.com/auth/signin

# Check application logs
pm2 logs zest
# or
journalctl -u zest -f
```

## Rollback Plan

### In Case of Issues

1. **Database Rollback**:
   ```bash
   # Restore from backup
   psql -d zest_prod < backup_before_auth.sql
   ```

2. **Application Rollback**:
   ```bash
   # Switch back to main branch
   git checkout main
   npm ci
   npm run build
   pm2 restart zest
   ```

3. **Environment Rollback**:
   ```bash
   # Remove auth environment variables
   # Keep only original DATABASE_URL
   ```

## Monitoring and Maintenance

### 1. Authentication Metrics

Monitor these endpoints for errors:
- `/api/auth/*` - Authentication endpoints
- `/auth/signin` - Sign-in page
- `/auth/register` - Registration page
- `/dashboard` - Protected dashboard

### 2. Database Monitoring

```sql
-- Monitor user registrations
SELECT DATE(created_at), COUNT(*) 
FROM users 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) DESC;

-- Monitor session activity
SELECT COUNT(*) as active_sessions 
FROM sessions 
WHERE expires > NOW();

-- Monitor OAuth vs credentials usage
SELECT 
  CASE 
    WHEN password IS NOT NULL THEN 'credentials'
    ELSE 'oauth'
  END as auth_type,
  COUNT(*)
FROM users
GROUP BY auth_type;
```

### 3. Security Monitoring

- Monitor failed login attempts
- Set up alerts for unusual authentication patterns
- Regular review of OAuth application permissions
- Monitor for expired sessions cleanup

## Troubleshooting

### Common Issues

1. **JWT Decryption Errors**:
   - Verify NEXTAUTH_SECRET is set correctly
   - Check that secret hasn't changed between deployments

2. **OAuth Callback Errors**:
   - Verify redirect URIs match exactly in OAuth provider settings
   - Check NEXTAUTH_URL matches production domain

3. **Database Connection Issues**:
   - Verify DATABASE_URL format and credentials
   - Check database user permissions for new tables

4. **Session Not Persisting**:
   - Check NEXTAUTH_URL is set to production domain
   - Verify cookie settings for HTTPS

### Debug Commands

```bash
# Check environment variables
printenv | grep NEXTAUTH

# Test database connection
npx prisma db pull

# Check OAuth provider configuration
curl https://yourdomain.com/api/auth/providers

# View application logs
pm2 logs zest --lines 100
```

## Security Best Practices

### 1. Environment Security
- Never commit `.env` files to version control
- Use strong, unique passwords for all accounts
- Rotate OAuth secrets periodically

### 2. Database Security
- Use dedicated database user with minimal required permissions
- Enable database connection encryption
- Regular database backups with encryption

### 3. Application Security
- Keep NextAuth.js and dependencies updated
- Monitor for security advisories
- Implement rate limiting on authentication endpoints
- Use HTTPS everywhere

### 4. OAuth Security
- Regularly review OAuth application permissions
- Monitor for suspicious OAuth activity
- Use principle of least privilege for OAuth scopes

## Performance Considerations

### 1. Session Storage
- Current setup uses JWT tokens (stateless)
- Consider database sessions for better security at scale
- Monitor session cleanup for database strategy

### 2. Database Optimization
- Add indexes on frequently queried user fields
- Monitor query performance on users table
- Consider connection pooling for high traffic

### 3. Caching
- Consider caching user sessions at application level
- Implement proper cache invalidation strategies
- Monitor authentication endpoint response times

## Maintenance Schedule

### Weekly
- [ ] Review authentication logs for anomalies
- [ ] Check OAuth provider status and quotas
- [ ] Monitor user registration trends

### Monthly
- [ ] Update dependencies and security patches
- [ ] Review and rotate OAuth secrets if needed
- [ ] Analyze authentication performance metrics
- [ ] Database cleanup of expired sessions

### Quarterly
- [ ] Full security audit of authentication system
- [ ] Review and update OAuth application configurations
- [ ] Performance optimization review
- [ ] Disaster recovery testing