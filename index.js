const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require('ytdl-core') 
const token = require('./src/services/token')


//Config discord js
const prefix = "!"

const servers = {
    'server': {
        connection: null,
        dispatcher: null
    }
}

const ytdlOptions = {
  filter: 'audioonly'
}

client.on("message", async (msg) => {

    //Ignora msg vindas de fora do servidor
    if (!msg.guild) return

    //Ignora a msg caso ela não inicie com o prefixo 
    if(!msg.content.startsWith(prefix)) return

    if(!msg.member.voice.channel) return

    //Entra no canal e da play na msc
    if(msg.content.startsWith(prefix + "play")){
      console.log("entrando")
      servers.server.connection = await msg.member.voice.channel.join()

      //Tira o play da var link
      let link = msg.content.slice(6)

      //Toca link
      servers.server.dispatcher = servers.server.connection.play(ytdl(link))
      
      
      
      //Bucetinha só apos entrar em link
      if(link) {
        msg.channel.send("Tocando: ")
      }
    }

    //Disconecta do servidor de quem mandou a mensagem
    if(msg.content === prefix + "ds"){
      servers.server.connection = msg.member.voice.channel.leave()
      console.log("saindo")
    }

    //Pausa a msc
    if(msg.content === prefix + "pause") {
      await servers.server.dispatcher.pause()
    }

     //Retorna a msc
     if(msg.content === prefix + "resume") {
      servers.server.dispatcher.resume()
    } 

    //Para a música
    if(msg.content === prefix + "stop") {
      servers.server.dispatcher.pause()
    } 
})  

client.login(token)
