
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  tag: string;
  collaborators: string[];
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onClick?: () => void;
  className?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onEdit, 
  onDelete, 
  onClick, 
  className = "" 
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50 ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
              {note.title}
            </CardTitle>
            {note.tag && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {note.tag}
              </span>
            )}
          </div>
          {/* <div className="relative">
            <Button
              className={`p-1 rounded-full hover:bg-gray-200 transition-all duration-200 ${
                showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();

              }}
            >
              <Eye size={16} className="text-gray-500" />
            </Button>
          </div> */}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-gray-600 mb-4 leading-relaxed">
          {truncateContent(note?.content)}
        </CardDescription>
        
        <div className="flex items-center justify-between">
            <div className='flex space-x-4 '>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(note?.updatedAt)}</span>
          </div>
           <div className="flex items-center text-xs text-gray-500">
            <Users size={12} className="mr-1" />
            <span>{note?.collaborators?.length || 0}</span>
          </div>
          </div>
          
          <div className={`flex items-center space-x-2 transition-all duration-200 ${
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
          }`}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(note);
              }}
              className="p-1.5 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
              title="Edit note"
            >
              <Edit size={14} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(note._id);
              }}
              className="p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete note"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;