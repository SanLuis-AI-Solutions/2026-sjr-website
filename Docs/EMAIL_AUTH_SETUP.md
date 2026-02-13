# Email Auth Setup (SPF, DKIM, DMARC)

Last verified: 2026-02-11

## Current state (DNS audit)

### `susiesjewelryrepair.com`
- MX: Cloudflare Email Routing (`route1/2/3.mx.cloudflare.net`)
- SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all`
- DKIM: not found
- DMARC: not found

### `sanluisai.com`
- MX: Google Workspace (`aspmx.l.google.com` + alts)
- SPF: `v=spf1 include:_spf.google.com -all`
- DKIM: not found
- DMARC: not found

## Recommended sending alignment

Because SMTP is currently Gmail (`smtp.gmail.com`) with `SMTP_USER=contact@sanluisai.com`, the most reliable authentication alignment is:

1. Use `LEAD_EMAIL_FROM=contact@sanluisai.com` (or another `@sanluisai.com` mailbox).
2. Keep recipient as `LEAD_EMAIL_TO=contact@susiesjewelryrepair.com`.
3. Enable DKIM + DMARC on `sanluisai.com`.

If you must send `From: contact@susiesjewelryrepair.com`, then that domain also needs aligned outbound auth (DKIM for `susiesjewelryrepair.com` + DMARC policy), and your SMTP provider must be authorized for that domain.

## DNS records to add

### For `sanluisai.com` (required now)

1. DKIM (Google Workspace):
- In Google Admin: Apps -> Google Workspace -> Gmail -> Authenticate email.
- Generate/enable DKIM key for selector `google` (or your chosen selector).
- Add TXT record:
  - Host: `google._domainkey`
  - Type: `TXT`
  - Value: `v=DKIM1; k=rsa; p=...` (exact key from Google Admin)

2. DMARC:
- Host: `_dmarc`
- Type: `TXT`
- Value:
  - Start monitoring:
    - `v=DMARC1; p=none; adkim=s; aspf=s; rua=mailto:contact@sanluisai.com; ruf=mailto:contact@sanluisai.com; fo=1; pct=100`
  - After stable monitoring (7-14 days), move to quarantine/reject:
    - `v=DMARC1; p=quarantine; adkim=s; aspf=s; rua=mailto:contact@sanluisai.com; pct=100`
    - then eventually `p=reject`

### For `susiesjewelryrepair.com` (if used as sender domain)

1. Ensure outbound provider alignment for SPF.
2. Add DKIM record for the actual sending provider/domain.
3. Add DMARC record at `_dmarc.susiesjewelryrepair.com`.

## Verification commands

```powershell
nslookup -type=txt _dmarc.sanluisai.com
nslookup -type=txt google._domainkey.sanluisai.com
nslookup -type=txt _dmarc.susiesjewelryrepair.com
```

## App env reminder

- SMTP is already wired in app and tested for auth.
- Keep these set in production:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=465`
  - `SMTP_SECURE=ssl`
  - `SMTP_USER=contact@sanluisai.com`
  - `SMTP_PASS=<Google app password>`
