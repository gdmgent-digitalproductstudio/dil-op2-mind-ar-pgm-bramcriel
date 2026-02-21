# Markers

## Gekozen onderwerp

Voor dit project koos ik als thema **The Lord of the Rings**.  
De AR-interacties draaien rond de corruptie en invloed van **The One Ring**.

## Overzicht van de targets

De volgende afbeeldingen worden gebruikt als image tracking targets:

- `target-0` -> The One Ring
- `target-1` -> The Eye of Sauron
- `target-2` -> Frodo
- `target-3` -> Mount Doom

Alle targets zijn kaarten (Magic: The Gathering-kaarten met Lord of the Rings-thema).

## Wat doet elke marker?

- `target-0` (The One Ring) -> toont een lege ring (`ring_empty.glb`), en na forge de basisring (`ring_base.glb`).
- `target-1` (The Eye of Sauron) -> toont een lege ring, en na forge de groene variant (`ring_green.glb`).
- `target-2` (Frodo) -> toont een lege ring, en na forge de blauwe variant (`ring_blue.glb`).
- `target-3` (Mount Doom) -> toont een lege ring, en na forge de rode variant (`ring_red.glb`).

## Hoe zijn de targets verkregen?

De targets zijn online verkregen via EDHREC.  
Deze afbeeldingen zijn vervolgens gebruikt om het `targets.mind`-bestand te genereren voor MindAR image tracking.
