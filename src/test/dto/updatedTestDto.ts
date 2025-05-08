/* eslint-disable prettier/prettier */

import { Question } from '../entities/question.entity';

export interface UpdatedTestDto {
  name?: string;
  description?: string;
  questions?: Question[];
  allowedUsers?: string[];
  deleted_at?: Date | null;
  updated_at?: Date;
  timeLimit?: number | null;
}
