import { ExchangeStatus, Platform, Status } from '../constants/enums'
import { InContact } from './contact'

export type Location = {
  province?: {
    id: string,
    name: string,
  },
  city?: {
    id: string,
    name: string,
  },
}

export type User = {
  id: string;
  nickname: string;
  brief: string;
  country: string;
  province: string;
  city: string;
  avatarUrl: string;
  gender: number;
  lastVisitTime: Date;
  platform: Platform;
  contacts: InContact[];
  certification: string;
}

export interface ProductInfoDetail {
  id: string;
  owner?: User;
  title?: string;
  price?: number;
  description?: string;
  coverUrl?: string;
  category?: string;
  categoryName?: string;
  status?: Status;
  createTime?: Date;
  updateTime?: Date;
  pictures?: string[];
  contacts?: string[];
  readCount: number;
  agreeExchange?: boolean;
  location?: Location,
}

export interface ExchangeInfo {
  id?: string;
  userId?: string;
  targetId?: string;
  sourceId?: string;
  status?: ExchangeStatus;
  goods?: ProductInfoDetail;
  createTime?: Date;
  updateTime?: Date;
}
