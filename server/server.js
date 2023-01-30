const mongoose = require('mongoose');
const Document = require("./Document");



mongoose.connect("mongodb+srv://documents:BAQTFVLBcI896jbe@cluster0.33slg.mongodb.net/?retryWrites=true&w=majority");



const io = require('socket.io')(3001,{
    cors:{
        origin: "*",
        methods: ['GET', 'POST']
    }
});


io.on("connection", (socket)=>{
    // let data = "";
    socket.on('get-document', async(documentId) =>{
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);



        socket.on("send-changes", (delta)=>{
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        })


     // Save document
        socket.on("save-document", async(data)=>{
            await Document.findByIdAndUpdate(documentId, {data});
        })
    })

})

const defaultValue = "";

async function findOrCreateDocument(id){
    if(id == null)  return;

    const document = await Document.findById(id);

    if(document) return document;

    return await Document.create({_id: id, data: defaultValue});

}