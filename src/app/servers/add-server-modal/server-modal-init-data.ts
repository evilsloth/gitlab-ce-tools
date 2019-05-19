import { Server } from '../server';

export interface ServerModalInitData {
    mode: 'ADD' | 'EDIT';
    serverToEdit?: Server;
}
