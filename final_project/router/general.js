const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


 const doesExist = (username) =>{
  let userByUsername = users.filter((user) => { return user.username === username})
  if(userByUsername.length > 0){
    return true}
    else{
      return false
    }

}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
let username = req.body.username;
let password = req.body.password;

if (username && password)
{ 
  if(!doesExist(username)){

users.push({"username": username , "password": password})
return res.status(200).json({message: "User successfully registred. Now you can login"});
}
else{
  return res.status(404).json({message: "username already exists!"});
 
}}
else{
  return res.status(404).json({message:"unable to register!"})
}
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
  
//   res.send(JSON.stringify(books),null,10)
 
// });



public_users.get('/',async function (req, res) {
  try

  { const listBokks = await getBookList(); 
    res.send(JSON.stringify(books),null,10)
   }
   catch (err){
    res.status(500).send('Error fetching book List ')
   }
  });



  function getBookList(){
    return new Promise((resolve)=>{setTimeout(()=>{resolve(books)},100)})
  }





// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
 
//   const isbn = req.params.isbn;
//   let bookByIsbn = books[isbn];
//   if(bookByIsbn){ res.send(bookByIsbn); }else{res.status(404).body.JSON({message:"book not found !"})}
 
//  });
// Get book details based on ISBN with async 
public_users.get('/isbn/:isbn',async function (req, res) {

 
  try {const isbn = req.params.isbn;
  let bookByIsbn = await getBookDetails(isbn);//books[isbn];
  if(bookByIsbn){ res.send(bookByIsbn); }else{res.status(404).body.JSON({message:"book not found !"})}
 } catch(error)
{
  res.status(500).send("Error fetching book details.")
} });

 function getBookDetails(isbn){
  return new Promise((resolve)=>{setTimeout(()=>{const bookByIsbn = books[isbn];
    resolve(bookByIsbn);},1000)})
 }
  
 // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//  const authorName = req.params.author;
//   const listBook =  []
//  for(const bookId in books){
//   const book = books[bookId];
//   if (book.author === authorName)
//   {
// listBook.push(book);

//   }
//  }
//  if (listBook.length > 0) {
//       res.send(listBook);
//     } else {
//      res.status(404).send("No books found for the given author"); 
//    }
// });


// Get book details based on author with async & await
public_users.get('/author/:author',async function (req, res) {
  const authorName = req.params.author;
  
 try {
  const  listBook = await getBookByAuthor(authorName);
  if (listBook.length > 0) {
 
       res.send(listBook);
     } else {
      res.status(404).send("No books found for the given author"); 
    }}
    catch(error){
      res.status(500).send("Error fetching book by author.")
    }
 });


function getBookByAuthor(author){
  return new Promise((resolve)=>{setTimeout(()=>{ 
    const listBook =  [];
     for(const bookId in books){
      const book = books[bookId];
      if (book.author === author)
      {
    listBook.push(book);
    
      }
     };
   
    resolve(listBook)
  },
    1000)})
}


// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//  const title = req.params.title;
//  const bookMatching = []
//  for (const bookId in books){
//   const book = books[bookId];
//   if(book.title === title){
//     bookMatching.push(book);

//   }

// }
// if(bookMatching.length>0)
// {   res.send(bookMatching)}
// else{
//   res.status(404).send("No books found for the given author");
// }
// });


// Get all books based on title withasynnc & await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
 const bookMatching = await getBookByTitle(title);

 try
 {if(bookMatching.length>0)
 {   res.send(bookMatching)}
 else{
   res.status(404).send("No books found for the given author");
 }}
 catch(error){
  res.status(500).send("Error fetching book by title")
 }
 });
 
function getBookByTitle(title){
  return new Promise((resolve) =>{setTimeout(()=>{
    const bookMatching = []
  for (const bookId in books){
   const book = books[bookId];
   if(book.title === title){
     bookMatching.push(book);
 
   }
 
 }
 resolve(bookMatching)

  }, 1000)})
}



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  const bookReviews = book.reviews;
  if(book){
res.send(bookReviews);
  }else{
    res.status(404).send("No books found for the given isbn");
  }
});

module.exports.general = public_users;
