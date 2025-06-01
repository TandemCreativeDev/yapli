# Domain Setup Guide

## Step 1: Buy a Domain
Choose a domain registrar:
- **Namecheap**
- **GoDaddy** 
- **Cloudflare**
- **Google Domains**

Purchase a domain like `yourchatapp.com`

## Step 2: Configure DNS Records
In your domain provider's DNS settings, add these A records:

```
Type: A
Name: @ (or blank)
Value: 157.90.162.222
TTL: Auto or 300

Type: A  
Name: www
Value: 157.90.162.222
TTL: Auto or 300
```

## Step 3: Set up Reverse Proxy with Caddy

### Install Caddy (Free with automatic SSL)
```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Configure Caddy
```bash
# Create Caddyfile
sudo nano /etc/caddy/Caddyfile
```

Add this configuration (replace with your actual domain):
```
yourdomain.com, www.yourdomain.com {
    reverse_proxy localhost:3000
}
```

### Start Caddy
```bash
sudo systemctl enable --now caddy
```

## What You Get

✅ **Free SSL Certificates** - Caddy automatically handles Let's Encrypt certificates  
✅ **Automatic HTTPS** - All traffic redirected to HTTPS  
✅ **Auto-renewal** - Certificates renew automatically  
✅ **Green Lock Icon** - Professional HTTPS setup  

## Access Your Site

After DNS propagates (5-10 minutes), your application will be available at:
- `https://yourdomain.com`
- `https://www.yourdomain.com`

Both will automatically redirect to HTTPS and show the green lock icon.

## Notes

- Caddy is completely free for this use case
- SSL certificates are provided free by Let's Encrypt
- No manual certificate management required
- DNS propagation can take 5-60 minutes depending on your provider