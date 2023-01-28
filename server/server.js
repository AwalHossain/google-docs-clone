const io = require('socket.io')(3001,{
    cors:{
        origin: "*",
        methods: ['GET', 'POST']
    }
});


io.on("connection", (socket)=>{
    
    socket.on("send-changes", (delta)=>{
        console.log(delta,"dlo");
    })

    console.log("connected");
})