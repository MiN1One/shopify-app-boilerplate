import { SessionType } from '@/types/session.types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(session: Partial<SessionType>) {
    return await this.sessionModel.create(session);
  }

  async getSession(session: Partial<SessionType>) {
    return await this.sessionModel.findOne(session);
  }
}
