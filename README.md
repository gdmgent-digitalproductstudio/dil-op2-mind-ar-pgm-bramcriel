# The One Ring - AR Experience

## Concept

Dit project is een interactieve Augmented Reality (AR)-ervaring gebaseerd op het thema van _The Lord of the Rings_ (J. R. R. Tolkien).

De kern van het concept draait rond de corruptie van **The One Ring** en de invloed ervan op de drager.

De gebruiker kan:

- de Ring manipuleren via image tracking (kaarten als markers);
- de Ring "smelten" in een "forge";
- de corruptie visueel ervaren via face tracking (rode ogen, corruption meter, aangepaste ring states);

Het project combineert:

- image tracking (kaarten als AR-targets);
- face tracking (visuele effecten op het gezicht);
- interactieve UI-elementen (progress bars, knoppen, meter);

Doel: een thematische en immersive AR-ervaring creeren waarin de gebruiker letterlijk de invloed van de Ring ondergaat.

## Onderzoek

Voor dit project werd gebruik gemaakt van:

- A-Frame (WebXR framework);
- MindAR voor:
  - image tracking;
  - face tracking;
- GLB 3D-modellen;
- HTML / CSS / JavaScript;

Wat onderzocht werd:

- hoe face anchors werken in MindAR;
- hoe image tracking targets gegenereerd worden via `targets.mind`;
- hoe emissive materials en blending gebruikt kunnen worden voor glow-effecten;
- performance-optimalisatie voor mobiel gebruik;
- hoe we schakelen tussen verschillende 3D objecten in MindAR;

## Uitleg Interacties

### 1. Hoofdpagina

- navigatie naar:
  - image tracking;
  - face tracking;

### 2. Image Tracking (Corrupt the Ring)

Wanneer een kaart wordt herkend:

- een 3D Ring verschijnt op kaart;
- de Ring roteert;

Forge:

- via een "Forge" knop, verandert de staat van de Ring;
- de "corrupted" versie van de ring is afhankelijk van de geselecteerde kaart;

### 3. Face Tracking (Face the Ring)

Wanneer het gezicht wordt herkend:

- de Ring verschijnt op het gezicht;
- een corruption meter start;

Bij hogere corruptie:

- oog-glow effect wordt zichtbaar;
- visuele intensiteit neemt toe;
- bij 100% verandert de ring;
-

Knop:

- "Resist the Ring" verlaagt de corruptie;
- de visuele effecten verminderen;

## Bronnen

- A-Frame documentatie: <https://aframe.io/docs/>
- MindAR documentatie: <https://hiukim.github.io/mind-ar-js-doc/>
- Image Targets Compiler: <https://hiukim.github.io/mind-ar-js-doc/tools/compile/>
- Marker card images: <https://edhrec.com/top>
- 3D ring model: <https://sketchfab.com/3d-models/the-one-ring-a50b517d3c414e7da7911041efa6a9c7>

De andere models werden zelf gemaakt, met het bovenstaande model als basis.

## Licenties

- Dit project is educatief en niet-commercieel.
- De gebruikte kaarten (Magic: The Gathering - Lord of the Rings set) zijn eigendom van Wizards of the Coast.
- De modellen en code in dit project zijn enkel voor educatief gebruik binnen deze opdracht.
- Er worden geen assets commercieel verspreid.

## Evaluatie-instructies

Voor image tracking moeten volgende kaarten getoond/geprint worden:

- The One Ring;
- The Eye of Sauron;
- Frodo;
- Mount Doom.

Zonder deze kaarten kan de AR image tracking niet correct gedemonstreerd worden.

## Conclusie

Dit project combineert storytelling en interactieve technologie om het centrale thema van corruptie rond The One Ring tastbaar te maken via Augmented Reality.

Door image tracking en face tracking te combineren ontstaat een samenhangende ervaring waarin de gebruiker zowel de Ring manipuleert als erdoor beinvloed wordt.
