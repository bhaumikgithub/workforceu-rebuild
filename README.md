# 🧩 **WorkForceU** — A modern, Next.js-powered platform for effortless workforce scheduling, tracking, and performance management.

**Tech Stack**:  
Next.js • React • Tailwind CSS • Next.js API Routes • MySQL/PostgreSQL/MongoDB • Redux Toolkit/Zustand

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

---

## 🔑 2. Git Remote URL Setup

To make sure you can push and pull without errors:

```bash
git remote set-url origin https://bhaumikgithub@github.com/bhaumikgithub/workforceu-rebuild.git
```

---

## 📂 3. Git Credentials Setup

If you don’t want to enter your username/password every time:

1. Get the `.git-credentials` file from **Kinjal**.  
   This file should contain:
   ```
   https://<your-username>:<your-personal-access-token>@github.com
   ```

2. Configure Git to use it:
   ```bash
   git config --global credential.helper store
   git config --global credential.useHttpPath true
   ```

3. Verify:
   ```bash
   git config --global --list
   ```

---

## 🖥 4. Run the Next.js server:
```bash
npm run dev
```
Default port: `http://localhost:3000`

---

## 🌐 5. Setup Subdomains (Virtual Hosts with Proxy)

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
Append:
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
Restart Apache using WAMP.

---

## 💡 How It Works
- Visiting `http://protovate.wfu.net` or `http://admin.wfu.net` proxies to the local Next.js app.
- The app extracts the **subdomain** (e.g., `protovate`) and routes to its specific login logic.

---

## 🔐 Default Admin Credentials
- **Email:** `admin@wfu.net`
- **Password:** `admin123`

---

## 📂 Folder Structure
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
- http://admin.wfu.net  
- http://protovate.wfu.net  

---

## 📝 License
MIT — use freely and adapt for your needs.

---

## ✉️ Support
For help or customization, reach out to the project maintainer.
