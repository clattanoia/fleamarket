import { Platform, Status } from '../constants/enums'
import { InContact } from './contact'

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
  contacts: InContact[]
}

export interface ProductInfoDetail {
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
  pictures?: string[];
  contacts?: string[];
  readCount?: number;
}
