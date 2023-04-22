Moin ihr Lackaffen. In der Readme findet ihr alle wichtigsten infos zu MongoDB.

1.)	Die MongoDB installation findet ihr hier : https://www.mongodb.com/docs/manual/installation/
	Einfach die Community edition downloaden und installieren

2.)	MongoDB Shelldownload findet ihr hier : https://www.mongodb.com/try/download/shell
	Speichert und extrahiert die Datei einfach iwo wo sie sicher ist. Dann geht ihr in die umgebungsvariablen eures PCs und gibt in PATH die location des bin ordners an.
	Wenn ihr das richtig gemacht habt solltet ihr cmd öffnen können und einfach "mongosh --help" eingeben können. Wenn nichts passiert habt ihr es verbockt.

Vorab paar nützliche Quellen: 
Ein MongoDB CheetSheet mit vielen Commands:------ https://www.mongodb.com/developer/products/mongodb/cheat-sheet/ 

3.)	Speicherort eurer Databases ändern.
	Geht hierfür in euereb MongoDB installationsordner und findet die mongod.confiq datei (Bsp meiner: C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg)
	Öffnen und bearbeitet die Zeile 8 -> dbPath: Euer Git speicherort von HSHL\HSHLove\Datenbank\data. (Bsp von mir: dbPath: S:\Hochschule\HSHLove\Datenbank\data)
	dann müsst ihr den PC neustarten und es sollte alles funktionieren.

	Falls Ihr mit der Datenbank selber arbeitet. Heißt queries schreibt oder liest solltet ihr euch nen kleinen Crashcourse anschauen. Falls nicht reicht die ledigliche Installation aus

Das wars :D