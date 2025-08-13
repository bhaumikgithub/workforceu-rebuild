# 🧩 **WorkForceU** — A modern, Next.js-powered platform for effortless workforce scheduling, tracking, and performance management.

**Tech Stack**: Next.js • React • Tailwind CSS • Next.js API Routes • MySQL/PostgreSQL/MongoDB • Redux Toolkit/Zustand

It runs in a **WAMP (Apache)** environment using **virtual hosts** that proxy requests to the Next.js dev server.

---

## 🛠 Requirements

- **Node.js** v18 or higher
- **WAMP Server** (Windows — Apache)
- **npm** or **yarn**
- **Windows OS** (for WAMP setup)
- **Admin rights** to edit the `hosts` file

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

### 2. Run the Next.js server:

```bash
npm run dev
```

Default port: `http://localhost:3000`

---

## 🌐 Setup Subdomains (Virtual Hosts with Proxy)

### ✅ Step 1: Edit Windows Hosts File

Open `C:\Windows\System32\drivers\etc\hosts` as Administrator and add:

```
127.0.0.1 wfu.net
127.0.0.1 admin.wfu.net
127.0.0.1 protovate.wfu.net
```

### ✅ Step 2: Apache Virtual Host Configuration

Open `httpd-vhosts.conf` in:

```
C:\wamp64\bin\apache\apache2.x.x\conf\extra\httpd-vhosts.conf
```

Append the following:

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

### ✅ Step 3: Enable Apache Proxy Modules

Open `httpd.conf` and ensure these lines are **uncommented**:

```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

### ✅ Step 4: Restart WAMP Server

After saving all changes, restart Apache using WAMP.

---

## 💡 How It Works

- Accessing `http://protovate.wfu.net` or `http://admin.wfu.net` will proxy to your local Next.js app.
- The app extracts the **subdomain** (e.g., `protovate`) and routes to its specific login logic.
- The default admin login credentials redirect to `/admin-dashboard`.
- From the dashboard, admin can create users under different subdomains.

---

## 🔐 Default Admin Credentials

- **Email:** `admin@wfu.net`
- **Password:** `admin123`

> You can change these in the mock API or database later.

---

## 📂 Folder Structure Overview

```
src/
  └── app/
       ├── layout.tsx
       ├── page.tsx (redirects to subdomain)
       └── login/
             └── page.tsx (login form)
       └── admin-dashboard/
             └── page.tsx (admin dashboard)
  └── lib/
       └── utils.ts (helper to get subdomain)
```

---

## 🧪 Test Your Setup

Try visiting:

- http://admin.wfu.net
- http://protovate.wfu.net

The system should route to the appropriate login screen based on subdomain.

---

## 📝 License

MIT — use freely and adapt for your needs.

---

## ✉️ Support

For help or customization, feel free to reach out.

## Subdomain Setup Instructions

### For Windows (using WAMP and Virtual Hosts)

1. **Edit `hosts` file**:
   - Path: `C:\Windows\System32\drivers\etc\hosts`
   - Add entries:
     ```
     127.0.0.1   wfu.net
     127.0.0.1   admin.wfu.net
     127.0.0.1   protovate.wfu.net
     ```

2. **Configure WAMP Virtual Hosts**:
   - Open WAMP → Apache → `httpd-vhosts.conf` file.
   - Add:
     ```apache
     <VirtualHost *:80>
         ServerName admin.wfu.net
         DocumentRoot "C:/path/to/your/project"
     </VirtualHost>

     <VirtualHost *:80>
         ServerName protovate.wfu.net
         DocumentRoot "C:/path/to/your/project"
     </VirtualHost>
     ```

3. **Restart WAMP Server**.

4. **Start Next.js app**:
   ```bash
   npm run dev
   ```

---

### For Linux (using Apache or Nginx)

1. **Edit `/etc/hosts`**:
   ```bash
   sudo nano /etc/hosts
   ```
   Add:
   ```
   127.0.0.1   wfu.net
   127.0.0.1   admin.wfu.net
   127.0.0.1   protovate.wfu.net
   ```

2. **Create Virtual Hosts** (Apache Example):
   ```bash
   sudo nano /etc/apache2/sites-available/admin.wfu.net.conf
   ```
   Add:
   ```apache
   <VirtualHost *:80>
       ServerName admin.wfu.net
       DocumentRoot /path/to/your/project
   </VirtualHost>
   ```

   Enable site and restart Apache:
   ```bash
   sudo a2ensite admin.wfu.net.conf
   sudo systemctl restart apache2
   ```

3. **Start Next.js app**:
   ```bash
   npm run dev
   ```

---

You can now access the project from subdomains like `http://wfu.net:3000` or `http://admin.wfu.net:3000` or `http://protovate.wfu.net:3000`.