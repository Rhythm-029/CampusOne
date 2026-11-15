import React, { useState } from 'react';
import { Search, Plus, MapPin, Clock, Filter, ShieldCheck, Check, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function LostFoundBrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('lost');
  const [showTrieDropdown, setShowTrieDropdown] = useState(false);

  // Sample Trie autocomplete dictionary
  const trieKeywords = [
    'Headphones (Sony WH-1000XM4)',
    'Headphones (Apple AirPods Pro)',
    'Wallet (Brown Leather)',
    'Student ID Card (B.Tech CS)',
    'Student ID Card (Design)',
    'Water Bottle (Hydro Flask Blue)',
    'Water Bottle (Milton Steel)',
    'MacBook Air Charger 67W',
    'Scientific Calculator Casio',
  ];

  const autocompleteSuggestions = searchQuery.trim().length > 0
    ? trieKeywords.filter((kw) => kw.toLowerCase().startsWith(searchQuery.toLowerCase()))
    : [];

  const items = [
    {
      id: 'LF-2026-081',
      title: 'Sony WH-1000XM4 Headphones (Black)',
      category: 'Electronics',
      type: 'found',
      location: 'Near Central Library, 2nd Floor',
      time: '3 hours ago',
      serialAvailable: true,
      description: 'Found on the reading desk near aisle 4. Left in original black carrying case.',
    },
    {
      id: 'LF-2026-080',
      title: 'Men\'s Leather Bi-Fold Wallet (Brown)',
      category: 'Bags',
      type: 'lost',
      location: 'Academic Block, Ground Floor',
      time: '5 hours ago',
      serialAvailable: false,
      description: 'Contains campus cafeteria card and metro pass. Misplaced between 11 AM and 1 PM.',
    },
    {
      id: 'LF-2026-079',
      title: 'Student ID Card (Roll #2024-CS-042)',
      category: 'ID & Cards',
      type: 'found',
      location: 'Cafeteria Main Hall',
      time: 'Yesterday',
      serialAvailable: true,
      description: 'Turned over to cafeteria security desk. Name on card: Rohan Mehta.',
    },
    {
      id: 'LF-2026-078',
      title: 'Hydro Flask Insulated Bottle (Cobalt Blue)',
      category: 'Accessories',
      type: 'lost',
      location: 'Seminar Hall B-101',
      time: 'Yesterday',
      serialAvailable: false,
      description: '32oz wide mouth with black straw lid. Left under row D seats.',
    },
    {
      id: 'LF-2026-077',
      title: 'Casio FX-991EX Scientific Calculator',
      category: 'Electronics',
      type: 'found',
      location: 'Computing Lab C-305',
      time: '2 days ago',
      serialAvailable: true,
      description: 'Black body with white slide cover. Has small blue sticker on backside.',
    },
    {
      id: 'LF-2026-076',
      title: 'Herschel Little America Backpack (Grey)',
      category: 'Bags',
      type: 'lost',
      location: 'Innovation Bay Lawn',
      time: '3 days ago',
      serialAvailable: false,
      description: 'Contains lecture notebooks and USB flash drive.',
    },
  ];

  const categories = ['All Items', 'Electronics', 'Bags', 'ID & Cards', 'Accessories', 'Other'];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-1">
            Campus Lost & Found Desk
          </div>
          <h1 className="text-2xl font-display font-bold text-navy-900 tracking-tight">
            Lost & Found Reports
          </h1>
          <p className="text-sm text-navy-500 mt-0.5">
            Report your lost belongings, register turned-in items, and search using instant prefix autocomplete.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setReportType('lost');
              setIsReportModalOpen(true);
            }}
          >
            Report Lost Item
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setReportType('found');
              setIsReportModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Report Found Item
          </Button>
        </div>
      </div>

      {/* Search Bar with Trie Autocomplete Preview */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl p-2 shadow-sm focus-within:border-forest focus-within:ring-1 focus-within:ring-forest transition-all">
          <Search className="w-5 h-5 text-navy-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowTrieDropdown(true);
            }}
            onFocus={() => setShowTrieDropdown(true)}
            placeholder="Search items by prefix (e.g. 'head', 'wal', 'card', 'bottle')..."
            className="w-full bg-transparent text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none px-2"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowTrieDropdown(false);
              }}
              className="text-xs text-navy-400 hover:text-navy-700 px-2"
            >
              Clear
            </button>
          )}
          <Button variant="primary" size="sm" className="shrink-0">
            Search
          </Button>
        </div>

        {/* Live Trie Autocomplete Dropdown */}
        {showTrieDropdown && autocompleteSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-30 p-2 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold text-forest uppercase tracking-wider flex items-center justify-between border-b border-border/60 mb-1">
              <span>Trie Prefix Match Engine (O(L) Lookup)</span>
              <span className="font-mono text-navy-400">{autocompleteSuggestions.length} suggestions</span>
            </div>
            {autocompleteSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowTrieDropdown(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-canvas-alt text-navy-800 font-medium flex items-center justify-between transition-colors"
              >
                <span>{suggestion}</span>
                <span className="text-[10px] text-navy-400">Select ↵</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-surface text-navy-700 border border-border hover:bg-canvas-alt'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-navy-400 whitespace-nowrap hidden sm:block">
          Showing <strong className="text-navy-900">{filteredItems.length}</strong> reports
        </div>
      </div>

      {/* Items Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between" hover>
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-navy-400 font-semibold">{item.id}</span>
                <Badge variant={item.type}>
                  {item.type === 'found' ? 'Found on Campus' : 'Reported Lost'}
                </Badge>
              </div>

              {/* Title & Category */}
              <h3 className="font-display font-bold text-base text-navy-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-navy-500 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Meta details */}
              <div className="mt-4 pt-3 border-t border-border/80 space-y-1.5 text-xs text-navy-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Claim / Verification */}
            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-navy-400 flex items-center gap-1">
                {item.serialAvailable && (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                    <span>Bloom Pre-screened</span>
                  </>
                )}
              </span>

              <Button
                variant={item.type === 'found' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => alert(`Submitting ownership verification claim for item ${item.id}. Validating through Bloom filter screening.`)}
              >
                {item.type === 'found' ? 'Claim Item' : 'I Found This'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* New Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-border max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-display font-bold text-navy-900">
                {reportType === 'found' ? 'Report a Found Item' : 'Report a Lost Item'}
              </h2>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-navy-400 hover:text-navy-900 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`New report recorded. Item keywords queued for Java Trie indexing, and identifier added to Bloom Filter.`);
                setIsReportModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-navy-800 mb-1">Item Title / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apple AirPods Pro (White case)"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Category</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900">
                    <option>Electronics</option>
                    <option>Bags</option>
                    <option>ID & Cards</option>
                    <option>Accessories</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-navy-800 mb-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Central Library, Floor 2"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy-800 mb-1">
                  Serial Number / Unique ID (Optional — for Bloom screening)
                </label>
                <input
                  type="text"
                  placeholder="e.g., SN-99482184 or Student Roll No."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy-800 mb-1">Description & Distinct Marks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide recognizable details (scratches, stickers, contents) to facilitate ownership verification."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas focus:bg-surface focus:outline-none focus:ring-1 focus:ring-forest text-navy-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button variant="secondary" size="sm" onClick={() => setIsReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

