import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, CheckCircle, PenTool, X } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface InitialDoc {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: 'Draft' | 'In Review' | 'Signed';
}

export const DocumentsPage: React.FC = () => {
  const [documentsList, setDocumentsList] = useState<InitialDoc[]>([
    {
      id: 1,
      name: 'Pitch Deck 2024.pdf',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2024-02-15',
      shared: true,
      status: 'Signed'
    },
    {
      id: 2,
      name: 'Financial Projections.xlsx',
      type: 'Spreadsheet',
      size: '1.8 MB',
      lastModified: '2024-02-10',
      shared: false,
      status: 'Draft'
    },
    {
      id: 3,
      name: 'Business Plan.docx',
      type: 'Document',
      size: '3.2 MB',
      lastModified: '2024-02-05',
      shared: true,
      status: 'In Review'
    },
    {
      id: 4,
      name: 'Market Research.pdf',
      type: 'PDF',
      size: '5.1 MB',
      lastModified: '2024-01-28',
      shared: false,
      status: 'Draft'
    }
  ]);

  const [showSignModal, setShowSignModal] = useState(false);
  const [targetDocId, setTargetDocId] = useState<number | null>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const openSignaturePad = (id: number) => {
    setTargetDocId(id);
    setShowSignModal(true);
    setTypedName('');
    setTimeout(() => clearCanvas(), 50);
  };

  const commitElectronicSignature = () => {
    if (targetDocId === null) return;
    
    if (signatureType === 'type' && !typedName.trim()) {
      alert("Please input your full legal identity credentials to commit signature tokens.");
      return;
    }

    setDocumentsList(prev => prev.map(doc => 
      doc.id === targetDocId ? { 
        ...doc, 
        status: 'Signed', 
        lastModified: new Date().toISOString().split('T')[0] 
      } : doc
    ));

    setShowSignModal(false);
    setTargetDocId(null);
    alert("Document chamber tracking: E-signature applied successfully. Audit logs updated.");
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Processing Chamber</h1>
          <p className="text-gray-600">Secure repository layer for managing startup term sheets and legal deeds</p>
        </div>
        
        <Button leftIcon={<Upload size={18} />} onClick={() => alert("Simulating localized sandbox file upload parsing integration...")}>
          Upload Document
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage Profile</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used Workspace</span>
                <span className="font-medium text-gray-900">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Space</span>
                <span className="font-medium text-gray-900">7.5 GB</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Chamber Directories</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => alert("Chamber filtering applied.")}>
                  Recent Files
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => alert("Chamber filtering applied.")}>
                  Shared with Me
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => alert("Chamber filtering applied.")}>
                  Starred Records
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={() => alert("Chamber filtering applied.")}>
                  Trash Binary Bin
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Agreements & Assets</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => alert("Sorting module instantiated.")}>Sort by</Button>
                <Button variant="outline" size="sm" onClick={() => alert("Filtering criteria control opened.")}>Filter</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {documentsList.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 hover:bg-gray-50/80 rounded-lg border border-gray-100 transition-colors duration-200"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg mr-4">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {doc.name}
                        </h3>
                        {doc.shared && (
                          <Badge variant="secondary" size="sm">Shared</Badge>
                        )}
                        
                        {doc.status === 'Signed' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded">
                            <CheckCircle size={11} /> Signed
                          </span>
                        )}
                        {doc.status === 'In Review' && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded">
                            In Review
                          </span>
                        )}
                        {doc.status === 'Draft' && (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-bold px-2.5 py-0.5 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified: {doc.lastModified}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {doc.status === 'In Review' && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<PenTool size={13} />}
                          className="text-xs py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm mr-1"
                          onClick={() => openSignaturePad(doc.id)}
                        >
                          Sign Contract
                        </Button>
                      )}

                      <Button variant="ghost" size="sm" className="p-2" aria-label="Download" onClick={() => alert("Downloading localized payload bitstream...")}>
                        <Download size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2" aria-label="Share" onClick={() => alert("Link metadata references updated.")}>
                        <Share2 size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 text-red-500 hover:text-red-700" aria-label="Delete" onClick={() => alert("Purging from sandbox memory node.")}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showSignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PenTool className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Execute E-Signature Matrix</h3>
              </div>
              <button onClick={() => setShowSignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${signatureType === 'draw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setSignatureType('draw')}
                >
                  Draw Signature Pad
                </button>
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${signatureType === 'type' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setSignatureType('type')}
                >
                  Type Digital Ledger ID
                </button>
              </div>

              {signatureType === 'draw' ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Use your trackpad or cursor coordinates to draw your signature inside the boundary frame below:</p>
                  <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="cursor-crosshair w-full block h-[140px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={clearCanvas} className="text-xs text-red-500 hover:text-red-700 font-bold">Clear Canvas Layout</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Enter Legal Full Name Credentials:</label>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="e.g. Founder Corporate Officer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono italic text-blue-700 text-lg"
                  />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2 items-start">
                <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-800 font-medium">By completing this framework interaction, you acknowledge creating valid cryptographic audit tokens inside the platform node layer.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSignModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={commitElectronicSignature} className="bg-blue-600 text-white hover:bg-blue-700 font-bold">
                Apply Secure Seal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};