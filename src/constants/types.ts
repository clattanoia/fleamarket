import { Platform, Status } from './enums'

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
  platform: Platform
  contacts: [Contact]
}

export type Contact = {
  id: string;
  content: string;
  type: string;
}

export interface GoodDetail {
  id: string;
  owner?: User
  title?: string;
  price?: number;
  description?: string;
  coverUrl?: string;
  category?: string;
  categoryName?: string;
  status?: Status;
  createTime?: Date;
  updateTime?: Date;
  pictures?: [string];
  contacts?: [string];
}