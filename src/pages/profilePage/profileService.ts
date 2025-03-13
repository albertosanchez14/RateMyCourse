import { User } from '../../types/profile';
import { CourseReviewsType } from '../../types/reviews';

const API_URL = import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const profileService = {
  async getUserProfile(): Promise<User> {
    const response = await fetch(`${API_URL}/profile`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async getUserReviews(): Promise<CourseReviewsType[]> {
    const response = await fetch(`${API_URL}/profile/reviews`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }
};
