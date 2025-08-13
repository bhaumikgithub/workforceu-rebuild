🧩 **WorkForceU** — A modern, Next.js-powered platform for effortless workforce scheduling, tracking, and performance management.

**Tech Stack**: Next.js • React • Tailwind CSS • Next.js API Routes • MongoDB (via Prisma) • Redux Toolkit/Zustand

It runs in:
- **Windows (WAMP + Apache)** using **Virtual Hosts** that proxy requests to the Next.js dev server.
- **Ubuntu (Apache or Nginx)** using **Virtual Hosts** or Reverse Proxy.

---

## 🛠 Requirements

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Windows or Ubuntu OS**
- **Admin rights** to edit the `hosts` file
- MongoDB (local or cloud)

---

## 🚀 1. Project Setup

### Clone the repository:
```bash
git clone https://github.com/bhaumikgithub/workforceu-rebuild.git
cd workforceu-rebuild
npm install
```

_or_
```bash
yarn install
```

> ℹ️ If you have push/pull permission issues, update `.git/config` with the correct remote:
```bash
git remote set-url origin https://github.com/bhaumikgithub/workforceu-rebuild.git
```
And use the `~/.git-credentials` file from Kinjal with the line:
```
https://<username>:<token>@github.com
```

---

### 2. Run the Next.js server (dev mode):
```bash
npm run dev
```
Default port: `http://localhost:3000`

---

## 🌐 Setup Subdomains (Virtual Hosts with Proxy)

### **Windows (WAMP + Apache)**

#### ✅ Step 1: Edit Hosts File
Open `C:\Windows\System32\drivers\etc\hosts` as Administrator and add:
```
127.0.0.1 wfu.net
127.0.0.1 admin.wfu.net
127.0.0.1 protovate.wfu.net
```

#### ✅ Step 2: Apache Virtual Host Configuration
Edit:
```
C:\wamp64\bin\apache\apache2.x.x\conf\extra\httpd-vhosts.conf
```
Add:
```apache
<VirtualHost *:80>
    ServerName wfu.net
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>

<VirtualHost *:80>
    ServerName admin.wfu.net
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>

<VirtualHost *:80>
    ServerName protovate.wfu.net
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

#### ✅ Step 3: Enable Apache Proxy Modules
In `httpd.conf` ensure:
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

Restart WAMP after changes.

---

### **Ubuntu (Apache)**

#### ✅ Step 1: Edit `/etc/hosts`
```bash
sudo nano /etc/hosts
```
Add:
```
127.0.0.1 wfu.net
127.0.0.1 admin.wfu.net
127.0.0.1 protovate.wfu.net
```

#### ✅ Step 2: Create Virtual Hosts
```bash
sudo nano /etc/apache2/sites-available/wfu.net.conf
```
Add:
```apache
<VirtualHost *:80>
    ServerName wfu.net
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

Do the same for `admin.wfu.net` and `protovate.wfu.net`.

#### ✅ Step 3: Enable Configurations
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2ensite wfu.net.conf
sudo a2ensite admin.wfu.net.conf
sudo a2ensite protovate.wfu.net.conf
sudo systemctl restart apache2
```

---

### **Ubuntu (Nginx)**

#### ✅ Step 1: Edit `/etc/hosts`
```bash
sudo nano /etc/hosts
```
Add:
```
127.0.0.1 wfu.net
127.0.0.1 admin.wfu.net
127.0.0.1 protovate.wfu.net
```

#### ✅ Step 2: Create Nginx Server Blocks
```bash
sudo nano /etc/nginx/sites-available/wfu.net
```
Add:
```nginx
server {
    listen 80;
    server_name wfu.net;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Repeat for `admin.wfu.net` and `protovate.wfu.net`.

#### ✅ Step 3: Enable Configurations
```bash
sudo ln -s /etc/nginx/sites-available/wfu.net /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.wfu.net /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/protovate.wfu.net /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🔐 Default Admin Credentials
- **Email:** `admin@wfu.net`
- **Password:** `admin123`

---

## 📂 Folder Structure Overview
```
src/
  └── app/
       ├── layout.tsx
       ├── page.tsx
       └── login/
             └── page.tsx
       └── admin-dashboard/
             └── page.tsx
  └── lib/
       └── utils.ts
```

---

## 🧪 Test Your Setup
Visit:
- http://wfu.net
- http://admin.wfu.net
- http://protovate.wfu.net

---

## 📝 License
MIT

---

## ✉️ Support
For help or customization, reach out to the development team.
