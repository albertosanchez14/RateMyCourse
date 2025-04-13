import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../utils/supabaseClient';
import { useAuth } from './useAuth';

export const useReviewVote = (reviewId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Define query keys
  const votesQueryKey = ['review-votes', reviewId];
  const userVoteQueryKey = ['user-vote', reviewId, user?.userId];
  
  // Fetch vote counts
  const { data: voteData, isLoading: isLoadingVotes } = useQuery({
    queryKey: votesQueryKey,
    queryFn: async () => {
      // Get total likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('review_votes')
        .select('*', { count: 'exact', head: true })
        .eq('review_id', reviewId)
        .eq('vote_type', 'like');
      
      if (likesError) throw likesError;
      
      // Get total dislikes count
      const { count: dislikesCount, error: dislikesError } = await supabase
        .from('review_votes')
        .select('*', { count: 'exact', head: true })
        .eq('review_id', reviewId)
        .eq('vote_type', 'dislike');
      
      if (dislikesError) throw dislikesError;
      
      return {
        likes: likesCount || 0,
        dislikes: dislikesCount || 0
      };
    },
    enabled: !!reviewId
  });
  
  // Fetch user's vote status
  const { data: userVoteData } = useQuery({
    queryKey: userVoteQueryKey,
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('review_votes')
        .select('vote_type')
        .eq('review_id', reviewId)
        .eq('user_id', user.userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user && !!reviewId
  });
  
  // Set up Supabase realtime subscription
  useState(() => {
    const subscription = supabase
      .channel(`review_votes_${reviewId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'review_votes', filter: `review_id=eq.${reviewId}` },
        () => {
          // Invalidate queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: votesQueryKey });
          if (user) {
            queryClient.invalidateQueries({ queryKey: userVoteQueryKey });
          }
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  });
  
  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const isLiked = userVoteData?.vote_type === 'like';
      
      if (isLiked) {
        // Remove like if already liked
        const { error } = await supabase
          .from('review_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.userId);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // If disliked, remove dislike first
        if (userVoteData?.vote_type === 'dislike') {
          const { error } = await supabase
            .from('review_votes')
            .delete()
            .eq('review_id', reviewId)
            .eq('user_id', user.userId);
          
          if (error) throw error;
        }
        
        // Add like
        const { error } = await supabase
          .from('review_votes')
          .insert({
            review_id: reviewId,
            user_id: user.userId,
            vote_type: 'like'
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: votesQueryKey });
      queryClient.invalidateQueries({ queryKey: userVoteQueryKey });
    }
  });
  
  // Dislike mutation
  const dislikeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const isDisliked = userVoteData?.vote_type === 'dislike';
      
      if (isDisliked) {
        // Remove dislike if already disliked
        const { error } = await supabase
          .from('review_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.userId);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // If liked, remove like first
        if (userVoteData?.vote_type === 'like') {
          const { error } = await supabase
            .from('review_votes')
            .delete()
            .eq('review_id', reviewId)
            .eq('user_id', user.userId);
          
          if (error) throw error;
        }
        
        // Add dislike
        const { error } = await supabase
          .from('review_votes')
          .insert({
            review_id: reviewId,
            user_id: user.userId,
            vote_type: 'dislike'
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: votesQueryKey });
      queryClient.invalidateQueries({ queryKey: userVoteQueryKey });
    }
  });

  return {
    likes: voteData?.likes || 0,
    dislikes: voteData?.dislikes || 0,
    isUserLiked: userVoteData?.vote_type === 'like',
    isUserDisliked: userVoteData?.vote_type === 'dislike',
    handleLike: () => likeMutation.mutate(),
    handleDislike: () => dislikeMutation.mutate(),
    isLoading: isLoadingVotes || likeMutation.isPending || dislikeMutation.isPending
  };
};