// mengaktifkan module express
const express = require("express");
// mengaktifkan module body parser
const bodyParser = require("body-parser");
// mengaktifkan module mongoose
const mongoose = require("mongoose");
// mengaktifkan module ejs
const ejs = require("ejs");

// membuat aplikasi express
const app = express();
// membuat port dengan simple if statement
const port = process.env.PORT || 3000;

// memasang view engine ejs
app.set("view engine", "ejs");
// menggunakan body parser mempersingkat JSON parser-ing
app.use(bodyParser.urlencoded({ extended: true }));
// menggunakan express static untuk menjadikan folder public dan mengaktifkan relative path link pada html
app.use(express.static("public"));

// menghubungkan mongo database dengan menggunakan module mongoose sebagai Object Document Mapper
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
// membuat schema untuk menyiapkan property atau field atau nama column dalam sebuah table atau collections
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
// membuat model sebagai kelas yang digunakan untuk dokumen. Dengan ini, setiap dokumen akan menjadi "article" beserta properti dan perilakunya sesuai dengan apa yang telah dinyatakan dari articleSchema.
const Article = mongoose.model("Article", articleSchema);
// test route
app.get("/", (req, res) => {
  res.send("OK !");
});

// menggunakan exress route chainable untuk mempersingkat atau mempermudah dalam  penulisan route
app
  .route("/articles")
  // membuat route articles dan memproses pencarian all data dengan menggunakan model.find({}) serta menggunakan promise then()
  .get((req, res) => {
    Article.find({}).then(
      (resolve) => {
        console.log("resolved");
        res.send(resolve);
      },
      (reject) => {
        console.log("rejected");
        res.send(reject);
      }
    );
  })
  // membuat http request post dan menguji coba request body dari html
  // menguji data request dengan menggunakan aplikasi postman dan code console.log()
  .post((req, res) => {
    // membangun konstruksi document yang dibuat didalam variabel konstan
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    // simpan dokumen ke-database dan memanggil promise then() untuk feedback resolved atau rejected
    newArticle.save().then(
      (resolve) => {
        console.log(resolve);
        res.redirect("/articles");
      },
      (err) => {
        console.log(err);
        res.send(err);
      }
    );
  })
  // menggunakan http request delete
  .delete((req, res) => {
    // menghapus semua data atau dokuemen dalam collection dengan Model.deleteMany()
    Article.deleteMany().then(
      (resolve) => {
        res.send("successfully deleted all articles");
      },
      (reject) => {
        res.send(reject);
      }
    );
  });

// membuat chained route baru yang ber-parameter
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    // Mengumpulkan 1 data dengan Model.findOne()
    Article.findOne({ title: req.params.articleTitle }).then(
      (resolve) => {
        console.log("resolved.");
        res.send(resolve);
      },
      (reject) => {
        console.log(reject);
        res.send("something error !");
      }
    );
  })
  // menggunakan http request put untuk memproses update sesuai dengan metode put
  // metode put diharuskan memasukan semua value sesuai field yang tersedia untuk melakukan update doc.
  .put((req, res) => {
    // merubah data menggunakan Model.updateOne()
    Article.updateOne(
      // kondisi
      { title: req.params.articleTitle },
      // update
      { title: req.body.title, content: req.body.content },
      // opsi
      { upsert: false }
    ).then(
      (resolve) => {
        console.log(resolve);
        res.send("data has been changed.");
      },
      (reject) => {
        console.log("something error.");
        res.send(reject);
      }
    );
  })
  // menggunakan http request patch untuk memproses update dengan syntax mongodb $set
  // Dalam update ini hanya dengan spesifikasi field tertentu saja karena berbeda dari metode put
  .patch((req,res)=> {
    // menggunakan Model.updateOne()
    Article.updateOne(
      // kondisi
      {title: req.params.articleTitle},
      // menggunakan $set untuk menggantikan value pada field tertentu
      // bisa hanya 1 field atau semua field dan berbeda dari metode put
      {$set: req.body}
    ).then(
      (resolve)=>{
        console.log(resolve);
        res.send("data has been changed.");
      },
      (reject)=>{
        console.log(reject);
        res.send("somethings error.");
      }
    );
  })
  // menggunakan http request method delete
  .delete((req,res)=>{
    // menggunakan Model.deleteOne()
    Article.deleteOne(
      // kondisi
      {title: req.params.articleTitle}
    ).then(
      (resolve)=>{
        console.log(resolve);
        res.send("successfully deleted one document.");
      },
      (reject)=>{
        console.log(reject);
        res.send("something wrong");
      }
    );
  });

app.listen(port, () => {
  console.log("working on server " + port);
});
