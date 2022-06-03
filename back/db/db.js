const mongoose = require('mongoose')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1418317",
  key: "335b9707e790a4d59bbe",
  secret: "2793f009078b6b695493",
  cluster: "ap2",
  useTLS: true
});

mongoose.connect(process.env.MONGO,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("db connect")
}).catch((err) => {
    console.log(err)
})
const db = mongoose.connection
// db.once('open', () => {
//     console.log('db coonected again')

//     const msgCollection = db.collection('postdatas');
//     const changeStream = msgCollection.watch()
//     changeStream.on('change', (change)=>{
//         console.log(change)
//         if(change.operationType==='update'){
//             const msgdetail = change.updateDescription;
//             pusher.trigger('messages','updated',{
//                 msg: msgdetail.updatedFields
//             })

//         }if(change.operationType==='insert'){
//             const msgdetail = change.fullDocument;
//             pusher.trigger('username','posted',{
//                 user:msgdetail.name
//             })
//         }
//         else{ 
//             console.log('error trigger')
//         }
//     })

// })