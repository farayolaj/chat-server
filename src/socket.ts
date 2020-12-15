import socketIO from 'socket.io';
import socketIOAuth from 'socketio-auth';
import { User, UserDoc } from './models/User';
import dbg from 'debug';
import jwt from 'jsonwebtoken';
import { Server } from 'http';
import { Store, SocketWithUser, MessageEvent, TypingEvent } from './types';

const debug = dbg('chat-app:socket');

// store should be replaced with external one
const store: Store = {};
let io: SocketIO.Server;

export function SocketIO(server: Server) {
  io = socketIO(server);

  socketIOAuth(io, {
    authenticate,
    postAuthenticate,
    disconnect,
    timeout: 5000
  });


  io.on('connect', socket => {
    debug('Someone connected');
  })
}

async function authenticate(socket: SocketWithUser, data: any, callback: Function) {
  const { username, password, token } = data;

  try {
    if (token) {
      const { username } = jwt.verify(token, 'this is a secret') as { username: string }
      if (username) {
        const user = await User.findByUsername(username, false);
        if (!user) throw new Error('Password or username is incorrect');
        return completeAuthentication(user);
      }
    }

    const user = await User.findByUsername(username, false);
    if (!user) throw new Error('Password or username is incorrect');
    const res = await user.authenticate(password);

    if (res.user) {
      return completeAuthentication(user);
    } else if (res.error) callback(res.error);
    else return callback(null, false);
  } catch (err) {
    return callback(err)
  };

  function completeAuthentication(user: UserDoc) {
    store[username] = socket.client.id;
    socket.user = user;
    const token = jwt.sign({ username }, 'this is a secret', { expiresIn: '1d' });
    callback(null, {
      username: user.username,
      displayname: user.displayname,
      token
    });
  }
}

async function postAuthenticate(socket: SocketWithUser, data: any) {
  // debug(`${socket.user ? socket.user.username : 'Someone'} authenticated`);
  debug(`${socket.user?.username} authenticated`);

  await emitUnreadMessages(socket);

  // Handling typing event
  handleTypingEvent(socket);

  // handling message events
  handleMessageEvent(socket);

  handleOnlineEvent(socket);
}

async function disconnect(socket: SocketWithUser) {
  const user = socket.user;
  if (user) {
    user.lastSeen = Date.now()
    debug(`${user.username} disconnected`);

    delete store[user.username];
    await user.save();
  } else {
    debug(`Someone not authenticated disconnected`);
  }
}


async function emitUnreadMessages(socket: SocketWithUser) {
  try {
    if (socket.user) {
      const messages = socket.user.unreadMessages;
      socket.user.unreadMessages = [];
      await socket.user.save();

      socket.emit('unread', messages);
    }
  }
  catch (err) {
    debug(err);
  }
}

function handleOnlineEvent(socket: SocketWithUser) {
  socket.on('online', (username: string, cb: Function) => {
    cb(!!store[username]);
  });
}

function handleMessageEvent(socket: SocketWithUser) {
  socket.on('message', async (payload: MessageEvent) => {
    console.log(payload);
    try {
      const recipientId = store[payload.to];
      if (recipientId)
        io.to(recipientId).send(payload);
      else
        await User.updateOne({ username: payload.to }, {
          $push: {
            unreadMessages: payload
          }
        }).exec();
    }
    catch (err) {
      debug(err);
    }
  });
}

function handleTypingEvent(socket: SocketWithUser) {
  socket.on('typing', (payload: TypingEvent) => {
    const recipientId = store[payload.to];
    if (recipientId)
      io.to(recipientId).emit('typing', payload);
  });
}