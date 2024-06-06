import { Request, Response } from 'express'
import { Message, messages } from './messageModel';

export const getMessages = (req: Request, res: Response) => {
    res.json(messages);
  };
  
export const addMessages = (req: Request, res: Response) => {
    const content = req.body.content;
    const newMessage: Message = {
        id: messages.length ? messages[messages.length - 1].id + 1 : 1,
        content: content
    };
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    messages.push(newMessage);
    console.log("messages: ", messages);
    res.status(201).json(newMessage);
};