# PD Production — website

Statische website (HTML/CSS/JS). Klaar voor **GitHub Pages**.

## Bestanden
- `index.html` · `over-ons.html` · `portfolio.html` · `contact.html`
- `styles.css`, `site.js`, `tweaks.js`
- `images/` — alle foto's (geoptimaliseerd voor web) + logo's
- `videos/` — de portfoliofilmpjes
- `.nojekyll` — laat GitHub de map ongemoeid serveren

## Online zetten via GitHub Pages
1. Maak een nieuwe repository aan op github.com.
2. Upload de **inhoud van deze map** (dus `index.html` in de hoofdmap van de repo).
3. Ga naar **Settings → Pages**.
4. Bij *Source*: kies **Deploy from a branch**, branch **main**, map **/ (root)**. Save.
5. Na ~1 minuut staat de site op `https://<gebruikersnaam>.github.io/<repo>/`.

### Eigen domein (bijv. pdproduction.nl)
- Koop het domein bij een registrar.
- Settings → Pages → *Custom domain* → vul je domein in.
- Zet bij je registrar de DNS-records zoals GitHub aangeeft (A-records / CNAME).

## Contactformulier activeren (Web3Forms — gratis)
Het formulier werkt zonder server via Web3Forms.
1. Ga naar https://web3forms.com en vul je e-mailadres in → je krijgt een **Access Key**.
2. Open `contact.html`, zoek `name="access_key" value="VERVANG_MIJ"`.
3. Vervang `VERVANG_MIJ` door je eigen key. Klaar — inzendingen komen in je mailbox.

Zolang de key niet is ingevuld, toont het formulier alleen de bedank-melding (demo).

## Tip: video's
De filmpjes in `videos/` zijn relatief zwaar. Wil je de site nóg sneller maken,
comprimeer ze dan (bijv. via HandBrake) voordat je ze upload.
