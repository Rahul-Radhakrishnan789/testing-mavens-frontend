import React, { useEffect, useState } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import NoteCard from '@/components/Card/card';    
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import type { RootState ,AppDispatch } from '@/REDUX/store';
import { fetchNotes , deleteNote , setFilterValues } from '@/REDUX/reducers/noteSlice';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  tag?: string;
  collaborators?: string[];
}

const NotesGrid: React.FC = () => {

const dispatch = useDispatch<AppDispatch>();
  const {notes,filterValues} = useSelector((state: RootState) => state.notes);

  // console.log(notes, 'notes from redux');
  // console.log(filterValues, 'filter values from redux');


  
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchNotes(filterValues));
  }, [dispatch, filterValues]);
  

  const categories = ['all', 'work', 'personal', 'creative', 'travel', 'learning', 'health'];

  const handleEdit = (note: Note) => {
    navigate(`/note/edit/${note._id}`);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(noteId));
      dispatch(fetchNotes(filterValues)); 
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    dispatch(setFilterValues({
      ...filterValues, search: term,
    }));
  };

  const handleFilterChange = (category: string) => {
    setSelectedCategory(category);
    // console.log(category, 'selected category');
    dispatch(setFilterValues({
      ...filterValues, filter: category,
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} />
                My Notes
              </h1>
              <p className="text-gray-600 mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
              </p>
            </div>
            <Button onClick={() => navigate('/note/create')} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus size={18} className="mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-32"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map(note => (
              <NoteCard
                onClick={() => navigate(`/note/edit/${note._id}`)}
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first note to get started'
              }
            </p>
            <Button onClick={
              () => navigate('/note/create')
            } className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

              <Plus size={18} className="mr-2" />
              Create Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesGrid;