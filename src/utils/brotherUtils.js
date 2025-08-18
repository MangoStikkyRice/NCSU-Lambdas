// Utility functions for brother data processing

export const getTitle = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Determine semester based on current month
    let semester;
    if (currentMonth >= 8 || currentMonth <= 0) { // August to December
        semester = 'Fall';
    } else if (currentMonth >= 1 && currentMonth <= 4) { // January to April
        semester = 'Spring';
    } else { // May to July
        semester = 'Summer';
    }
    
    return `${semester} ${currentYear}`;
};

export const getMemberById = (brothers, id) => {
    return brothers.find(member => member.id === id);
};

export const getBig = (brothers) => (member) => {
    if (!member.bigId) return null;
    return getMemberById(brothers, member.bigId);
};

export const getLittles = (brothers) => (member) => {
    if (!member.littleIds || member.littleIds.length === 0) return [];
    return member.littleIds.map(id => getMemberById(brothers, id)).filter(Boolean);
};

export const formatSeason = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    let season;
    if (month >= 8 || month <= 0) {
        season = 'Fall';
    } else if (month >= 1 && month <= 4) {
        season = 'Spring';
    } else {
        season = 'Summer';
    }
    
    return `${season} ${year}`;
};

export const adjustPopupPosition = (popupElement, cardElement) => {
    if (!popupElement || !cardElement) return;
    
    const cardRect = cardElement.getBoundingClientRect();
    const popupRect = popupElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = cardRect.right + 10;
    let top = cardRect.top;
    
    // Adjust if popup would go off the right edge
    if (left + popupRect.width > viewportWidth) {
        left = cardRect.left - popupRect.width - 10;
    }
    
    // Adjust if popup would go off the bottom edge
    if (top + popupRect.height > viewportHeight) {
        top = viewportHeight - popupRect.height - 10;
    }
    
    // Ensure popup doesn't go off the top edge
    if (top < 10) {
        top = 10;
    }
    
    popupElement.style.left = `${left}px`;
    popupElement.style.top = `${top}px`;
}; 