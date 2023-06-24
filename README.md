### UnX - Unemployment Explorer

## Componența echipei

- Stroescu Tudor-Paul
- Leuștean Ștefan
- Bejan Dragoș

## Link documentatie: https://drive.google.com/drive/folders/1GaekKkP3lfFu21oakAqjLyY2oQj_3rwH?usp=sharing

## Link prezentare video: https://drive.google.com/file/d/14ioRGFxeue_KGV9vrEtSNT_8OP1fytYD/view?usp=sharing

## Instalare

1. Clonati repository-ul.
2. Creati o baza de date PostgreSQL cu numele "unx", iar din pgAdmin: unx -> schemas -> tables -> click dreapta -> query tool, executati scriptul SQL de la urmatorul link: https://gist.github.com/tudstk/b9a34caa27a34a583d22d934640ba45f
3. Din folderul proiectului, executati urmatoarele comenzi din terminal:

- cd src/api
- node server.js

4. Dupa ce ati rulat o data serverul, trebuie inchis, apoi comentata functia "importAllData" din src/api/server.js, si trebuie repornit serverul.
5. Sunt doua optiuni de a da start la frontend:
- din src/views/index.html, porniti extensia "Live Server".
- sau puteti accesa link-ul din descrierea repository-ului (frontend-ul este deployed pe netlify)
