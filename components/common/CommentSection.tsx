import React, { useState, useEffect, useRef } from 'react';
import { Comment } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { PROFANITY_LIST } from '../../constants';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
    const { user } = useAppContext();
    const [newComment, setNewComment] = useState('');
    const [warning, setWarning] = useState('');
    const [animatedCommentId, setAnimatedCommentId] = useState<string | null>(null);
    const prevCommentsLength = useRef(comments.length);

    useEffect(() => {
        // Check if a new comment was added
        if (comments.length > prevCommentsLength.current) {
            const lastComment = comments[comments.length - 1];
            setAnimatedCommentId(lastComment.id);

            const timer = setTimeout(() => {
                setAnimatedCommentId(null);
            }, 600); // Animation duration is 0.5s, give it a buffer to complete

            // Update the ref to the new length for the next render
            prevCommentsLength.current = comments.length;

            return () => clearTimeout(timer);
        }
        
        // If comments are removed (future-proofing for a delete feature), update the length
        if (comments.length < prevCommentsLength.current) {
            prevCommentsLength.current = comments.length;
        }
    }, [comments]);

    const checkForProfanity = (text: string): boolean => {
        // Normalize the input text: remove spaces, punctuation, and convert to lowercase.
        // This helps catch variations like "s h i t" or "s-h-i-t".
        const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/gi, '');
        
        // Check if the normalized text contains any of the profanities.
        return PROFANITY_LIST.some(profanity => normalizedText.includes(profanity));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedComment = newComment.trim();
        if (trimmedComment) {
            if (checkForProfanity(trimmedComment)) {
                setWarning('Inappropriate language detected. Please revise your comment.');
                return;
            }
            setWarning('');
            onAddComment(trimmedComment);
            setNewComment('');
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        if (warning) {
            setWarning('');
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border/50 animate-fadeInUp">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h4>
            
            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-4">
                <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                    <textarea
                        value={newComment}
                        onChange={handleTextChange}
                        placeholder="Add a comment..."
                        rows={1}
                        className="w-full p-2 border rounded-lg bg-slate-100 dark:bg-dark-border text-sm text-gray-800 dark:text-white border-light-border dark:border-dark-border/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                     {warning && <p className="text-red-500 text-xs mt-1 animate-fadeInUp">{warning}</p>}
                     {newComment && (
                        <button type="submit" className="mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all">
                            Post Comment
                        </button>
                    )}
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div 
                        key={comment.id} 
                        className={`flex items-start space-x-3 ${comment.id === animatedCommentId ? 'animate-fadeInUp' : ''}`}
                    >
                        <img src={comment.avatarUrl} alt={comment.author} className="w-9 h-9 rounded-full flex-shrink-0" />
                        <div className="flex-grow bg-slate-100 dark:bg-dark-border p-3 rounded-lg">
                            <div className="flex items-baseline space-x-2">
                                <p className="font-semibold text-sm text-gray-800 dark:text-dark-text">{comment.author}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</p>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;