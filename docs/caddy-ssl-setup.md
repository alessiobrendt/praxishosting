# Caddy On-Demand TLS Setup

Diese Anleitung beschreibt, wie Caddy so konfiguriert wird, dass SSL-Zertifikate automatisch für verifizierte Custom Domains ausgestellt werden.

## Voraussetzungen

- Caddy 2.x installiert
- Laravel-Anwendung läuft auf Port 8000 (oder angepasst)
- Domain-Verify-Endpoint ist aktiv unter `/api/verify-domain`

## Caddy-Konfiguration

Erstelle eine `Caddyfile` mit folgender Konfiguration:

```caddyfile
{
    # On-Demand TLS Konfiguration
    on_demand_tls {
        # Laravel-Endpoint zum Verifizieren der Domain
        ask http://127.0.0.1:8000/api/verify-domain
        
        # Rate Limiting: Max 5 Zertifikats-Anfragen pro 2 Minuten
        interval 2m
        burst 5
    }
    
    # Optional: E-Mail für Let's Encrypt
    email admin@praxishosting.de
}

# Haupt-Domain (praxishosting.abrendt.de)
praxishosting.abrendt.de {
    # CORS: Custom Domains laden CSS/JS von der App-URL
    header /build/* Access-Control-Allow-Origin *

    reverse_proxy 127.0.0.1:8000
}

# Wildcard für alle Custom Domains
:443 {
    tls {
        on_demand
    }
    reverse_proxy 127.0.0.1:8000
}

# HTTP zu HTTPS Redirect
:80 {
    redir https://{host}{uri} permanent
}
```

## Wie es funktioniert

1. **Client-Anfrage**: Jemand besucht `kundenomain.de` (die per CNAME auf `praxishosting.abrendt.de` zeigt)
2. **Caddy-Prüfung**: Caddy erhält die HTTPS-Anfrage und hat noch kein Zertifikat für diese Domain
3. **Domain-Verifikation**: Caddy ruft `http://127.0.0.1:8000/api/verify-domain?domain=kundenomain.de` auf
4. **Laravel-Response**: 
   - `200 OK` → Domain ist verifiziert, Caddy stellt Zertifikat aus
   - `403 Forbidden` → Domain ist nicht verifiziert, Anfrage wird abgelehnt
5. **Zertifikat**: Let's Encrypt stellt automatisch ein Zertifikat aus
6. **Caching**: Caddy cached das Zertifikat für zukünftige Anfragen

## Sicherheit

Der Endpoint `/api/verify-domain` prüft:
- Domain existiert in der Datenbank
- `is_verified` = `true`

Rate Limiting verhindert Missbrauch:
- Max 5 neue Zertifikate pro 2 Minuten
- Verhindert Let's Encrypt Rate Limit-Probleme

## Caddy starten

```bash
# Development
caddy run --config Caddyfile

# Production (als Service)
sudo systemctl start caddy
sudo systemctl enable caddy
```

## Debugging

```bash
# Caddy-Logs anzeigen
caddy logs

# Testen des Verify-Endpoints
curl "http://localhost:8000/api/verify-domain?domain=test.de"
# Sollte 403 zurückgeben wenn Domain nicht verifiziert

curl "http://localhost:8000/api/verify-domain?domain=verifizierte-domain.de"
# Sollte 200 zurückgeben wenn Domain verifiziert ist
```

## Wichtige Hinweise

1. **DNS muss korrekt sein**: Die Custom Domain muss per CNAME auf `praxishosting.abrendt.de` zeigen
2. **Firewall**: Port 443 und 80 müssen offen sein
3. **Let's Encrypt Limits**: 50 Zertifikate pro Woche pro Domain
4. **On-Demand TLS ist essenziell**: Ohne dieses Feature müsste jede Domain manuell in die Caddyfile eingetragen werden

## Alternative: Cloudflare

Falls Caddy zu komplex ist, kann auch Cloudflare als SSL-Proxy genutzt werden:
- Kunden aktivieren Cloudflare für ihre Domain
- Cloudflare liefert SSL automatisch
- CNAME zeigt auf `praxishosting.abrendt.de`
