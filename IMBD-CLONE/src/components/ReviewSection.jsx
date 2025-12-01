import React, { useState, useEffect } from 'react';
import { db, APP_ID } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Loader from './Loader';
import './ReviewSection.css';

function ReviewSection({ movieId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Reviews Real-time
  useEffect(() => {
    if (!movieId) return;

    // Path: /artifacts/{appId}/public/data/reviews
    const reviewsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'reviews');
    
    // Query: Get reviews for THIS movie, ordered by newest first
    const q = query(
      reviewsRef, 
      where('movieId', '==', movieId), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [movieId]);

  // 2. Calculate Average
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setSubmitting(true);
    try {
      const reviewsRef = collection(db, 'artifacts', APP_ID, 'public', 'data', 'reviews');
      await addDoc(reviewsRef, {
        movieId,
        userId: currentUser.uid,
        username: `User ${currentUser.uid.slice(0, 5)}`, // Generate a simple username
        rating: Number(rating),
        comment: comment.trim(),
        timestamp: serverTimestamp()
      });
      
      setComment('');
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="review-section">
      <h2 className="review-header">User Reviews</h2>
      
      {/* Average Rating Badge */}
      <div className="average-rating-container">
        <span className="avg-score">⭐ {averageRating}</span>
        <span className="avg-count">({reviews.length} reviews)</span>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="review-form">
        <h3>Write a Review</h3>
        <div className="form-group">
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this movie?"
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Review'}
        </button>
      </form>

      {/* Review List */}
      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-top">
                <span className="review-user">{review.username}</span>
                <span className="review-score">⭐ {review.rating}/10</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">
                {review.timestamp?.toDate().toLocaleDateString() || 'Just now'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;