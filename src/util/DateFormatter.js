const formatDateString = date => {
    if (!date) return '-';
    
    const temp = new Date(date);
    
    if (isNaN(temp.getTime())) return '-';
    
    const year = temp.getFullYear();
    const month = (temp.getMonth() + 1).toString().padStart(2, '0');
    const day = temp.getDate().toString().padStart(2, '0');
    const hour = temp.getHours().toString().padStart(2, '0');
    const minutes = temp.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minutes}`;
};

const formatYMDString = date => {
    if (!date) return null;

    const temp = new Date(date);

    if (isNaN(temp.getTime())) return null;

    const year = temp.getFullYear();
    const month = (temp.getMonth() + 1).toString().padStart(2, '0');
    const day = temp.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export {
    formatDateString,
    formatYMDString,
};
