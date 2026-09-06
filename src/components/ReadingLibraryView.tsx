import React, { useState } from 'react';
import { ReadingItem, ReadingStatus, ReadingFormat } from '../types';
import { NotionCallout } from './NotionCallout';
import { BookOpen, Plus, Trash2, Bookmark, Check } from 'lucide-react';

interface ReadingLibraryViewProps {
  library: ReadingItem[];
  onUpdateLibrary: (library: ReadingItem[]) => void;
}

export const ReadingLibraryView: React.FC<ReadingLibraryViewProps> = ({
  library,
  onUpdateLibrary,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New book state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newFormat, setNewFormat] = useState<ReadingFormat>('Book');
  const [newStatus, setNewStatus] = useState<ReadingStatus>('want-to-read');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ReadingItem = {
      id: `r-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Unknown',
      format: newFormat,
      status: newStatus,
      takeaway: newTakeaway.trim(),
      notes: newNotes.trim(),
    };

    onUpdateLibrary([newItem, ...library]);
    setNewTitle('');
    setNewAuthor('');
    setNewTakeaway('');
    setNewNotes('');
    setIsAdding(false);
  };

  const handleStatusChange = (id: string, nextStatus: ReadingStatus) => {
    onUpdateLibrary(
      library.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  };

  const handleDelete = (id: string) => {
    onUpdateLibrary(library.filter((item) => item.id !== id));
  };

  const filtered = library.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'reading':
        return 'bg-[#E3E8E1] text-[#7B8C7D] border-[#D9D1C7] font-semibold';
      case 'want-to-read':
        return 'bg-[#F5F2ED] text-[#3A3F3A] border-[#D9D1C7] font-semibold';
      case 'completed':
        return 'bg-[#7B8C7D] text-[#F5F2ED] border-[#7B8C7D] font-semibold';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <NotionCallout variant="beige" icon="📖">
        <p className="font-serif italic text-base text-[#3A3F3A]">
          &ldquo;Read what you love until you love to read.&rdquo;
        </p>
        <p className="text-xs text-[#3A3F3A]/70 mt-1">
          A library is not a tally of conquests; it is an enduring conversation with wise minds.
        </p>
      </NotionCallout>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D1C7] pb-4">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE7E0]/60 rounded-full border border-[#D9D1C7]">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'reading', label: 'Currently Reading' },
            { id: 'want-to-read', label: 'To Read' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#7B8C7D] text-[#F5F2ED] shadow-2xs'
                  : 'text-[#3A3F3A]/70 hover:text-[#3A3F3A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" /> Add Title
        </button>
      </div>

      {/* Add Title Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateItem}
          className="p-6 bg-white border border-[#E3E8E1] rounded-3xl space-y-4 shadow-xs"
        >
          <div className="text-[10px] font-bold text-[#7B8C7D] uppercase tracking-widest">
            Add to Reading Shelf
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-4 py-2.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none focus:border-[#7B8C7D]"
            />
            <input
              type="text"
              placeholder="Author"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="px-4 py-2.5 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-2xl text-[#3A3F3A] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value as ReadingFormat)}
              className="px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
            >
              <option value="Book">Book</option>
              <option value="Essay">Essay</option>
              <option value="Research">Research Paper</option>
              <option value="Audio">Audio / Talk</option>
            </select>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ReadingStatus)}
              className="px-3 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
            >
              <option value="reading">Currently Reading</option>
              <option value="want-to-read">Want to Read</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Core takeaway / quote..."
            value={newTakeaway}
            onChange={(e) => setNewTakeaway(e.target.value)}
            className="w-full px-4 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
          />
          <textarea
            placeholder="Personal notes and impressions..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 text-xs bg-[#F5F2ED] border border-[#D9D1C7] rounded-xl text-[#3A3F3A] focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-[#3A3F3A]/70 hover:text-[#3A3F3A] rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#7B8C7D] text-[#F5F2ED] rounded-full font-medium hover:bg-[#68786A]"
            >
              Save Book
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl border border-[#E3E8E1] bg-white hover:border-[#7B8C7D] transition-all space-y-4 relative group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#3A3F3A]/60 font-mono tracking-wider uppercase">
                    {item.format}
                  </span>
                  <h3 className="text-base font-serif font-medium text-[#3A3F3A] mt-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#3A3F3A]/70 mt-0.5 italic">{item.author}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status.replace('-', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#3A3F3A]/40 hover:text-[#944D4D] p-1 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.takeaway && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-[#F5F2ED] border-l-4 border-[#7B8C7D] text-xs font-serif italic text-[#3A3F3A]">
                  &ldquo;{item.takeaway}&rdquo;
                </div>
              )}

              {item.notes && (
                <p className="text-xs text-[#3A3F3A]/70 mt-3 leading-relaxed">
                  {item.notes}
                </p>
              )}
            </div>

            {/* Quick status selector */}
            <div className="pt-3.5 border-t border-[#E3E8E1] flex items-center justify-between text-[11px] text-[#3A3F3A]/60">
              <span className="text-[10px] uppercase font-bold text-[#7B8C7D]">Status:</span>
              <div className="flex items-center gap-1.5">
                {(['want-to-read', 'reading', 'completed'] as ReadingStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(item.id, st)}
                    className={`px-2.5 py-1 rounded-full border capitalize text-[10px] transition-colors cursor-pointer ${
                      item.status === st
                        ? 'bg-[#7B8C7D] text-[#F5F2ED] font-medium border-[#7B8C7D]'
                        : 'border-transparent bg-[#F5F2ED] hover:bg-[#EAE7E0] text-[#3A3F3A]'
                    }`}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
