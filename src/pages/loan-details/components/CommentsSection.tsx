import React, { useState } from 'react';

import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { InternalComment } from '../types';

interface CommentsSectionProps {
  comments: InternalComment[];
  onAddComment: (comment: Omit<InternalComment, 'id' | 'timestamp'>) => void;
}

const CommentsSection = ({ comments, onAddComment }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    const comment: Omit<InternalComment, 'id' | 'timestamp'> = {
      author: 'John Smith',
      authorRole: 'Loan Officer',
      content: newComment.trim(),
      isPrivate,
    };

    await onAddComment(comment);
    setNewComment('');
    setIsPrivate(false);
    setIsSubmitting(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'loan officer':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'manager':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'underwriter':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add Internal Comment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment or note about this loan..."
              className="w-full min-h-24 px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Checkbox
              label="Private comment (visible only to internal team)"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isSubmitting}
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewComment('');
                  setIsPrivate(false);
                }}
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                disabled={!newComment.trim()}
                iconName="Send"
                iconPosition="left"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Comments ({comments.length})
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Lock" size={14} />
            <span>Internal use only</span>
          </div>
        </div>
        {sortedComments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-card border rounded-lg p-4 ${
              comment.isPrivate ? 'border-warning/30 bg-warning/5' : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary-foreground">
                  {comment.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground">
                    {comment.author}
                  </h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getRoleColor(comment.authorRole)}`}>
                    {comment.authorRole}
                  </div>
                  {comment.isPrivate && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-warning bg-warning/10 border border-warning/20">
                      <Icon name="Lock" size={12} />
                      Private
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                
                <p className="text-foreground whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Comments Yet
          </h3>
          <p className="text-muted-foreground">
            Add internal comments and notes to track loan progress and communication.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;

