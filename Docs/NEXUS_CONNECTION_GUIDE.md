# SJR Content Nexus: Connection & Token Guide

Use this guide to gather the necessary "keys" to activate the full automation power of your dashboard.

## 🟩 Master Checklist
| Platform | Requirement | Status | Env Var Name |
| :--- | :--- | :--- | :--- |
| **Meta** | Page Access Token | ⏳ Pending | `NEXUS_META_ACCESS_TOKEN` |
| **Google Business**| Refresh Token | ⏳ Pending | `NEXUS_GBP_ACCESS_TOKEN` |
| **X (Twitter)** | Bearer Token | ⏳ Pending | `NEXUS_X_ACCESS_TOKEN` |
| **Pinterest** | Board Access Token | ⏳ Pending | `NEXUS_PINTEREST_ACCESS_TOKEN` |
| **LinkedIn** | OAuth2 Token | ⏳ Pending | `NEXUS_LINKEDIN_ACCESS_TOKEN` |

---

## 🟦 Meta (Facebook/Instagram) Setup
1.  Navigate to [Meta for Developers](https://developers.facebook.com/).
2.  Click **My Apps** > **Create App** > **Business**.
3.  Add **Facebook Login for Business** and **Page Public Content Access**.
4.  Use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) to generate a "Long-Lived" token that won't expire every 60 days.

## 🟨 Google Business Profile Setup
1.  Open the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a project named `SJR-Nexus-Automation`.
3.  Enable the **Google My Business API**.
4.  Create **OAuth 2.0 Client IDs** and authorize the `https://www.googleapis.com/auth/business.manage` scope.

## ⬛ X (Twitter) Setup
1.  Go to the [X Developer Portal](https://developer.x.com/).
2.  Apply for a **Basic** account (Free tier allows posting).
3.  Create a Project and App.
4.  Regenerate **API Key & Secret** and **Access Token & Secret**.
5.  Ensure permissions are set to **"Read and Write"**.

---

## 🛠 How to Add These to the Website
Once you have a token:
1.  Log in to your **Vercel Dashboard**.
2.  Go to **Settings > Environment Variables**.
3.  Add the key name (e.g., `NEXUS_X_ACCESS_TOKEN`) and paste your token value.
4.  Trigger a "Redeploy" and your Nexus dashboard Pulse will turn **Green (Live)**.

---
**Need Help?** Just ask Antigravity to "Assist with [Platform] connection."
