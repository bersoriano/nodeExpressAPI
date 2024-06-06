import { Router } from 'express';
import { getMessages, addMessages} from './messageController';

const messageRoutes = Router();

messageRoutes.get('/', getMessages);
messageRoutes.post('/', addMessages);

export default messageRoutes;