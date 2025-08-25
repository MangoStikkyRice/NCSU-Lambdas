import React, { useState, useEffect } from 'react';
import './MemberManagement.scss';
import dataBrothers from '../data/brothers.json';
import { YEAR_GRID_DATA } from '../constants/yearGridData';
import { loadClasses, saveClasses } from '../constants/classes';
import { youtubeVideos } from '../data/mediaCarouselData';

const MemberManagement = () => {
    const [activeTab, setActiveTab] = useState('members'); // 'members', 'yearbooks', or 'media'
    const [members, setMembers] = useState([]);
    const [yearbooks, setYearbooks] = useState([]);
    const [editingMember, setEditingMember] = useState(null);
    const [editingYearbook, setEditingYearbook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showYearbookForm, setShowYearbookForm] = useState(false);
    const [classesCatalog, setClassesCatalog] = useState(loadClasses());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Media carousel state
    const [mediaItems, setMediaItems] = useState([]);
    const [showMediaForm, setShowMediaForm] = useState(false);
    const [editingMedia, setEditingMedia] = useState(null);

    // Initialize members, yearbooks, and media from JSON/data files
    useEffect(() => {
            setMembers(Array.isArray(dataBrothers) ? dataBrothers : []);
            setYearbooks(YEAR_GRID_DATA || []);
            
        // Initialize media from data file in a generic format (url + thumbnail)
        const mediaData = youtubeVideos.map((video, index) => ({
                    id: index + 1,
                    title: video.title,
            url: video.url,
            thumbnail: video.thumbnail,
                    semester: video.semester,
                    year: video.year
        }));
            setMediaItems(mediaData);
    }, []);

    // Empty member template
    const emptyMember = {
        id: '',
        name: '',
        line_name: '',
        class_field: '',
        status: 'Actives',
        major: '',
        image: '',
        casual_image1: '',
        casual_image2: '',
        casual_image3: '',
        bigId: '',
        littleIds: [],
        hobbies: [],
        positions: [],
        nationalities: []
    };

    // Filter members based on search and status
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.line_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.id.toString().includes(searchTerm);
        
        const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    // Add new member
    const handleAddMember = () => {
        const newId = Math.max(...members.map(m => parseInt(m.id) || 0)) + 1;
        setEditingMember({ ...emptyMember, id: newId.toString() });
        setShowForm(true);
    };

    // Edit existing member
    const handleEditMember = (member) => {
        setEditingMember({ ...member });
        setShowForm(true);
    };

    // Delete member
    const handleDeleteMember = (memberId) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            setMembers(members.filter(m => m.id !== memberId));
        }
    };

    // Save member (add or update)
    const handleSaveMember = (memberData) => {
        if (members.find(m => m.id === memberData.id && m.id !== editingMember?.id)) {
            alert('Member ID already exists!');
            return;
        }

        if (members.find(m => m.id === editingMember?.id)) {
            // Update existing
            setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
        } else {
            // Add new
            setMembers([...members, memberData]);
        }
        
        setShowForm(false);
        setEditingMember(null);
    };

    // Cancel editing
    const handleCancel = () => {
        setShowForm(false);
        setEditingMember(null);
    };

    // Export to JSON
    const handleExportJSON = () => {
        if (activeTab === 'members') {
            const dataStr = JSON.stringify(members, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'brothers.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } else if (activeTab === 'yearbooks') {
            // Export yearbooks with top-level imports for local images (no comments)
            const imageVarByPath = new Map();
            const importLines = [];

            const normalizePath = (p) => {
                if (!p) return '';
                // Normalize to path relative to constants: '../backend/media/class/...'
                const cleaned = p.replace(/^\/*src\//, '../')
                                 .replace(/^\/*/, '')
                                 .replace(/^backend\//, '../backend/');
                if (cleaned.startsWith('../')) return cleaned;
                return `../${cleaned}`;
            };

            const getVarName = (year, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C...
                return `class${year}${letter}Image`;
            };

            // Build import statements
            yearbooks.forEach((yb) => {
                (yb.classes || []).forEach((cls, idx) => {
                    const img = cls.image;
                    if (img && !/^https?:\/\//i.test(img)) {
                        const norm = normalizePath(img);
                        if (!imageVarByPath.has(norm)) {
                            const varName = getVarName(yb.year, idx);
                            imageVarByPath.set(norm, varName);
                            importLines.push(`import ${varName} from '${norm}';`);
                        }
                    }
                });
            });

            // Build YEAR_GRID_DATA with image fields referencing vars when local
            const serialize = () => {
                const parts = [];
                parts.push('export const YEAR_GRID_DATA = [');
                yearbooks.forEach((yb, yi) => {
                    parts.push('  {');
                    parts.push(`    year: '${yb.year}',`);
                    parts.push('    classes: [');
                    (yb.classes || []).forEach((cls, ci) => {
                        const img = cls.image;
                        let imageValue;
                        if (img && !/^https?:\/\//i.test(img)) {
                            const norm = normalizePath(img);
                            const varName = imageVarByPath.get(norm) || getVarName(yb.year, ci);
                            imageValue = varName;
                        } else if (img) {
                            imageValue = JSON.stringify(img);
                        } else {
                            imageValue = '""';
                        }
                        parts.push('      {');
                        parts.push(`        className: ${JSON.stringify(cls.className || '')},`);
                        parts.push(`        PM: ${JSON.stringify(cls.PM || '')},`);
                        parts.push(`        PD: ${JSON.stringify(cls.PD || '')},`);
                        parts.push(`        image: ${imageValue},`);
                        parts.push('      }' + (ci < (yb.classes || []).length - 1 ? ',' : ''));
                    });
                    parts.push('    ]');
                    parts.push('  }' + (yi < yearbooks.length - 1 ? ',' : ''));
                });
                parts.push('];');
                return parts.join('\n');
            };

            const normalizePathDirect = (p) => {
                if (!p) return '';
                const cleaned = p.replace(/^\/*src\//, '../')
                                 .replace(/^\/*/, '')
                                 .replace(/^backend\//, '../backend/');
                if (/^https?:\/\//i.test(cleaned)) return cleaned;
                if (cleaned.startsWith('../')) return cleaned;
                return `../${cleaned}`;
            };
            const directData = yearbooks.map((yb) => ({
                year: String(yb.year || ''),
                classes: (yb.classes || []).map((cls) => ({
                    className: cls.className || '',
                    PM: cls.PM || '',
                    PD: cls.PD || '',
                    semester: cls.semester || '',
                    image: normalizePathDirect(cls.image || '')
                }))
            }));
            const jsContent = `export const YEAR_GRID_DATA = ${JSON.stringify(directData, null, 2)};\n`;

            const dataUri = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(jsContent);
            const exportFileDefaultName = 'yearGridData.js';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } else if (activeTab === 'classes') {
            // Export classes config as JS module
            const jsContent = `// Central class catalog used by Management and Brothers page\nexport const DEFAULT_CLASSES = ${JSON.stringify(classesCatalog, null, 2)};\n\nconst STORAGE_KEY = 'classesCatalog';\n\nexport const loadClasses = () => {\n  try {\n    const saved = localStorage.getItem(STORAGE_KEY);\n    const classes = saved ? JSON.parse(saved) : DEFAULT_CLASSES;\n    return Array.isArray(classes) ? classes : DEFAULT_CLASSES;\n  } catch {\n    return DEFAULT_CLASSES;\n  }\n};\n\nexport const saveClasses = (classes) => {\n  try {\n    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));\n    return true;\n  } catch {\n    return false;\n  }\n};\n`;
            const dataUri = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(jsContent);
            const exportFileDefaultName = 'classes.js';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } else {
            // Export media carousel as JS file (matches app import contract)
            const sanitized = mediaItems.map(({ title, url, thumbnail, semester, year }) => ({
                title,
                url,
                thumbnail,
                semester,
                year
            }));
            const jsContent = `// YouTube carousel data for the Media page
export const youtubeVideos = ${JSON.stringify(sanitized, null, 2)};
`;
            const dataUri = 'data:text/javascript;charset=utf-8,'+ encodeURIComponent(jsContent);
            
            const exportFileDefaultName = 'mediaCarouselData.js';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    };

    // Yearbook management functions
    const handleAddYearbook = () => {
        const newYear = {
            year: new Date().getFullYear().toString(),
            classes: []
        };
        setEditingYearbook(newYear);
        setShowYearbookForm(true);
    };

    // Classes management
    const handleAddClassName = () => {
        const name = prompt('Enter new class name');
        if (!name) return;
        const id = name.toLowerCase().split(/\s+/).shift();
        const updated = [...classesCatalog, { id, name }];
        setClassesCatalog(updated);
        saveClasses(updated);
        alert('Class added to catalog. It is now available in dropdowns.');
    };

    const handleEditYearbook = (yearbook) => {
        setEditingYearbook({ ...yearbook });
        setShowYearbookForm(true);
    };

    const handleDeleteYearbook = (year) => {
        if (window.confirm(`Are you sure you want to delete the ${year} yearbook?`)) {
            setYearbooks(yearbooks.filter(y => y.year !== year));
        }
    };

    const handleSaveYearbook = (yearbookData) => {
        const existingIndex = yearbooks.findIndex(y => y.year === yearbookData.year);
        
        if (existingIndex >= 0) {
            // Update existing
            const updated = [...yearbooks];
            updated[existingIndex] = yearbookData;
            setYearbooks(updated);
        } else {
            // Add new
            setYearbooks([...yearbooks, yearbookData].sort((a, b) => a.year - b.year));
        }
        
        setShowYearbookForm(false);
        setEditingYearbook(null);
    };

    const handleCancelYearbook = () => {
        setShowYearbookForm(false);
        setEditingYearbook(null);
    };

    // Media management functions
    const handleAddMedia = () => {
        setEditingMedia({
            id: Date.now(),
            title: '',
            url: '',
            thumbnail: '',
            semester: '',
            year: new Date().getFullYear()
        });
        setShowMediaForm(true);
    };

    const handleEditMedia = (media) => {
        setEditingMedia(media);
        setShowMediaForm(true);
    };

    const handleDeleteMedia = (id) => {
        if (confirm('Are you sure you want to delete this media item?')) {
            setMediaItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleSaveMedia = (mediaData) => {
        // Normalize payload: ensure thumbnail present if YouTube
        const extractYouTubeId = (link) => {
            const match = (link || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            return match ? match[1] : '';
        };
        const ytId = extractYouTubeId(mediaData.url);
        const normalizedThumbnail = mediaData.thumbnail && mediaData.thumbnail.trim() !== ''
            ? mediaData.thumbnail
            : (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

        const normalized = { ...mediaData, thumbnail: normalizedThumbnail };

        if (editingMedia && mediaItems.find(m => m.id === editingMedia.id)) {
            setMediaItems(prev => prev.map(item => item.id === editingMedia.id ? normalized : item));
        } else {
            setMediaItems(prev => [...prev, normalized]);
        }
        setShowMediaForm(false);
        setEditingMedia(null);
    };

    const handleCancelMedia = () => {
        setShowMediaForm(false);
        setEditingMedia(null);
    };

    return (
        <div className="member-management">
            <div className="management-header">
                <a href="/" className="home-button">← Home</a>
                <h1>Management Panel</h1>
                <div className="header-actions">
                    <button 
                        className="btn-primary" 
                        onClick={
                            activeTab === 'members'
                                ? handleAddMember
                                : activeTab === 'yearbooks'
                                    ? handleAddYearbook
                                    : activeTab === 'classes'
                                        ? handleAddClassName
                                        : handleAddMedia
                        }
                    >
                        {activeTab === 'members'
                            ? 'Add New Member'
                            : activeTab === 'yearbooks'
                                ? 'Add New Year'
                                : activeTab === 'classes'
                                    ? 'Add Class'
                                    : 'Add Media Link'}
                    </button>
                    <button className="btn-secondary" onClick={handleExportJSON}>
                        {activeTab === 'members'
                            ? 'Export Members'
                            : activeTab === 'yearbooks'
                                ? 'Export Yearbooks'
                                : activeTab === 'classes'
                                    ? 'Export Classes'
                                    : 'Export Media'}
                    </button>
                </div>
            </div>

            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => setActiveTab('members')}
                >
                    Members ({members.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'yearbooks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('yearbooks')}
                >
                    Yearbooks ({yearbooks.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'media' ? 'active' : ''}`}
                    onClick={() => setActiveTab('media')}
                >
                    Media Carousel ({mediaItems.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classes')}
                >
                    Classes ({classesCatalog.length})
                </button>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name, line name, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter"
                >
                    <option value="all">All Statuses</option>
                    <option value="Actives">Actives</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Associates">Associates</option>
                </select>
            </div>

            {activeTab === 'members' && (
                <div className="members-list">
                <div className="list-header">
                    <span>Image</span>
                    <span>ID</span>
                    <span>Name</span>
                    <span>Line Name</span>
                    <span>Class</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>
                
                {filteredMembers.map(member => (
                    <div key={member.id} className="member-row">
                        <div className="member-image">
                            {member.image ? (
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="image-placeholder" style={{display: member.image ? 'none' : 'flex'}}>
                                <span>No Image</span>
                            </div>
                        </div>
                        <div className="member-info">
                            <div className="member-name">{member.name}</div>
                            <div className="member-details">
                                #{member.id} • '{member.line_name}' • {member.status}
                            </div>
                        </div>
                        <span className="desktop-only">{member.id}</span>
                        <span className="desktop-only">{member.name}</span>
                        <span className="desktop-only">'{member.line_name}'</span>
                        <span className="desktop-only">{member.class_field}</span>
                        <span className="desktop-only">{member.status}</span>
                        <div className="actions">
                            <button 
                                className="btn-edit"
                                onClick={() => handleEditMember(member)}
                            >
                                Edit
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={() => handleDeleteMember(member.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {activeTab === 'members' && (
                <div className="member-count">
                    Total Members: {filteredMembers.length} / {members.length}
                </div>
            )}

            {activeTab === 'yearbooks' && (
                <YearbookList 
                    yearbooks={yearbooks}
                    onEdit={handleEditYearbook}
                    onDelete={handleDeleteYearbook}
                />
            )}

            {activeTab === 'media' && (
                <MediaList 
                    mediaItems={mediaItems}
                    onEdit={handleEditMedia}
                    onDelete={handleDeleteMedia}
                />
            )}

            {activeTab === 'classes' && (
                <div className="yearbooks-list">
                    <div className="list-header">
                        <span>Name</span>
                        <span>Actions</span>
                    </div>
                    {classesCatalog.map((c, i) => (
                        <div key={c.id + i} className="yearbook-row">
                            <span className="year">{c.name}</span>
                            <div className="actions">
                                <button className="btn-edit" onClick={() => {
                                    const newName = prompt('Rename class', c.name);
                                    if (!newName || newName === c.name) return;
                                    const updated = classesCatalog.map((x) => x === c ? { ...x, name: newName } : x);
                                    setClassesCatalog(updated);
                                    saveClasses(updated);
                                }}>Rename</button>
                                <button className="btn-delete" onClick={() => {
                                    if (!confirm('Remove this class from catalog?')) return;
                                    const updated = classesCatalog.filter((x) => x !== c);
                                    setClassesCatalog(updated);
                                    saveClasses(updated);
                                }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <div className="actions" style={{ padding: '10px 20px' }}>
                        <button className="btn-secondary" onClick={handleAddClassName}>Add Class</button>
                    </div>
                </div>
            )}

            {showForm && (
                <MemberForm
                    member={editingMember}
                    onSave={handleSaveMember}
                    onCancel={handleCancel}
                    existingMembers={members}
                />
            )}

            {showYearbookForm && (
                <YearbookForm
                    yearbook={editingYearbook}
                    onSave={handleSaveYearbook}
                    onCancel={handleCancelYearbook}
                />
            )}

            {showMediaForm && (
                <MediaForm
                    media={editingMedia}
                    onSave={handleSaveMedia}
                    onCancel={handleCancelMedia}
                />
            )}
        </div>
    );
};

// Member Form Component
const MemberForm = ({ member, onSave, onCancel, existingMembers }) => {
    const [formData, setFormData] = useState(member);
    const [hobbiesInput, setHobbiesInput] = useState(member.hobbies?.join(', ') || '');
    const [classesOptions] = useState(loadClasses());
    const [useExternalBig, setUseExternalBig] = useState(!member.bigId && !!member.bigExternalName);
    const [externalBigName, setExternalBigName] = useState(member.bigExternalName || '');
    const [selectedLittleIds, setSelectedLittleIds] = useState(Array.isArray(member.littleIds) ? member.littleIds : []);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const processedData = {
            ...formData,
            hobbies: hobbiesInput.split(',').map(h => h.trim()).filter(h => h),
            littleIds: selectedLittleIds,
            bigId: useExternalBig ? '' : formData.bigId,
            bigExternalName: useExternalBig ? externalBigName : ''
        };

        onSave(processedData);
    };

    const availableBigs = existingMembers.filter(m => m.id !== formData.id);

    return (
        <div className="form-overlay">
            <div className="member-form">
                <h2>{member.id ? 'Edit Member' : 'Add New Member'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>ID</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => handleChange('id', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Line Name</label>
                            <input
                                type="text"
                                value={formData.line_name}
                                onChange={(e) => handleChange('line_name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Class</label>
                            <select
                                value={formData.class_field}
                                onChange={(e) => handleChange('class_field', e.target.value)}
                                required
                            >
                                <option value="">Select Class</option>
                                {classesOptions.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                required
                            >
                                <option value="Actives">Actives</option>
                                <option value="Alumni">Alumni</option>
                                <option value="Associates">Associates</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Major</label>
                            <input
                                type="text"
                                value={formData.major}
                                onChange={(e) => handleChange('major', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Big Brother</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input
                                        type="checkbox"
                                        checked={useExternalBig}
                                        onChange={(e) => setUseExternalBig(e.target.checked)}
                                    />
                                    Big not at NCSU (external)
                                </label>
                            </div>
                            {!useExternalBig && (
                                <select
                                    value={formData.bigId || ''}
                                    onChange={(e) => handleChange('bigId', e.target.value)}
                                >
                                    <option value="">No Big</option>
                                    {availableBigs.map(big => (
                                        <option key={big.id} value={big.id}>
                                            {big.name} ({big.id})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {useExternalBig && (
                                <input
                                    type="text"
                                    value={externalBigName}
                                    onChange={(e) => setExternalBigName(e.target.value)}
                                    placeholder="External big's name"
                                />
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label>Main Image URL or local path</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                                placeholder="https://... or /assets/..."
                            />
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Main preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Casual Image 1 URL or local path</label>
                            <input
                                type="text"
                                value={formData.casual_image1}
                                onChange={(e) => handleChange('casual_image1', e.target.value)}
                                placeholder="https://... or /assets/..."
                            />
                            {formData.casual_image1 && (
                                <div className="image-preview small">
                                    <img src={formData.casual_image1} alt="Casual 1 preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Casual Image 2 URL or local path</label>
                            <input
                                type="text"
                                value={formData.casual_image2}
                                onChange={(e) => handleChange('casual_image2', e.target.value)}
                                placeholder="https://... or /assets/..."
                            />
                            {formData.casual_image2 && (
                                <div className="image-preview small">
                                    <img src={formData.casual_image2} alt="Casual 2 preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Casual Image 3 URL or local path</label>
                            <input
                                type="text"
                                value={formData.casual_image3}
                                onChange={(e) => handleChange('casual_image3', e.target.value)}
                                placeholder="https://... or /assets/..."
                            />
                            {formData.casual_image3 && (
                                <div className="image-preview small">
                                    <img src={formData.casual_image3} alt="Casual 3 preview" />
                                </div>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label>Hobbies (comma separated)</label>
                            <input
                                type="text"
                                value={hobbiesInput}
                                onChange={(e) => setHobbiesInput(e.target.value)}
                                placeholder="Gaming, Reading, Sports..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Littles</label>
                            <div style={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #eee',
                                borderRadius: '6px',
                                padding: '8px'
                            }}>
                                {existingMembers
                                    .filter(m => m.id !== formData.id)
                                    .map(m => {
                                        const checked = selectedLittleIds.map(String).includes(String(m.id));
                                        return (
                                            <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        const idStr = String(m.id);
                                                        if (e.target.checked) {
                                                            setSelectedLittleIds(prev => Array.from(new Set([...prev.map(String), idStr])));
                                                        } else {
                                                            setSelectedLittleIds(prev => prev.filter(id => String(id) !== idStr));
                                                        }
                                                    }}
                                                />
                                                {m.name} ({m.id})
                                            </label>
                                        );
                                    })}
                            </div>
                            <small>Select one or more littles.</small>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Yearbook List Component
const YearbookList = ({ yearbooks, onEdit, onDelete }) => {
    return (
        <div className="yearbooks-list">
            <div className="list-header">
                <span>Year</span>
                <span>Classes</span>
                <span>Class Names</span>
                <span>Actions</span>
            </div>
            
            {yearbooks.map(yearbook => (
                <div key={yearbook.year} className="yearbook-row">
                    <span className="year">{yearbook.year}</span>
                    <span>{yearbook.classes.length}</span>
                    <span className="class-names">
                        {yearbook.classes.map(c => c.className).join(', ')}
                    </span>
                    <div className="actions">
                        <button 
                            className="btn-edit"
                            onClick={() => onEdit(yearbook)}
                        >
                            Edit
                        </button>
                        <button 
                            className="btn-delete"
                            onClick={() => onDelete(yearbook.year)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Yearbook Form Component
const YearbookForm = ({ yearbook, onSave, onCancel }) => {
    const [formData, setFormData] = useState(yearbook);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClassChange = (index, field, value) => {
        const updatedClasses = [...formData.classes];
        updatedClasses[index] = {
            ...updatedClasses[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            classes: updatedClasses
        }));
    };

    const addNewClass = () => {
        if (formData.classes.length >= 2) {
            alert('Maximum 2 classes per year allowed!');
            return;
        }
        setFormData(prev => ({
            ...prev,
            classes: [...prev.classes, {
                className: '',
                PM: '',
                PD: '',
                image: '',
                semester: ''
            }]
        }));
    };

    const removeClass = (index) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="form-overlay">
            <div className="yearbook-form">
                <h2>{yearbook.year ? `Edit ${yearbook.year} Yearbook` : 'Add New Yearbook'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Year</label>
                        <input
                            type="text"
                            value={formData.year}
                            onChange={(e) => handleChange('year', e.target.value)}
                            required
                        />
                    </div>

                    <div className="classes-section">
                        <h3>Classes</h3>
                        {formData.classes.map((classItem, index) => (
                            <div key={index} className="class-item">
                                <div className="class-header">
                                    <h4>Class {index + 1}</h4>
                                    <button 
                                        type="button" 
                                        className="btn-delete"
                                        onClick={() => removeClass(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                
                                <div className="class-form-grid">
                                    <div className="form-group">
                                        <label>Class Name</label>
                                        <input
                                            type="text"
                                            value={classItem.className}
                                            onChange={(e) => handleClassChange(index, 'className', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>PM (Pledge Master)</label>
                                        <input
                                            type="text"
                                            value={classItem.PM}
                                            onChange={(e) => handleClassChange(index, 'PM', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>PD (Pledge Dad)</label>
                                        <input
                                            type="text"
                                            value={classItem.PD}
                                            onChange={(e) => handleClassChange(index, 'PD', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Semester</label>
                                        <select
                                            value={classItem.semester || ''}
                                            onChange={(e) => handleClassChange(index, 'semester', e.target.value)}
                                        >
                                            <option value="">Select Semester</option>
                                            <option value="Spring">Spring</option>
                                            <option value="Fall">Fall</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Image URL or local path</label>
                                        <input
                                            type="text"
                                            value={classItem.image}
                                            onChange={(e) => handleClassChange(index, 'image', e.target.value)}
                                            placeholder="https://... or /assets/..."
                                        />
                                        {classItem.image && (
                                            <div className="image-preview">
                                                <img src={classItem.image} alt={`${classItem.className} preview`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={addNewClass}
                        >
                            Add New Class
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Yearbook
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Media List Component
const MediaList = ({ mediaItems, onEdit, onDelete }) => {
    return (
        <div className="media-list">
            <div className="list-header">
                <span>Title</span>
                <span>Link</span>
                <span>Preview</span>
                <span>Actions</span>
            </div>
            
            {mediaItems.map(item => (
                <div key={item.id} className="media-row">
                    <span className="media-title">{item.title}</span>
                    <span className="media-url">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.url.substring(0, 50)}...
                        </a>
                    </span>
                    <div className="media-preview">
                        {item.thumbnail && (
                            <img 
                                src={item.thumbnail}
                                alt={item.title}
                                className="video-thumbnail"
                            />
                        )}
                    </div>
                    <div className="actions">
                        <button 
                            className="btn-edit"
                            onClick={() => onEdit(item)}
                        >
                            Edit
                        </button>
                        <button 
                            className="btn-delete"
                            onClick={() => onDelete(item.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Media Form Component
const MediaForm = ({ media, onSave, onCancel }) => {
    const [formData, setFormData] = useState(media);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.url) {
            alert('Please fill in all required fields.');
            return;
        }
        
        onSave(formData);
    };

    return (
        <div className="form-overlay">
            <div className="media-form">
                <h2>{media.id ? 'Edit Media Link' : 'Add New Media Link'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Video Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter video title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Media URL (YouTube, Instagram, etc.) *</label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => handleChange('url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                            required
                        />
                        <small>Any public link will work. For Instagram, ensure the post/reel is public.</small>
                    </div>

                        <div className="form-group">
                        <label>Thumbnail URL (optional)</label>
                                    <input
                            type="url"
                            value={formData.thumbnail || ''}
                            onChange={(e) => handleChange('thumbnail', e.target.value)}
                            placeholder="https://... (leave empty for YouTube auto)"
                        />
                        </div>
                        
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Semester</label>
                            <select
                                value={formData.semester || ''}
                                onChange={(e) => handleChange('semester', e.target.value)}
                            >
                                <option value="">Select Semester</option>
                                <option value="Spring">Spring</option>
                                <option value="Fall">Fall</option>
                            </select>
                                            </div>
                            <div className="form-group">
                            <label>Year</label>
                                <input
                                    type="number"
                                value={formData.year || ''}
                                onChange={(e) => handleChange('year', e.target.value)}
                                placeholder="2024"
                                />
                            </div>
                                    </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={onCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-save">
                            Save Video
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default MemberManagement;
