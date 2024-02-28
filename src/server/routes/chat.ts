import express from 'express';
import { QueryTypes } from 'sequelize';
import { Chat, Chats_Tours, db } from '../db/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
interface Message {
  id: number
}

const chatRouter = express.Router();

chatRouter.get('/message/get', (req, res) => {
  Chat.findAll()
  .then((messages: object) => res.status(200).send(messages))
  .catch((err: string) => console.log(err));
});

chatRouter.get('/message/tour/:id', (req, res) => {
  const { id } = req.params;
  
  //Delete from chats-tours join
  db.query('DELETE FROM Chats_Tours WHERE `createdAt` < (NOW() - INTERVAL 60 MINUTE)',
  { type: QueryTypes.DELETE }
  )
  .catch((err: string) => console.log(err, 'Chats tour delete failed'));
  //delete from chats table
  db.query('DELETE FROM Chats WHERE `createdAt` < (NOW() - INTERVAL 60 MINUTE)',
  { type: QueryTypes.DELETE }
  )
  .catch((err: string) => console.log(err, 'Chats delete failed'));
  //get all chats by tour id
  db.query(
    `select distinct * from Chats
    join Chats_Tours
    on Chats_Tours.id_chat = Chats.id
    and Chats_Tours.id_tour = ${id}
    order by Chats_Tours.createdAt;`,
    { type: QueryTypes.SELECT }
  )
  .then((chats: object) => {
    res.status(200).send(chats);
  })
  .catch((err: string) => console.log(err));
});

chatRouter.post('/message/post', (req, res) => {
  const { chat } = req.body;
  //save chat to chat table
  Chat.create({ message: chat.message, id_user: req.user?.id, username: chat.username })
  .then( async (message: Message) => {
    //create chat on tour-chat join table using tour-id
    await Chats_Tours.create({ id_chat: message.id, id_tour: chat.tour }).catch((err: string) => console.log(err));
    res.status(201).send(message);
  })
  .catch((err: string) => console.log(err));
});

export default chatRouter;
