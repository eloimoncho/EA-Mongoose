import { Schema, model, connect, ObjectId, Model } from 'mongoose';
import { query } from 'express';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
  products: ObjectId[];
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});


// 1. Create an interface representing a document in MongoDB.
interface IProduct {
  name: string;
  user: ObjectId;
  description?: string;
}

// 2. Create a Schema corresponding to the document interface.
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String,    
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

// 3. Create a Model. --> Función crear del CRUD
const Subject = model<IProduct>('Subject', productSchema);


async function create() {
  // 4. Connect to MongoDB
  await connect('mongodb://127.0.0.1:27017/test');

  const user1 = new User({
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  });
  await user1.save()
  .then(() => {
    const product1 = new Subject({
      name: 'Agua',
      user: user1._id    // assign the _id from the person
    });
  
    product1.save().catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));;

  const user2 = new User({
    name: 'Eloi',
    email: 'eloimoncho@gmail.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  });
  
  await user2.save()
  .then(() => {
    const product2 = new Subject({
      name: 'Aquarius',
      user: user2._id    // assign the _id from the person
    });
  
    product2.save().catch((err) => console.log(err));

    const product1 = new Subject({
      name: 'Agua',
      user: user2._id    // assign the _id from the person
    });

    product1.save().catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));

}

//CRUD

async function readUser(email: string): Promise<IUser | null> { // Función buscar del CRUD
  const user = await User.findOne({email});  
  return user;
}

async function deleteUser(email: string): Promise<void> { // Función eliminar del CRUD
  await User.deleteOne({ email });
}

async function updateUserName(mail: string, newName: string): Promise<void> { //Función editar del CRUD
  await User.updateOne({ email: mail }, { $set: { name: newName } });
}

async function getAllUsers() {
  const users = await User.find();
  return users;
}

create()
.then(() => {
  readUser("bill@initech.com")
  .then((user) => {
    console.log(`Función de READ Bill: 
    ${user}`)

    readUser("eloimoncho@gmail.com")
    .then((user) => {
      console.log(`Función de READ Eloi: 
      ${user}`)

      deleteUser("eloimoncho@gmail.com")
      .then(() => {
        console.log("DELETE User ELoi:");
        return getAllUsers();
      })
      .then((users) => {
        console.log(users)

        updateUserName("bill@initech.com", "Billy")
        .then(() => {
          console.log("UPDATE name Bill to Billy");
          readUser("bill@initech.com")
          .then((user) => {
            console.log(user);            
            
          })
          .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
        
      })
      .catch((err) => console.log(err));

    })
    .catch((err) => console.log(err));

  })
  .catch((err) => console.log(err));
})
.catch(err => console.log(err));

