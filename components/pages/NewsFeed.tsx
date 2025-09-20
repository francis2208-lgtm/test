import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ICONS } from '../../constants';
import { NewsCategory, ReactionType, NewsItem } from '../../types';
import ReactionAnimation from '../common/ReactionAnimation';
import CommentSection from '../common/CommentSection';

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
    const { handleNewsReaction, userReactions, addNewsComment } = useAppContext();
    const [animationState, setAnimationState] = useState<{ postId: string; reaction: ReactionType } | null>(null);
    const [showComments, setShowComments] = useState(false);
    
    const getCategoryStyles = (category: NewsCategory) => {
        switch (category) {
            case 'Holiday': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Policy Update': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Company Event': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            case 'Team News': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Health & Wellness': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const reactionIcons: { [key in ReactionType]: JSX.Element } = {
        like: ICONS.like,
        celebrate: ICONS.celebrate,
        support: ICONS.support,
    };
    
    const selectedReactionClasses: { [key in ReactionType]: string } = {
        like: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30',
        celebrate: 'bg-yellow-400 text-yellow-900 font-semibold shadow-lg shadow-yellow-400/30',
        support: 'bg-red-500 text-white shadow-lg shadow-red-500/30',
    };

    const unselectedHoverClasses: { [key in ReactionType]: string } = {
        like: 'hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-300',
        celebrate: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:text-yellow-600 dark:hover:text-yellow-400',
        support: 'hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400',
    };

    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden">
            {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getCategoryStyles(item.category)}`}>
                        {item.category}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">{item.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">By {item.author}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>

                <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border flex items-center space-x-2">
                    {(Object.keys(reactionIcons) as ReactionType[]).map(reaction => {
                        const isSelected = userReactions[item.id] === reaction;
                        const baseButtonClasses = 'flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-sm font-medium transform hover:scale-105';
                        const unselectedClasses = 'bg-slate-100 dark:bg-dark-border text-gray-600 dark:text-gray-300';
                        const buttonClasses = `${baseButtonClasses} ${isSelected ? selectedReactionClasses[reaction] : `${unselectedClasses} ${unselectedHoverClasses[reaction]}`}`;
                        return (
                            <div key={reaction} className="relative">
                                <button
                                    onClick={() => {
                                        const isNewReaction = userReactions[item.id] !== reaction;
                                        handleNewsReaction(item.id, reaction);
                                        if (isNewReaction) { setAnimationState({ postId: item.id, reaction }); }
                                    }}
                                    className={buttonClasses}
                                >
                                    {React.cloneElement(reactionIcons[reaction], { className: `${reactionIcons[reaction].props.className} text-lg` })}
                                    <span>{item.reactions[reaction]}</span>
                                </button>
                                {animationState?.postId === item.id && animationState?.reaction === reaction && (
                                    <ReactionAnimation reaction={reaction} onAnimationEnd={() => setAnimationState(null)} />
                                )}
                            </div>
                        );
                    })}

                    <div className="flex-grow"></div>
                    
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-sm font-medium transform hover:scale-105 bg-slate-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-border/80"
                    >
                        {React.cloneElement(ICONS.comment, { className: `${ICONS.comment.props.className} text-lg` })}
                        <span>{item.comments.length}</span>
                    </button>
                </div>
                {showComments && (
                    <CommentSection 
                        comments={item.comments}
                        onAddComment={(commentText) => addNewsComment(item.id, commentText)}
                    />
                )}
            </div>
        </div>
    );
};


const NewsFeed: React.FC = () => {
    const { newsFeed } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');

    const categories: ('All' | NewsCategory)[] = ['All', 'Holiday', 'Policy Update', 'Company Event', 'Team News', 'Health & Wellness'];

    const filteredNews = selectedCategory === 'All'
        ? newsFeed
        : newsFeed.filter(item => item.category === selectedCategory);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text mb-2">News & Announcements</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">Stay updated with the latest from the company.</p>
            </div>

            <div className="flex justify-center mb-6 overflow-x-auto py-2">
                <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-dark-card rounded-xl">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-border'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredNews.map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
            
             <div className="text-center py-8 mt-4">
                <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-dark-border rounded-full text-sm text-gray-500 dark:text-gray-400 font-medium">
                    That's all for now!
                </span>
            </div>
        </div>
    );
};

export default NewsFeed;