# VPS Deployment Guide for Cobra Launch

This guide will help you deploy the Cobra Launch Solana token launcher on your VPS.

## Prerequisites

- A VPS with Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- npm or yarn package manager
- A domain name (optional, but recommended)
- SSL certificate (for HTTPS, recommended)

## 1. Initial Setup

### Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Clone or Upload Your Repository

```bash
cd /var/www
git clone <your-repo-url> cobra-launch
cd cobra-launch
```

## 2. Configuration

### Create Environment File

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```bash
nano .env
```

**Required Configuration:**

```env
# Pinata JWT for IPFS uploads (REQUIRED)
VITE_PINATA_JWT=your_pinata_jwt_here

# Pinata Gateway (REQUIRED)
VITE_PINATA_GATEWAY=https://your-gateway.mypinata.cloud

# Solana Network (mainnet-beta for production)
VITE_SOLANA_NETWORK=mainnet-beta

# Optional: Custom RPC Endpoint (recommended for production)
# VITE_SOLANA_RPC_ENDPOINT=https://your-custom-rpc.com
```

### Install Dependencies

```bash
npm install
```

## 3. Build the Application

Build the production bundle:

```bash
npm run build
```

This will create a `dist` folder with your production-ready application.

## 4. Deployment Options

### Option A: Using Nginx (Recommended)

#### Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

#### Configure Nginx

Create a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/cobra-launch
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/cobra-launch/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cobra-launch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Add SSL with Let's Encrypt (Recommended)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option B: Using a Development Server with PM2

If you prefer to run the dev server (not recommended for production):

#### Install PM2

```bash
sudo npm install -g pm2
```

#### Create PM2 Configuration

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'cobra-launch',
    script: 'npm',
    args: 'run dev',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF
```

#### Start the Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 5. Firewall Configuration

Allow HTTP and HTTPS traffic:

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 6. Updating the Application

To update your application:

```bash
cd /var/www/cobra-launch
git pull
npm install
npm run build
sudo systemctl restart nginx  # if using nginx
# OR
pm2 restart cobra-launch  # if using PM2
```

## 7. Monitoring and Logs

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### PM2 Logs (if using PM2)

```bash
pm2 logs cobra-launch
```

## 8. Security Considerations

1. **Environment Variables**: Never commit your `.env` file to version control
2. **SSL/HTTPS**: Always use HTTPS in production
3. **RPC Endpoint**: Use a paid RPC service for better reliability and rate limits
4. **Firewall**: Keep your firewall enabled and configured properly
5. **Updates**: Regularly update your system and dependencies

## 9. Performance Optimization

### Use a Custom RPC Provider

For production, use a custom RPC provider like:
- QuickNode
- Alchemy
- Helius
- Triton

Add it to your `.env`:

```env
VITE_SOLANA_RPC_ENDPOINT=https://your-custom-rpc-endpoint.com
```

### Enable Nginx Caching

Add to your nginx configuration:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
```

## 10. Troubleshooting

### Application won't build

- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Wallet connections not working

- Verify you're using HTTPS (required for wallet adapters)
- Check browser console for errors
- Ensure your domain is properly configured

### Pinata uploads failing

- Verify your `VITE_PINATA_JWT` is correct
- Check Pinata dashboard for API limits
- Ensure your JWT hasn't expired

## Support

For issues or questions, please check:
- Solana Wallet Adapter documentation
- Pinata documentation
- Project repository issues

---

**Current Configuration:**
- Network: Mainnet Beta
- Wallet Support: Phantom, Solflare
- IPFS Provider: Pinata
