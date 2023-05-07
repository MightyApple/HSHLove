const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://Aylin:Aylin@hshlove.5qisl3o.mongodb.net/test";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main(){ 
    try {
        await client.connect();
 
    const db = client.db("HSHLove");
    const collection = db.collection("nutzerkonto");
    const newUser = { name: "Max", profilBeschreibung: "Hello World" };

    collection.insertOne(newUser, (err, res) => {
    if (err) throw err;
    console.log("1 Eintrag hinzugefügt");
   });
 
    } catch (e) {
        console.error(e);
    } finally {
       // await client.close();
    }
}

main().catch(console.error);