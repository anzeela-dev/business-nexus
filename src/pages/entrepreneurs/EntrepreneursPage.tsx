import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Video, FileText } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);
  
  const allIndustries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];
  
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);
    
    const matchesFunding = selectedFundingRange.length === 0 || 
      selectedFundingRange.some(range => {
        const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ''));
        switch (range) {
          case '< $500K': return amount < 500;
          case '$500K - $1M': return amount >= 500 && amount <= 1000;
          case '$1M - $5M': return amount > 1000 && amount <= 5000;
          case '> $5M': return amount > 5000;
          default: return true;
        }
      });
    
    return matchesSearch && matchesIndustry && matchesFunding;
  });
  
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };
  
  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Startups</h1>
          <p className="text-gray-600">Discover promising startups looking for investment</p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/video-call">
            <Button variant="outline" size="sm" leftIcon={<Video size={16} />}>
              Join Meeting Room
            </Button>
          </Link>
          <Link to="/documents">
            <Button variant="primary" size="sm" leftIcon={<FileText size={16} />}>
              Doc Processing Chamber
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Industry</h3>
                <div className="space-y-2">
                  {allIndustries.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedIndustries.includes(industry)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Funding Range</h3>
                <div className="space-y-2">
                  {fundingRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedFundingRange.includes(range)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:flex-1">
              <Input
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startAdornment={<Search size={18} />}
                fullWidth
              />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">
                {filteredEntrepreneurs.length} results found
              </span>
            </div>
          </div>
          
          {filteredEntrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntrepreneurs.map(entrepreneur => (
                <EntrepreneurCard
                  key={entrepreneur.id}
                  entrepreneur={entrepreneur}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 italic mb-2">No startups found matching criteria.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustries([]);
                  setSelectedFundingRange([]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};