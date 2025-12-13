import api from './api';
import { VoteType } from '@/types';

export interface VoteData {
  type: 'up' | 'down';
  postId?: string;
  commentId?: string;
}

export interface VoteResponse {
  votes: number;
  userVote: 'up' | 'down' | null;
}

export const voteService = {
  async vote(data: VoteData): Promise<VoteResponse> {
    const response = await api.post('/votes', data);
    return response.data.data;
  },

  async votePost(postId: string, type: 'up' | 'down'): Promise<VoteResponse> {
    return await this.vote({ type, postId });
  },

  async voteComment(commentId: string, type: 'up' | 'down'): Promise<VoteResponse> {
    return await this.vote({ type, commentId });
  },
};


