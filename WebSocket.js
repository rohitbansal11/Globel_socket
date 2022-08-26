
class WebSockets {
  users = [];
  connection = (client) => {
    client.emit('check', 'you are connected to socket successfully');
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      console.log("disconnected::::")
      // this.users = this.users.filter((user) => user.socketId !== client.id);
    });
    // add identity of user mapped to the socket id
    // client.on("sendNotifications", (data) => {
    //   global.io.emit('getNotifications',"data" );
    // });


    //send and get message
    // client.on("sendMessage", (messageObject) => {
    //   const { receiverId } = messageObject
    //   const user = this.getUser(receiverId);
    //   global.io.to(user.socketId).emit("getMessage", messageObject);
    // });



    // subscribe person to chat & other user as well
    client.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
    // mute a chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }
  getUser(userId) {
    return this.users.find((user) => user.userId === userId);
  };
}

module.exports = new WebSockets();
