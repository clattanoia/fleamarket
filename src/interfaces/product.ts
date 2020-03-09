import { Status } from '../constants/enums'
import { User } from './detail'

export interface Product {
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
